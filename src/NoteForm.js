import React, { useState } from 'react';
import { Box, Button, Form, FormField, TextArea } from 'grommet';
import { DateInput } from './components';

const NoteForm = ({ defaultValue, label, onSubmit }) => {
  const [note, setNote] = useState(defaultValue);
  return (
    <Form value={note} onChange={setNote} onSubmit={() => onSubmit(note)}>
      <FormField name="text" required>
        <TextArea name="text" rows={8} />
      </FormField>
      <FormField name="date" required>
        <DateInput name="date" plain format="mm/dd/yyyy" />
      </FormField>
      <Box margin={{ top: 'medium' }} align="start">
        <Button type="submit" label={label} primary title={label} />
      </Box>
    </Form>
  );
};

export default NoteForm;
