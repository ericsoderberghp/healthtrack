import React, { useContext, useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  DataChart,
  Header,
  Heading,
  ResponsiveContext,
  Select,
} from 'grommet';
import { Add, Close } from 'grommet-icons';
import { DateInput, Page } from './components';
import TrackContext from './TrackContext';
import { alignDate, betweenDates, sameDate } from './utils';

const now = alignDate(new Date());
const sevenDaysAgo = new Date(now);
sevenDaysAgo.setDate(now.getDate() - 6);
const dateFormat = new Intl.DateTimeFormat(undefined, {
  month: 'short',
  day: 'numeric',
});

const SelectCategory = ({ track, value, onChange }) => {
  const [options, setOptions] = useState(track.categories);
  return (
    <Select
      options={options}
      labelKey="name"
      valueKey="id" // not reduced
      value={value}
      onSearch={(search) => {
        if (search) {
          const exp = new RegExp(search, 'i');
          setOptions(track.categories.filter((c) => exp.test(c.name)));
        } else setOptions(track.categories);
      }}
      onChange={({ option }) => onChange(option)}
      onClose={() => setOptions(track.categories)}
    />
  );
};

const Correlate = () => {
  const size = useContext(ResponsiveContext);
  const [track] = useContext(TrackContext);
  const [dates, setDates] = useState([
    sevenDaysAgo.toISOString(),
    now.toISOString(),
  ]);
  const [categories, setCategories] = useState([]);
  const [addCategory, setAddCategory] = useState();

  // initialize categories to daily symptoms
  useEffect(() => {
    setCategories(
      track.categories.filter((c) => c.aspect === 'symptom' && c.frequency),
    );
  }, [track.categories]);

  // build data for DataChart
  const data = useMemo(() => {
    const data = [];
    if (categories.length > 0) {
      const [date1, date2] = dates.map((d) => new Date(d));

      // prune the data down to just what the filter matches
      const categoryData = categories.map((category) =>
        track.data.filter(
          (datum) =>
            datum.category === category.id &&
            betweenDates(datum.date, date1, date2),
        ),
      );

      // generate the DataChart data
      const date = new Date(date1);
      // create an object for each day
      while (date <= date2) {
        const datum = { date: date.toISOString() };
        // create a keyed value on the current day for each category
        categories.forEach((category, index) => {
          let keyName = category.name;
          let dayValue = undefined;
          categoryData[index]
            // filter out to the data just for the current day
            .filter((d) => sameDate(d.date, date))
            .forEach((dayData) => {
              // normalize the values so they can be overlaid within min-max
              if (category.type === 'yes/no') {
                // if multiple, yes wins
                dayValue = Math.max(datum[keyName] || 0, dayData.value ? 1 : 0);
              } else if (category.type === 'scale') {
                // if multiple on the same day, take the largest
                dayValue = Math.max(datum[keyName] || 0, dayData.value);
              } else if (category.type === 'number') {
                // if multiple on the same day, add them
                // TODO: add max to category
                dayValue = (dayValue || 0) + dayData.value;
              } else if (category.type === 'name') {
                keyName = dayData.name;
                // allow for multiple on the same day, add them up
                dayValue = (dayValue || 0) + dayData.value;
              }
            });
          if (dayValue !== undefined) datum[keyName] = dayValue;
        });

        data.push(datum);
        date.setDate(date.getDate() + 1);
      }
    }
    return data;
  }, [categories, dates, track]);

  // build charts for DataChart
  const charts = useMemo(() => {
    const charts = [];
    categories.forEach((category, index) => {
      const base = {
        key: category.name,
        round: true,
        color: `graph-${index}`,
        bounds: [
          [0, data.length - 1],
          [0, Math.max(...data.map((d) => d[category.name] || 0))],
        ],
      };
      charts.push({ ...base, type: 'line' });
      charts.push({ ...base, type: 'point', thickness: 'small' });
    });
    return charts;
  }, [categories, data]);

  return (
    <Page>
      <Box pad={{ horizontal: 'medium' }} responsive={false}>
        <Header>
          <Heading>correlate</Heading>
          <DateInput
            name="dates"
            label={`${dateFormat.format(
              new Date(dates[0]),
            )} - ${dateFormat.format(new Date(dates[1]))}`}
            size={size === 'small' ? size : undefined}
            value={dates}
            onChange={({ value }) => setDates(value)}
          />
        </Header>
        {categories.length > 0 && (
          <Box margin={{ vertical: 'large' }}>
            <DataChart
              data={data}
              chart={charts}
              xAxis={{
                key: 'date',
                guide: true,
                labels: Math.min(7, data.length),
              }}
              pad="small"
              gap="medium"
              thickness="xsmall"
              size={{ width: 'fill', height: 'small' }}
            />
          </Box>
        )}
        <Box gap="small">
          {categories.map((category, index) => (
            <Box
              key={index}
              direction="row"
              gap="medium"
              justify="between"
              align="center"
            >
              <Box direction="row" gap="small" align="center">
                <Box pad="small" background={`graph-${index}`} round="full" />
                <SelectCategory
                  track={track}
                  value={category}
                  onChange={(nextCategory) => {
                    const nextCategories = [...categories];
                    nextCategories[index] = nextCategory;
                    setCategories(nextCategories);
                  }}
                />
              </Box>
              <Button
                icon={<Close />}
                onClick={() => {
                  const nextCategories = [...categories];
                  nextCategories.splice(index, 1);
                  setCategories(nextCategories);
                }}
              />
            </Box>
          ))}
          {addCategory ? (
            <Box direction="row" gap="medium" justify="between" align="center">
              <Box direction="row" gap="small" align="center">
                <Box pad="small" round="full" />
                <SelectCategory
                  track={track}
                  value={''}
                  onChange={(nextCategory) => {
                    const nextCategories = [...categories];
                    nextCategories.push(nextCategory);
                    setCategories(nextCategories);
                    setAddCategory(false);
                  }}
                />
              </Box>
              <Button icon={<Close />} onClick={() => setAddCategory(false)} />
            </Box>
          ) : (
            <Box direction="row" justify="end">
              <Button icon={<Add />} onClick={() => setAddCategory(true)} />
            </Box>
          )}
        </Box>
      </Box>
    </Page>
  );
};

export default Correlate;
