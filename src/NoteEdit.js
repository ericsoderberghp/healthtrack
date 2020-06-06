import React, { useContext, useEffect, useState } from 'react';
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
import Page from './Page';
import RoutedButton from './RoutedButton';
import { RouterContext } from './Router';
import { useTrack } from './track';

const NoteEdit = ({ id: idArg }) => {
  const { push } = useContext(RouterContext);
  const id = parseInt(idArg, 10);
  const [track, setTrack] = useTrack();
  const [note, setNote] = useState();
  useEffect(() => {
    if (track && id) setNote(track.notes.find((n) => n.id === id));
  }, [id, track]);

  if (!note) return null;

  return (
    <Page>
      <Box pad={{ horizontal: 'medium' }}>
        <Header>
          <Heading>edit note</Heading>
          <RoutedButton icon={<Close />} hoverIndicator path="/notes" />
        </Header>
        <Form
          value={note}
          onChange={setNote}
          onSubmit={() => {
            const nextTrack = JSON.parse(JSON.stringify(track));
            const index = nextTrack.notes.findIndex((c) => c.id === id);
            nextTrack.notes[index] = note;
            setTrack(nextTrack);
            push('/notes');
          }}
        >
          <FormField name="text" required>
            <TextArea name="text" rows={8} />
          </FormField>
          <Box margin={{ top: 'medium' }} align="start">
            <Button type="submit" label="Update" primary />
          </Box>
        </Form>
        <Box margin={{ top: 'xlarge' }} align="start">
          <Button
            label="Delete"
            onClick={() => {
              const nextTrack = JSON.parse(JSON.stringify(track));
              const index = nextTrack.notes.findIndex((n) => n.id === id);
              nextTrack.notes.splice(index, 1);
              setTrack(nextTrack);
              push('/notes');
            }}
          />
        </Box>
      </Box>
    </Page>
  );
};

export default NoteEdit;
