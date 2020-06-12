import React, { useContext } from 'react';
import { Box, Header, Heading } from 'grommet';
import { Close } from 'grommet-icons';
import { Page, RoutedButton } from './components';
import TrackContext from './TrackContext';
import { RouterContext } from './Router';
import NoteForm from './NoteForm';

const NoteAdd = () => {
  const { push } = useContext(RouterContext);
  const [track, setTrack] = useContext(TrackContext);

  if (!track) return null;

  const onSubmit = (nextNote) => {
    const nextTrack = JSON.parse(JSON.stringify(track));
    let nextId = 1;
    nextTrack.notes.forEach((n) => {
      nextId = Math.max(nextId, n.id + 1);
    });
    nextNote.id = nextId;
    nextTrack.notes.unshift(nextNote);
    setTrack(nextTrack);
    push('/notes');
  };

  return (
    <Page>
      <Box pad={{ horizontal: 'medium' }}>
        <Header>
          <Heading>add note</Heading>
          <RoutedButton icon={<Close />} path="/notes" />
        </Header>
        <NoteForm
          defaultValue={{ text: '', date: new Date().toISOString() }}
          label="Add"
          onSubmit={onSubmit}
        />
      </Box>
    </Page>
  );
};

export default NoteAdd;
