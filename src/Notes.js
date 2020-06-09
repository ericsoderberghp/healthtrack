import React, { useContext } from 'react';
import { Box, Header, Heading, List, Paragraph, Text } from 'grommet';
import { Add } from 'grommet-icons';
import { Page, RoutedButton } from './components';
import TrackContext from './TrackContext';
import { RouterContext } from './Router';

const Notes = () => {
  const { push } = useContext(RouterContext);
  const [track] = useContext(TrackContext);

  if (!track) return null;

  return (
    <Page>
      <Box pad={{ horizontal: 'medium' }} responsive={false}>
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
        primaryKey={(item) => (
          <Box key={item.text} flex>
            <Paragraph margin="none">{item.text}</Paragraph>
          </Box>
        )}
        secondaryKey={(item) => (
          <Box key={item.date} alignSelf="start">
            <Text weight="bold">
              {new Date(item.date).toLocaleString(undefined, {
                month: 'short',
                day: 'numeric',
              })}
            </Text>
          </Box>
        )}
        width={{ max: '100%' }}
        onClickItem={({ item: { id } }) => push(`/notes/${id}`)}
      />
    </Page>
  );
};

export default Notes;
