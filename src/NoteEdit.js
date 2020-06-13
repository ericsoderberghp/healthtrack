import React, { useContext, useMemo } from 'react';
import { Box, Button, Header, Heading } from 'grommet';
import { Close } from 'grommet-icons';
import { Page, RoutedButton } from './components';
import TrackContext from './TrackContext';
import { RouterContext } from './Router';
import { deleteNote, updateNote } from './track';
import NoteForm from './NoteForm';

const NoteEdit = ({ id: idArg }) => {
  const { push } = useContext(RouterContext);
  const id = parseInt(idArg, 10);
  const [track, setTrack] = useContext(TrackContext);
  const note = useMemo(() => track.notes.find((n) => n.id === id), [id, track]);

  if (!note) return null;

  return (
    <Page>
      <Box pad={{ horizontal: 'medium' }} flex="grow" responsive={false}>
        <Header>
          <Heading>edit note</Heading>
          <RoutedButton icon={<Close />} path="/notes" />
        </Header>
        <NoteForm
          defaultValue={note}
          label="Update"
          onSubmit={(nextNote) => {
            setTrack(updateNote(track, note, nextNote));
            push('/notes');
          }}
        />
      </Box>
      <Box
        margin={{ top: 'xlarge' }}
        pad={{ horizontal: 'medium' }}
        align="start"
        responsive={false}
      >
        <Button
          label="Delete"
          onClick={() => {
            setTrack(deleteNote(track, note));
            push('/notes');
          }}
        />
      </Box>
    </Page>
  );
};

export default NoteEdit;
