import React, { useContext } from 'react';
import { Box, Button, Heading, Paragraph } from 'grommet';
import { Calendar, Tag, Test } from 'grommet-icons';
import { Page, RoutedButton } from './components';
import TrackContext from './TrackContext';
import { deleteTrack, signOut } from './track';

const Home = () => {
  const [track, setTrack] = useContext(TrackContext);
  // const [message, setMessage] = useState();

  // useEffect(() => {
  //   if (track) {
  //     if (track.categories.length === 4) {
  //       setMessage(
  //         `Begin by describing what you want to keep track of.
  //         We'll organize these as "categories".`,
  //       );
  //     } else if (track.data.length === 0) {
  //       setMessage(
  //         `Start entering behaviors you do and symptoms you experience.`,
  //       );
  //     } else if (track.data.length < 20) {
  //       setMessage(
  //         `Keep entering more behaviors you do and symptoms you experience.
  //         The more data you have, the more correlations you can make.`,
  //       );
  //     } else {
  //       setMessage(`See if there are any correlations you can make.`);
  //     }
  //   }
  // }, [track]);

  return (
    <Page>
      <Box align="start" pad={{ horizontal: 'medium' }} responsive={false}>
        <Heading>Hi {track.name}</Heading>
        <Paragraph>
          This is a tool that can help remove uncertainty in managing your
          health.
        </Paragraph>
        <Paragraph>
          To begin with, think about some symptom you have that you are having
          difficulty determining what is causing it. For example, migraine
          headaches. Then, think about some things that you think might affect
          it, such as not getting enough sleep, not getting enough exercise, or
          consuming alcohol. Create categories for these things. When creating
          the categories, think about how much detail you want to capture and
          how often you expect to track it. The simpler you can make it, the
          easier it will be to keep track. You can always adjust over time.
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
