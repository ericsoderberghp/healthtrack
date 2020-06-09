import React, { useContext } from 'react';
import { Box, Button, Heading, Paragraph } from 'grommet';
import { Page, RoutedButton } from './components';
import TrackContext from './TrackContext';

const Home = () => {
  const [track, setTrack] = useContext(TrackContext);

  if (!track) return null;

  return (
    <Page>
      <Box pad={{ horizontal: 'medium' }} responsive={false}>
        <Heading>{track.name}</Heading>
        <Paragraph>
          Begin by setting up categories you would like to keep track of. These
          can be behaviors you have, symptoms you experience, or remedies you
          try. Once you've set up the categories, you can start recording data.
          When you've got some data, you can start looking for correlations.
          Hopefully, you will uncover something helpful!
        </Paragraph>
      </Box>
      <Box pad="medium" align="start" gap="medium" responsive={false}>
        <RoutedButton label="Setup categories" path="/categories" />
        <Button label="Change password" disabled />
        <Button label="Sign out" disabled />
        <Button label="Delete my track" onClick={() => setTrack(false)} />
      </Box>
    </Page>
  );
};

export default Home;
