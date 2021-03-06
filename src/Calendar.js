import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  Box,
  Button,
  DateInput,
  Header,
  Heading,
  Text,
  TextArea,
} from 'grommet';
import { Next, Previous } from 'grommet-icons';
import { Page } from './components';
import TrackContext from './TrackContext';
import {
  alignDate,
  dateTimes,
  getTime,
  sameDate,
  sortOn,
  timeLabel,
  toDateFormat,
} from './utils';
import { addData, addNote, deleteNote, getCategory, updateNote } from './track';
import CalendarData from './CalendarData';
import AdditionalDataAdd from './AdditionalDataAdd';

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
  const [showAdditionalDataAdd, setShowAdditionalDataAdd] = useState();
  const [offset, setOffset] = useState(0);

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
      if (cData.length < category.times.length) {
        // insert any missing times
        dateTimes(date, category.times).forEach((fd) => {
          if (!cData.find((d) => sameDate(d.date, fd, true)))
            result.push({ category: category.id, date: toDateFormat(fd) });
        });
      }
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
        <Header pad={{ horizontal: 'large' }}>
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
        <Box flex="grow" pad={{ horizontal: 'large' }}>
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
                label={timeLabel(d.date)}
                deletable={!category.times || !category.times.includes(time)}
                track={track}
                setTrack={setTrack}
              />
            );
          })}
          {showAdditionalDataAdd && (
            <Box border="top" pad={{ vertical: 'medium' }}>
              <AdditionalDataAdd
                date={date}
                track={track}
                onAdd={(data) => {
                  setTrack(addData(track, data));
                  setShowAdditionalDataAdd(false);
                }}
                onCancel={() => setShowAdditionalDataAdd(false)}
              />
            </Box>
          )}
          <Box border="top" />
        </Box>

        {!showAdditionalDataAdd && (
          <Box align="start" pad="medium">
            <Button
              label="add additional data"
              onClick={() => setShowAdditionalDataAdd(true)}
            />
          </Box>
        )}

        {note ? (
          <Box pad="large" gap="large">
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
          <Box align="start" pad="medium">
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
