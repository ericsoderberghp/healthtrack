import React, { useContext, useEffect, useState } from 'react';
import { Box, Button, Header, Heading } from 'grommet';
import { Close } from 'grommet-icons';
import { Page, RoutedButton } from './components';
import TrackContext from './TrackContext';
import { RouterContext } from './Router';
import NoteForm from './NoteForm';

const NoteEdit = ({ id: idArg }) => {
  const { push } = useContext(RouterContext);
  const id = parseInt(idArg, 10);
  const [track, setTrack] = useContext(TrackContext);
  const [note, setNote] = useState();
  useEffect(() => {
    if (track && id) setNote(track.notes.find((n) => n.id === id));
  }, [id, track]);

  const onSubmit = (nextNote) => {
    const nextTrack = JSON.parse(JSON.stringify(track));
    const index = nextTrack.notes.findIndex((c) => c.id === id);
    nextTrack.notes[index] = nextNote;
    setTrack(nextTrack);
    push('/notes');
  };

  if (!note) return null;

  return (
    <Page>
      <Box pad={{ horizontal: 'medium' }} flex="grow" responsive={false}>
        <Header>
          <Heading>edit note</Heading>
          <RoutedButton icon={<Close />} path="/notes" />
        </Header>
        <NoteForm defaultValue={note} label="Update" onSubmit={onSubmit} />
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
            const nextTrack = JSON.parse(JSON.stringify(track));
            const index = nextTrack.notes.findIndex((n) => n.id === id);
            nextTrack.notes.splice(index, 1);
            setTrack(nextTrack);
            push('/notes');
          }}
        />
      </Box>
    </Page>
  );
};

export default NoteEdit;
