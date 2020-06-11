import React, { useContext, useState } from 'react';
import {
  Box,
  Button,
  Form,
  FormField,
  Header,
  Heading,
  TextArea,
} from 'grommet';
import { Close } from 'grommet-icons';
import { Page, RoutedButton } from './components';
import TrackContext from './TrackContext';
import { RouterContext } from './Router';

const NoteAdd = () => {
  const { push } = useContext(RouterContext);
  const [track, setTrack] = useContext(TrackContext);
  const [note, setNote] = useState({ text: '' });

  if (!track) return null;

  const onSubmit = () => {
    const nextTrack = JSON.parse(JSON.stringify(track));
    let nextId = 1;
    nextTrack.notes.forEach((n) => {
      nextId = Math.max(nextId, n.id + 1);
    });
    note.id = nextId;
    note.date = new Date().toISOString();
    nextTrack.notes.unshift(note);
    setTrack(nextTrack);
    push('/notes');
  };

  return (
    <Page>
      <Box pad={{ horizontal: 'medium' }}>
        <Header>
          <Heading>add note</Heading>
          <RoutedButton icon={<Close />} path="/data" />
        </Header>
        <Form value={note} onChange={setNote} onSubmit={onSubmit}>
          <FormField name="text" required>
            <TextArea name="text" rows={8} />
          </FormField>
          <Box margin={{ top: 'medium' }} align="start">
            <Button type="submit" label="Add" primary />
          </Box>
        </Form>
      </Box>
    </Page>
  );
};

export default NoteAdd;
