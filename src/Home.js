import React, { useContext, useEffect, useState } from 'react';
import { Box, Heading, Paragraph } from 'grommet';
import { Page } from './components';
import TrackContext from './TrackContext';

const Home = () => {
  const [track] = useContext(TrackContext);
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
        TBD
      </Box>
    </Page>
  );
};

export default Home;
