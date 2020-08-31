import React, { useContext, useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  DataChart,
  DateInput,
  Header,
  Heading,
  ResponsiveContext,
} from 'grommet';
import { Page } from './components';
import TrackContext from './TrackContext';
import CriteriaEdit from './CriteriaEdit';
import { alignDate, betweenDates, sameDate } from './utils';

const now = alignDate(new Date());
const sevenDaysAgo = new Date(now);
sevenDaysAgo.setDate(now.getDate() - 6);
const dateFormat = new Intl.DateTimeFormat(undefined, {
  month: 'short',
  day: 'numeric',
});

const Correlate = () => {
  const size = useContext(ResponsiveContext);
  const [track] = useContext(TrackContext);
  const [dates, setDates] = useState([
    sevenDaysAgo.toISOString(),
    now.toISOString(),
  ]);
  const [criteria, setCriteria] = useState([]);
  const [editing, setEditing] = useState();

  // initialize categories to local storage or daily symptoms
  useEffect(() => {
    const stored = global.localStorage.getItem('correlate');
    const correlate = stored && JSON.parse(stored);
    if (correlate) setCriteria(correlate);
    else {
      const nextCriteria = [];
      track.categories.forEach((c) => {
        if (c.aspect === 'symptom' && c.times) {
          nextCriteria.push({ category: c.id });
        }
      });
      setCriteria(nextCriteria);
    }
  }, [track.categories]);

  useEffect(() => {
    // save criteria in local storage when they change
    global.localStorage.setItem('correlate', JSON.stringify(criteria));
  }, [criteria]);

  const keys = useMemo(
    () =>
      criteria.map(({ category: categoryId, name }) => {
        const category = track.categories.find((c) => c.id === categoryId);
        if (category.type === 'name' && name) return `${category.name}-${name}`;
        return category.name;
      }),
    [criteria, track.categories],
  );

  const series = useMemo(
    () => [
      'date',
      ...criteria.map(({ category: categoryId, name }, index) => {
        const category = track.categories.find((c) => c.id === categoryId);
        const label = category.type === 'name' && name ? name : category.name;
        return { property: keys[index], label };
      }),
    ],
    [criteria, keys, track.categories],
  );

  // build data for DataChart, array per criteria/chart
  const data = useMemo(() => {
    const data = [];
    if (criteria.length > 0) {
      const [date1, date2] = dates.map((d) => new Date(d));

      // prune the data down to just what the criteria matches
      const criteriaData = criteria.map(({ category, name }) =>
        track.data.filter(
          (datum) =>
            datum.category === category &&
            (!name || datum.value.match(new RegExp(name, 'g'))) &&
            betweenDates(datum.date, date1, date2),
        ),
      );

      // generate the DataChart data
      const date = new Date(date1);
      // create an object for each day
      while (date <= date2) {
        const datum = { date: date.toISOString() };
        // create a keyed value on the current day for each category
        criteria.forEach(({ category: categoryId }, index) => {
          const key = keys[index];
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
  }, [criteria, dates, keys, track]);

  // build charts for DataChart
  const charts = useMemo(() => {
    const charts = [];
    criteria.forEach(({ category: categoryId }, index) => {
      const key = keys[index];
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
  }, [criteria, data, keys, track]);

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
              series={series}
              chart={charts}
              axis={{
                x: {
                  property: 'date',
                  granularity: data.length < 8 ? 'fine' : 'coarse',
                },
              }}
              guide={{ x: { granularity: 'fine' } }}
              size={{ width: 'fill', height: 'small' }}
              detail
              legend
            />
          </Box>
        )}

        {editing ? (
          <CriteriaEdit
            criteria={criteria}
            onChange={setCriteria}
            onDone={() => setEditing(false)}
          />
        ) : (
          <Box alignSelf="start">
            <Button label="edit" onClick={() => setEditing(true)} />
          </Box>
        )}
      </Box>
    </Page>
  );
};

export default Correlate;
