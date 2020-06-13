import React, { useContext } from 'react';
import { Box, Button, Heading } from 'grommet';
import { Page, RoutedButton } from './components';
import TrackContext from './TrackContext';
import { deleteTrack, signOut } from './track';

const Settings = () => {
  const [track, setTrack] = useContext(TrackContext);

  return (
    <Page>
      <Box pad={{ horizontal: 'medium' }} responsive={false}>
        <Heading>{track.name}</Heading>
      </Box>
      <Box flex="grow" pad="medium" align="start" responsive={false}>
        <RoutedButton
          label="Categories"
          path="/categories"
          title="categories"
        />
        <RoutedButton label="Data" path="/data" title="data" />
        <RoutedButton label="Notes" path="/notes" title="notes" />
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

export default Settings;
