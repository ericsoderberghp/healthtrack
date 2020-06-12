import React, { useContext, useEffect, useState } from 'react';
import { Box, Button, Heading, Paragraph } from 'grommet';
import { Page, RoutedButton } from './components';
import TrackContext from './TrackContext';
import { deleteTrack, signOut } from './track';

const Home = () => {
  const [track, setTrack] = useContext(TrackContext);
  const [message, setMessage] = useState();

  useEffect(() => {
    if (track) {
      if (track.categories.length === 4) {
        setMessage(
          `Begin by describing what you want to keep track of.
          We'll organize these as "categories".`,
        );
      } else if (track.data.length === 0) {
        setMessage(
          `Start entering behaviors you do and symptoms you experience.`,
        );
      } else if (track.data.length < 20) {
        setMessage(
          `Keep entering more behaviors you do and symptoms you experience.
          The more data you have, the more correlations you can make.`,
        );
      } else {
        setMessage(`See if there are any correlations you can make.`);
      }
    }
  }, [track]);

  if (!track) return null;

  return (
    <Page>
      <Box pad={{ horizontal: 'medium' }} responsive={false}>
        <Heading>{track.name}</Heading>
        <Paragraph>{message}</Paragraph>
      </Box>
      <Box flex="grow" pad="medium" align="start" responsive={false}>
        <RoutedButton
          label="Categories"
          path="/categories"
          title="categories"
          primary={track.categories.length === 4}
        />
      </Box>
      <Box
        margin={{ top: 'large' }}
        pad="medium"
        align="start"
        gap="medium"
        responsive={false}
      >
        {/* <Button label="Change password" disabled /> */}
        <Button
          label="Sign out"
          onClick={() => {
            signOut();
            setTrack(false);
          }}
        />
        <Button
          label="Delete everything"
          onClick={() => deleteTrack(track).then(() => setTrack(false))}
          title="delete everything"
        />
      </Box>
    </Page>
  );
};

export default Home;
