import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, Form, FormField, DateInput, TextArea } from 'grommet';
import { toDate, toDateFormat } from './utils';

const NoteForm = ({ defaultValue, label, onSubmit }) => {
  const [note, setNote] = useState({
    ...defaultValue,
    date: toDate(defaultValue.date).toISOString(),
  });
  const inputRef = useRef();
  useEffect(() => {
    if (note && !note.value && inputRef.current) inputRef.current.focus();
  }, [note]);
  return (
    <Form
      value={note}
      onChange={setNote}
      onSubmit={() => {
        note.date = toDateFormat(new Date(note.date));
        onSubmit(note);
      }}
    >
      <FormField name="text" required htmlFor="text">
        <TextArea ref={inputRef} id="text" name="text" rows={8} />
      </FormField>
      <FormField name="date" required htmlFor="date">
        <DateInput id="date" name="date" format="mm/dd/yyyy" />
      </FormField>
      <Box margin={{ top: 'medium' }} align="start">
        <Button type="submit" label={label} primary title={label} />
      </Box>
    </Form>
  );
};

export default NoteForm;
