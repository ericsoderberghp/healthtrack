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
import { Add, Trash } from 'grommet-icons';
import { DateInput, Page } from './components';
import TrackContext from './TrackContext';
import { getCategory } from './track';

const now = new Date();
now.setHours(0, 0, 0, 0);
const sevenDaysAgo = new Date(now);
sevenDaysAgo.setDate(now.getDate() - 7);
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
  const [showCalendar, setShowCalendar] = useState();

  // initialize the first category to the latest symptom
  useEffect(() => {
    if (track && !categories.length && track.data.length) {
      setCategories([getCategory(track, track.data[0].category)]);
    }
  }, [categories, track]);

  const data = useMemo(() => {
    const data = [];
    if (track && categories.length > 0) {
      const [date1, date2] = dates.map((d) => new Date(d));

      // prune the data down to just what the filter matches
      const start = date1.toISOString().split('T')[0];
      const end = date2.toISOString().split('T')[0];
      const categoryData = categories.map((category) =>
        track.data.filter(
          (datum) =>
            datum.category === category.id &&
            datum.date >= start &&
            datum.date <= end,
        ),
      );

      // generate the DataChart data
      const date = new Date(date1);
      const max = 10;
      const min = 0;
      // create an object for each day
      while (date <= date2) {
        const current = date.toISOString().split('T')[0];
        const datum = { date: current };
        // create a keyed value on the current day for each category
        categories.forEach((category, index) => {
          let keyName = category.name;
          let dayValue = 0;
          categoryData[index]
            // filter out to the data just for the current day
            .filter((d) => d.date.split('T')[0] === current)
            .forEach((dayData) => {
              // normalize the values so they can be overlaid within min-max
              if (category.type === 'yes/no') {
                // yes/no existence -> max
                dayValue = max;
              } else if (category.type === 'rating') {
                // rating 1-5 -> min-max
                const normalizedValue = dayData.value * (max / 5);
                // if multiple on the same day, take the largest
                dayValue = Math.max(datum[keyName] || 0, normalizedValue);
              } else if (category.type === 'number') {
                // number -> within min/max
                // if multiple on the same day, add them
                dayValue = Math.min(
                  max,
                  Math.max(min, (dayValue || 0) + dayData.value),
                );
              } else if (category.type === 'name') {
                // value -> within min/max
                keyName = dayData.name;
                // allow for multiple on the same day, add them up
                dayValue = Math.min(
                  max,
                  Math.max(min, (dayValue || 0) + dayData.value),
                );
              }
            });
          datum[keyName] = dayValue;
        });

        data.push(datum);
        date.setDate(date.getDate() + 1);
      }
    }
    return data;
  }, [categories, dates, track]);

  const charts = useMemo(() => {
    const charts = [];
    categories.forEach((category, index) => {
      const base = { key: category.name, round: true, color: `graph-${index}` };
      charts.push({ ...base, type: 'line' });
      charts.push({ ...base, type: 'point', thickness: 'small' });
    });
    return charts;
  }, [categories]);

  if (!track) return null;

  return (
    <Page>
      <Box pad={{ horizontal: 'medium' }} responsive={false}>
        <Header>
          <Heading>correlate</Heading>
          <Button
            label={`${dateFormat.format(
              new Date(dates[0]),
            )} - ${dateFormat.format(new Date(dates[1]))}`}
            hoverIndicator
            onClick={() => setShowCalendar(!showCalendar)}
          />
        </Header>
        {showCalendar && (
          <Box align="end" margin={{ bottom: 'medium' }}>
            <DateInput
              name="dates"
              inline
              size={size === 'small' ? size : undefined}
              value={dates}
              onChange={({ value }) => setDates(value)}
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
              {categories.length > 0 && (
                <Button
                  icon={<Trash />}
                  hoverIndicator
                  onClick={() => {
                    const nextCategories = [...categories];
                    nextCategories.splice(index, 1);
                    setCategories(nextCategories);
                  }}
                />
              )}
            </Box>
          ))}
          <Box direction="row" justify="end">
            <Button
              icon={<Add />}
              hoverIndicator
              onClick={() => {
                const nextCategories = [...categories];
                nextCategories.push('');
                setCategories(nextCategories);
              }}
            />
          </Box>
        </Box>

        {data && categories.length > 0 && (
          <Box margin={{ vertical: 'large' }}>
            <DataChart
              data={data}
              chart={charts}
              xAxis={{ key: 'date', guide: true, labels: 5 }}
              pad="small"
              gap="medium"
              thickness="xsmall"
              size={{ width: 'fill', height: 'small' }}
            />
          </Box>
        )}
      </Box>
    </Page>
  );
};

export default Correlate;
