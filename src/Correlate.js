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
  TextInput,
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
  const [criteria, setCriteria] = useState([]);
  const [addCriteria, setAddCriteria] = useState();

  // initialize categories to local storage or daily symptoms
  useEffect(() => {
    const stored = global.localStorage.getItem('correlate');
    const correlate = stored && JSON.parse(stored);
    if (correlate) setCriteria(correlate);
    else {
      const nextCriteria = [];
      track.categories.forEach((c) => {
        if (c.aspect === 'symptom' && c.times) {
          nextCriteria.push({ category: c.id, key: c.name });
        }
      });
      setCriteria(nextCriteria);
    }
  }, [track.categories]);

  useEffect(() => {
    // save criteria in local storage when they change
    global.localStorage.setItem('correlate', JSON.stringify(criteria));
  }, [criteria]);

  // build data for DataChart, array per criteria/chart
  const data = useMemo(() => {
    const data = [];
    if (criteria.length > 0) {
      const [date1, date2] = dates.map((d) => new Date(d));

      // prune the data down to just what the criteria matches
      const criteriaData = criteria.map(({ category, pattern }) =>
        track.data.filter(
          (datum) =>
            datum.category === category &&
            (!pattern || datum.value.match(new RegExp(pattern, 'g'))) &&
            betweenDates(datum.date, date1, date2),
        ),
      );

      // generate the DataChart data
      const date = new Date(date1);
      // create an object for each day
      while (date <= date2) {
        const datum = { date: date.toISOString() };
        // create a keyed value on the current day for each category
        criteria.forEach(({ category: categoryId, key }, index) => {
          const category = track.categories.find((c) => c.id === categoryId);
          let dayValue = undefined;
          criteriaData[index]
            // filter out to the data just for the current day
            .filter((d) => sameDate(d.date, date))
            .forEach((dayData) => {
              // normalize the values
              if (category.type === 'yes/no') {
                // if multiple, yes wins
                dayValue = Math.max(datum[key] || 0, dayData.value ? 1 : 0);
              } else if (category.type === 'scale') {
                // if multiple on the same day, take the largest
                dayValue = Math.max(datum[key] || 0, dayData.value);
              } else if (category.type === 'number') {
                // if multiple on the same day, add them
                // TODO: average them instead
                dayValue = (dayValue || 0) + dayData.value;
              } else if (category.type === 'name') {
                // allow for multiple on the same day, add them up
                dayValue = (dayValue || 0) + 1;
              }
            });
          if (dayValue !== undefined) datum[key] = dayValue;
        });

        data.push(datum);
        date.setDate(date.getDate() + 1);
      }
    }
    return data;
  }, [criteria, dates, track]);

  // build charts for DataChart
  const charts = useMemo(() => {
    const charts = [];
    criteria.forEach(({ category: categoryId, key }, index) => {
      const category = track.categories.find((c) => c.id === categoryId);
      // For number categories, pick min/max to be just outside the
      // data set. This works better for things like weight.
      let yMin;
      let yMax;
      if (category.type === 'number') {
        const values = data
          .filter((d) => d[key] !== undefined)
          .map((d) => d[key]);
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
      } else if (category.type === 'name') {
        yMin = 0;
        yMax = Math.max(...data.map((d) => d[key] || 0));
      }
      const base = {
        property: key,
        round: true,
        color: `graph-${index}`,
        opacity: 'strong',
        bounds: [
          [0, data.length - 1],
          [yMin, yMax],
        ],
      };
      charts.push({ ...base, type: 'line', thickness: 'xxsmall' });
      charts.push({ ...base, type: 'point', thickness: 'medium' });
    });
    return charts;
  }, [criteria, data, track]);

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

        {criteria.length > 0 && (
          <Box margin={{ vertical: 'large' }}>
            <DataChart
              data={data}
              series={['date', ...criteria.map((c) => c.key)]}
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

        <Box gap="medium">
          {criteria.map(({ category: categoryId, pattern }, index) => {
            const category = track.categories.find((c) => c.id === categoryId);
            return (
              <Box
                key={index}
                direction="row"
                gap="medium"
                justify="between"
                align="start"
              >
                <Box gap="xsmall">
                  <Box direction="row" gap="small" align="center">
                    {/* TODO: match point style */}
                    <Box
                      pad="small"
                      background={`graph-${index}`}
                      round="full"
                    />
                    <SelectCategory
                      track={track}
                      value={category}
                      onChange={(nextCategory) => {
                        const nextCriteria = JSON.parse(
                          JSON.stringify(criteria),
                        );
                        nextCriteria[index].category = nextCategory.id;
                        nextCriteria[index].key = nextCategory.name;
                        setCriteria(nextCriteria);
                      }}
                    />
                  </Box>
                  {category.type === 'name' && (
                    <Box direction="row" gap="small" align="center">
                      <Box pad="small" />
                      <TextInput
                        placeholder="matching ..."
                        value={pattern || ''}
                        onChange={(event) => {
                          const nextPattern = event.target.value;
                          const nextCriteria = JSON.parse(
                            JSON.stringify(criteria),
                          );
                          nextCriteria[index].pattern = nextPattern;
                          nextCriteria[index].key = nextPattern
                            ? `${category.name}-${nextPattern}`
                            : category.name;
                          setCriteria(nextCriteria);
                        }}
                      />
                    </Box>
                  )}
                </Box>
                <Button
                  icon={<Close />}
                  onClick={() => {
                    const nextCriteria = JSON.parse(JSON.stringify(criteria));
                    nextCriteria.splice(index, 1);
                    setCriteria(nextCriteria);
                  }}
                />
              </Box>
            );
          })}

          {addCriteria ? (
            <Box direction="row" gap="medium" justify="between" align="center">
              <Box direction="row" gap="small" align="center">
                <Box pad="small" round="full" />
                <SelectCategory
                  track={track}
                  value={''}
                  onChange={(nextCategory) => {
                    const nextCriteria = JSON.parse(JSON.stringify(criteria));
                    nextCriteria.push({
                      category: nextCategory.id,
                      key: nextCategory.name,
                    });
                    setCriteria(nextCriteria);
                    setAddCriteria(false);
                  }}
                />
              </Box>
              <Button icon={<Close />} onClick={() => setAddCriteria(false)} />
            </Box>
          ) : (
            <Box direction="row" justify="end">
              <Button icon={<Add />} onClick={() => setAddCriteria(true)} />
            </Box>
          )}
        </Box>
      </Box>
    </Page>
  );
};

export default Correlate;
