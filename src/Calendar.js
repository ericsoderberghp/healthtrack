import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Box, Button, Header, Heading, Select, Text, TextArea } from 'grommet';
import { Close, Next, Previous } from 'grommet-icons';
import { DateInput, Page } from './components';
import TrackContext from './TrackContext';
import {
  alignDate,
  dateTimes,
  getTime,
  sameDate,
  setTime,
  sortOn,
  timeLabel,
} from './utils';
import { addData, addNote, deleteNote, getCategory, updateNote } from './track';
import CalendarData from './CalendarData';

const createTouch = (event) => {
  if (event.changedTouches.length !== 1) return undefined;
  const touch = event.changedTouches.item(0);
  return { at: new Date().getTime(), x: touch.pageX, y: touch.pageY };
};

const deltaTouch = (event, start) => {
  const t = createTouch(event);
  if (t && start)
    return { at: t.at - start.at, x: t.x - start.x, y: t.y - start.y };
  else return { at: 0, x: 0, y: 0 };
};

const Calendar = () => {
  const [track, setTrack] = useContext(TrackContext);
  const [date, setDate] = useState(alignDate(new Date()));
  const [showCategorySelect, setShowCategorySelect] = useState();
  const [offset, setOffset] = useState(0);

  // jump to tomorrow
  // TODO: test that this works, not sure that it does
  useEffect(() => {
    const tomorrow = setTime(new Date(), '02:00');
    tomorrow.setDate(tomorrow.getDate() + 1);
    const timer = setTimeout(
      () => setDate(alignDate(new Date())),
      tomorrow - new Date(),
    );
    return () => clearTimeout(timer);
  }, [date, track]);

  // categories that want something each day
  const categories = useMemo(() => track.categories.filter((c) => c.times), [
    track,
  ]);

  // existing data for this day
  const data = useMemo(() => track.data.filter((d) => sameDate(d.date, date)), [
    date,
    track,
  ]);

  // data described by times that we don't have yet
  const pendingData = useMemo(() => {
    const result = [];
    categories.forEach((category) => {
      // find all data associated with this category already
      const cData = data.filter((d) => d.category === category.id);
      // insert any missing times
      dateTimes(date, category.times).forEach((fd) => {
        if (!cData.find((d) => sameDate(d.date, fd, true)))
          result.push({ category: category.id, date: fd.toISOString() });
      });
    });
    return result;
  }, [categories, data, date]);

  // note for this day
  const note = useMemo(
    () => track.notes.filter((t) => sameDate(t.date, date))[0],
    [date, track],
  );

  const mergedData = useMemo(
    () => sortOn([...data, ...pendingData], ['date', 'category'], 'asc'),
    [data, pendingData],
  );

  const onPrevious = useCallback(() => {
    const nextDate = new Date(date);
    nextDate.setDate(date.getDate() - 1);
    setDate(nextDate);
  }, [date]);

  const onNext = useCallback(() => {
    const nextDate = new Date(date);
    nextDate.setDate(date.getDate() + 1);
    setDate(nextDate);
  }, [date]);

  // gesture interaction
  useEffect(() => {
    const { addEventListener, removeEventListener } = document;
    let touchStart;

    const onTouchStart = (event) => {
      event.preventDefault();
      touchStart = createTouch(event);
      setOffset(0);
    };

    const onTouchMove = (event) => {
      event.preventDefault();
      const delta = deltaTouch(event, touchStart);
      if (Math.abs(delta.x) > 50) setOffset(delta.x);
    };

    const onTouchEnd = (event) => {
      const delta = deltaTouch(event, touchStart);
      if (Math.abs(delta.y) < 100 && Math.abs(delta.x) > 100)
        if (delta.x < 0) onNext();
        else onPrevious();
      touchStart = undefined;
      setOffset(0);
    };

    const onTouchCancel = (event) => {
      touchStart = undefined;
      setOffset(0);
    };

    addEventListener('touchstart', onTouchStart);
    addEventListener('touchmove', onTouchMove);
    addEventListener('touchend', onTouchEnd);
    addEventListener('touchcancel', onTouchCancel);

    return () => {
      removeEventListener('touchstart', onTouchStart);
      removeEventListener('touchmove', onTouchMove);
      removeEventListener('touchend', onTouchEnd);
      removeEventListener('touchcancel', onTouchCancel);
    };
  }, [onNext, onPrevious]);

  return (
    <Page>
      <Box style={{ transform: `translateX(${offset}px)` }}>
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
            <Button icon={<Previous />} onClick={onPrevious} />
            <Button icon={<Next />} onClick={onNext} />
          </Box>
        </Header>
        <Box flex="grow" pad="medium" responsive={false}>
          {!categories.length && (
            <Text color="text-xweak">You have no daily categories yet.</Text>
          )}
          {mergedData.map((d, index) => {
            const category = getCategory(track, d.category);
            const time = getTime(d.date);
            return (
              <CalendarData
                key={`${category.id}-${index}`}
                id={`${category.name}-${d.id}-${index}`}
                category={category}
                data={d}
                label={category.times ? timeLabel(d.date) : undefined}
                deletable={!category.times.includes(time)}
                track={track}
                setTrack={setTrack}
              />
            );
          })}
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
                options={track.categories}
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
      </Box>
    </Page>
  );
};

export default Calendar;
