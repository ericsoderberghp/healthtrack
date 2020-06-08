import React from 'react';
import { Box, Button, Heading, Paragraph } from 'grommet';
import Page from './Page';
import RoutedButton from './RoutedButton';
import { useTrack } from './track';

const Home = () => {
  const [track, setTrack] = useTrack();

  if (!track) return null;

  return (
    <Page>
      <Box pad={{ horizontal: 'medium' }}>
        <Heading>{track.name}</Heading>
        <Paragraph>
          Begin by setting up categories you would like to keep track of. These
          can be behaviors you have, symptoms you experience, or remedies you
          try. Once you've set up the categories, you can start recording data.
          When you've got some data, you can start looking for correlations.
          Hopefully, you will uncover something helpful!
        </Paragraph>
      </Box>
      <Box margin={{ top: 'xlarge' }} pad="medium" align="start" gap="medium">
        <RoutedButton label="Setup categories" path="/categories" />
        <Button label="Change password" disabled />
        <Button label="Sign out" disabled />
        <Button
          label="Delete my track"
          onClick={() => {
            localStorage.removeItem('track');
            setTrack(false);
          }}
        />
      </Box>
    </Page>
  );
};

export default Home;
