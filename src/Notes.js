import React, { useContext } from 'react';
import { Box, Header, Heading, List } from 'grommet';
import { Add } from 'grommet-icons';
import Page from './Page';
import RoutedButton from './RoutedButton';
import { RouterContext } from './Router';
import { useTrack } from './track';

const Notes = () => {
  const { push } = useContext(RouterContext);
  const [track] = useTrack();

  if (!track) return null;

  return (
    <Page>
      <Box pad={{ horizontal: 'medium' }}>
        <Header>
          <Heading>notes</Heading>
          <RoutedButton
            icon={<Add />}
            primary
            hoverIndicator
            path="/notes/add"
          />
        </Header>
      </Box>
      <List
        data={track.notes}
        primaryKey="text"
        secondaryKey={(item) => {
          return new Date(item.date).toLocaleString(undefined, {
            month: 'short',
            day: 'numeric',
          });
        }}
        onClickItem={({ item: { id } }) => push(`/notes/${id}`)}
      />
    </Page>
  );
};

export default Notes;
