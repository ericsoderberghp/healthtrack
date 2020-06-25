import React, { useContext } from 'react';
import { Box, Button, Heading, Paragraph } from 'grommet';
import { Calendar, Tag, Test } from 'grommet-icons';
import { Page, RoutedButton } from './components';
import TrackContext from './TrackContext';
import { deleteTrack, signOut } from './track';

const Home = () => {
  const [track, setTrack] = useContext(TrackContext);

  return (
    <Page>
      <Box align="start" pad={{ horizontal: 'medium' }} responsive={false}>
        <Heading>Hi {track.name}</Heading>
        <Paragraph>
          This is a tool that can help remove uncertainty from managing your
          health.
        </Paragraph>
        <Paragraph>
          To begin with, think about some symptom you experience that you don't
          know the cause of. For example, migraine headaches. Then, think about
          some of your behaviors that might be affecting it, such as not getting
          enough sleep, not getting enough exercise, or consuming alcohol. Add
          categories for your symptoms and behaviors. When adding them, think
          about how much detail you want to capture and how often you expect to
          track them. The simpler you can make it, the easier it will be to keep
          track. You can always adjust over time.
        </Paragraph>
        <RoutedButton
          label="setup categories"
          icon={<Tag />}
          path="/categories"
        />
        <Paragraph>
          Once you've got your categories in place, start tracking your
          behaviors and experiences over time. You'll be guided to enter data
          for the categories you indicated should be captured daily. You can
          always add more data too.
        </Paragraph>
        <RoutedButton label="enter data" icon={<Calendar />} path="/calendar" />
        <Paragraph>
          When you've got a few weeks of data recorded, look for correlations
          between your behaviors and symptoms.
        </Paragraph>
        <RoutedButton label="correlate" icon={<Test />} path="/correlate" />
        <Paragraph>
          Make this tool work for you. You can always adjust the categories as
          you go. Good luck!
        </Paragraph>
      </Box>
      <Box
        margin={{ top: 'large' }}
        border="top"
        pad="medium"
        align="start"
        gap="medium"
        responsive={false}
      >
        <RoutedButton label="Data" path="/data" title="data" />
        <RoutedButton label="Notes" path="/notes" title="notes" />
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
