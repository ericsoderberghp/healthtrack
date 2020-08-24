import React, { useContext, useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  DataChart,
  DateInput,
  Header,
  Heading,
  ResponsiveContext,
  Select,
} from 'grommet';
import { Add, Close } from 'grommet-icons';
import { Page } from './components';
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

  // initialize categories to local storage or daily symptoms
  useEffect(() => {
    const stored = global.localStorage.getItem('correlate');
    const correlate = stored && JSON.parse(stored);
    setCategories(
      track.categories.filter((c) =>
        correlate
          ? correlate.categories.find((name) => name === c.name)
          : c.aspect === 'symptom' && c.times,
      ),
    );
  }, [track.categories]);

  useEffect(() => {
    // save categories in local storage when they change
    global.localStorage.setItem(
      'correlate',
      JSON.stringify({ categories: categories.map((c) => c.name) }),
    );
  }, [categories]);

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
              // normalize the values
              if (category.type === 'yes/no') {
                // if multiple, yes wins
                dayValue = Math.max(datum[keyName] || 0, dayData.value ? 1 : 0);
              } else if (category.type === 'scale') {
                // if multiple on the same day, take the largest
                dayValue = Math.max(datum[keyName] || 0, dayData.value);
              } else if (category.type === 'number') {
                // if multiple on the same day, add them
                // TODO: average them instead
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
      // For number categories, pick min/max to be just outside the
      // data set. This works better for things like weight.
      let yMin;
      let yMax;
      if (category.type === 'number') {
        const values = data
          .filter((d) => d[category.name] !== undefined)
          .map((d) => d[category.name]);
        yMin = Math.min(...values);
        yMax = Math.max(...values);
        const delta = Math.max(yMax - yMin, 2);
        yMin = Math.max(0, yMin - delta / 2);
        yMax = yMax + delta / 2;
      } else if (category.type === 'scale') {
        yMin = 0;
        yMax = 5;
      } else if (category.type === 'yes/no') {
        yMin = 0;
        yMax = 1;
      } else {
        yMin = 0;
        yMax = Math.max(...data.map((d) => d[category.name] || 0));
      }
      const base = {
        property: category.name,
        round: true,
        color: `graph-${index}`,
        bounds: [
          [0, data.length - 1],
          [yMin, yMax],
        ],
      };
      charts.push({ ...base, type: 'line', thickness: 'xxsmall' });
      charts.push({ ...base, type: 'point', thickness: 'small' });
    });
    return charts;
  }, [categories, data]);

  return (
    <Page>
      <Box pad={{ horizontal: 'large' }}>
        <Header>
          <Heading>correlate</Heading>
          <DateInput
            name="dates"
            buttonProps={{
              label: `${dateFormat.format(
                new Date(dates[0]),
              )} - ${dateFormat.format(new Date(dates[1]))}`,
              reverse: true,
            }}
            size={size === 'small' ? size : undefined}
            value={dates}
            onChange={({ value }) => setDates(value)}
          />
        </Header>

        {categories.length > 0 && (
          <Box margin={{ vertical: 'large' }}>
            <DataChart
              data={data}
              series={['date', ...categories.map((c) => c.name)]}
              chart={charts}
              axis={{
                x: {
                  property: 'date',
                  granularity: data.length < 8 ? 'fine' : 'coarse',
                },
              }}
              guide={{ x: { granularity: 'fine' } }}
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
