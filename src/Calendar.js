import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Box, Button, Header, Heading, Select, Text, TextArea } from 'grommet';
import { Close, Next, Previous } from 'grommet-icons';
import { DateInput, Page } from './components';
import TrackContext from './TrackContext';
import { alignDate, frequencyDates, sameDate, sortOn } from './utils';
import { addData, addNote, deleteNote, updateNote } from './track';
import CalendarData from './CalendarData';

const hourLabel = {
  8: 'morning',
  12: 'mid-day',
  16: 'evening',
  20: 'night',
};

const Calendar = () => {
  const [track, setTrack] = useContext(TrackContext);
  const [date, setDate] = useState(alignDate(new Date()));
  const [showCategorySelect, setShowCategorySelect] = useState();

  // jump to tomorrow
  useEffect(() => {
    const tomorrow = alignDate(new Date(), -10);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const timer = setTimeout(
      () => setDate(alignDate(new Date())),
      tomorrow - new Date(),
    );
    return () => clearTimeout(timer);
  }, [date, track]);

  // categories that want something each day
  const categories = useMemo(
    () =>
      sortOn(
        track.categories.filter((c) => c.frequency > 0),
        ['aspect', 'name'],
      ),
    [track],
  );

  // data for this day
  const data = useMemo(() => track.data.filter((d) => sameDate(d.date, date)), [
    date,
    track,
  ]);

  // non-daily categories we have data for
  const occasionalCategories = useMemo(
    () =>
      Array.from(
        new Set(
          data
            .filter(
              (d) => d.category && !categories.find((c) => c.id === d.category),
            )
            .map((d) => d.category),
        ),
      ).map((id) => track.categories.find((c) => c.id === id)),
    [categories, track.categories, data],
  );

  // categories that are occasional or have their frequencies filled already
  const addableCategories = useMemo(
    () =>
      track.categories.filter(
        (c) =>
          c.frequency === 0 ||
          data.filter((d) => d.category === c.id).length >= c.frequency,
      ),
    [data, track.categories],
  );

  // note for this day
  const note = useMemo(
    () => track.notes.filter((t) => sameDate(t.date, date))[0],
    [date, track],
  );

  // organize as follows:
  // for each daily category, put all data associated with it
  // if there is not enough data already associated with it, add blanks for them
  // for any data not in a daily category, add it last.
  const categorySets = useMemo(() => {
    const result = [];
    [...categories, ...occasionalCategories].forEach((category) => {
      // find all data associated with this category already
      const set = {
        category,
        data: data.filter((d) => d.category === category.id),
      };
      // insert any missing frequency times
      if (category.frequency) {
        frequencyDates(date, category.frequency).forEach((fd) => {
          if (!set.data.find((d) => sameDate(d.date, fd, true))) {
            set.data.push({ category: category.id, date: fd.toISOString() });
          }
        });
      }
      sortOn(set.data, 'date', 'asc');
      // identify frequency data based on the frequency
      set.labels = set.data.map((d, i) => {
        if (category.frequency < 2) return undefined;
        return hourLabel[new Date(d.date).getHours()];
      });
      result.push(set);
    });
    return result;
  }, [categories, data, date, occasionalCategories]);

  return (
    <Page>
      <Header pad={{ horizontal: 'medium' }} responsive={false}>
        <Heading>
          {date.toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
          })}
        </Heading>
        <Box direction="row" gap="small">
          <DateInput
            value={date.toISOString()}
            onChange={({ value }) => setDate(new Date(value))}
          />
          <Button
            icon={<Previous />}
            onClick={() => {
              const nextDate = new Date(date);
              nextDate.setDate(date.getDate() - 1);
              setDate(nextDate);
            }}
          />
          <Button
            icon={<Next />}
            onClick={() => {
              const nextDate = new Date(date);
              nextDate.setDate(date.getDate() + 1);
              setDate(nextDate);
            }}
          />
        </Box>
      </Header>
      <Box flex="grow" pad="medium" responsive={false}>
        {!categorySets.length && (
          <Text color="text-xweak">You have no daily categories yet.</Text>
        )}
        {categorySets.map(({ category, data, labels }) =>
          data.map((d, index) => (
            <CalendarData
              key={`${category.id}-${index}`}
              id={`${category.name}-${data.id}-${index}`}
              category={category}
              data={d}
              label={labels[index]}
              deletable={!hourLabel[new Date(d.date).getHours()]}
              track={track}
              setTrack={setTrack}
            />
          )),
        )}
        {showCategorySelect && (
          <Box
            pad={{ vertical: 'small' }}
            gap="medium"
            border="top"
            direction="row"
            justify="end"
            align="center"
            responsive={false}
          >
            <Select
              options={addableCategories}
              labelKey="name"
              valueKey="id"
              placeholder="select category ..."
              onChange={({ option }) => {
                const newDate = new Date(date);
                newDate.setHours(13);
                setTrack(
                  addData(track, {
                    date: newDate.toISOString(),
                    category: option.id,
                  }),
                );
                setShowCategorySelect(false);
              }}
            />
            <Button
              icon={<Close />}
              onClick={() => setShowCategorySelect(false)}
            />
          </Box>
        )}
        <Box border="top" />
      </Box>

      {!showCategorySelect && (
        <Box align="start" pad="small" responsive={false}>
          <Button
            label="add additional data"
            onClick={() => setShowCategorySelect(true)}
          />
        </Box>
      )}

      {note ? (
        <Box pad="medium" gap="medium" responsive={false}>
          <Header>
            <Heading level={2} size="small" margin="none">
              note
            </Heading>
            <Button
              label="delete note"
              onClick={() => setTrack(deleteNote(track, note))}
            />
          </Header>
          <TextArea
            rows={8}
            value={note.text}
            onChange={(event) =>
              setTrack(updateNote(track, note, { text: event.target.value }))
            }
          />
        </Box>
      ) : (
        <Box align="start" pad="small" responsive={false}>
          <Button
            label="add a note"
            onClick={() =>
              setTrack(addNote(track, { date: date.toISOString() }))
            }
          />
        </Box>
      )}
    </Page>
  );
};

export default Calendar;
