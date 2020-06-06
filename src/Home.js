import React from 'react';
import { Box, Button, Heading, Paragraph } from 'grommet';
import Page from './Page';
import RoutedButton from './RoutedButton';
import { useTrack } from './track';

const Home = () => {
  const [track] = useTrack();

  if (!track) return null;

  return (
    <Page>
      <Box pad={{ horizontal: 'medium' }}>
        <Heading>{track.name}</Heading>
        <Paragraph>
          Set up categories you would like to keep track of. They can be
          behaviors you have, symptoms you experience, or treatments you try.
          Once you've set up the categories, you can start recording data. Then,
          when you've recorded data for a while, you can start looking for
          correlations.
        </Paragraph>
      </Box>
      <Box margin={{ top: 'xlarge' }} pad="medium" align="start" gap="medium">
        <RoutedButton label="Setup categories" path="/categories" />
        <Button label="Change password" disabled />
        <Button label="Sign out" disabled />
        <RoutedButton
          label="Delete my track"
          path="/loading"
          onClick={() => localStorage.removeItem('track')}
        />
      </Box>
    </Page>
  );
};

export default Home;
