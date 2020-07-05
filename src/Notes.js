import React, { useContext } from 'react';
import { Box, Header, Heading, List, Paragraph, Text } from 'grommet';
import { Add, User } from 'grommet-icons';
import { Page, RoutedButton } from './components';
import TrackContext from './TrackContext';
import { RouterContext } from './Router';

const Notes = () => {
  const { push } = useContext(RouterContext);
  const [track] = useContext(TrackContext);

  if (!track) return null;

  return (
    <Page>
      <Box pad={{ horizontal: 'large' }}>
        <Header>
          <Heading>notes</Heading>
          <RoutedButton icon={<Add />} primary path="/notes/add" />
        </Header>
      </Box>
      <Box pad={{ horizontal: 'large' }}>
        <List
          pad={{ vertical: 'medium', horizontal: 'none' }}
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
      </Box>
      <Box
        margin={{ top: 'large' }}
        pad={{ horizontal: 'large' }}
        align="start"
      >
        <RoutedButton label="guide" icon={<User />} path="/" />
      </Box>
    </Page>
  );
};

export default Notes;
