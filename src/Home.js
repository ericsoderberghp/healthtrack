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
          Having real data will enable you to know where to focus your
          attention.
        </Paragraph>
      </Box>
      <Box pad="medium" align="start" gap="medium" responsive={false}>
        <RoutedButton
          label="Setup categories"
          path="/categories"
          title="categories"
        />
        <Button label="Change password" disabled />
        <Button label="Sign out" disabled />
        <Button
          label="Delete everything"
          onClick={() => setTrack(false)}
          title="delete everything"
        />
      </Box>
    </Page>
  );
};

export default Home;
