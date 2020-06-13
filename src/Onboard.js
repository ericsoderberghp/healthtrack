import React, { useContext, useState } from 'react';
import {
  Box,
  Button,
  Form,
  FormField,
  Heading,
  Paragraph,
  Text,
  TextInput,
} from 'grommet';
import TrackContext from './TrackContext';
import { RoutedButton } from './components';
import { createTrack, initialTrack } from './track';

const Onboard = () => {
  const [, setTrack] = useContext(TrackContext);
  const [newTrack, setNewTrack] = useState(initialTrack);
  const [busy, setBusy] = useState();

  const onSubmit = () => {
    setBusy(true);
    createTrack(newTrack).then((nextTrack) => {
      setBusy(false);
      setTrack(nextTrack);
    });
  };

  return (
    <Box
      align="center"
      justify="center"
      background="background-back"
      height={{ min: '100%' }}
    >
      <Box
        background="background-front"
        pad="large"
        align="start"
        round
        width={{ max: 'medium' }}
      >
        <Heading>Hi!</Heading>
        <Paragraph>
          Are you ready to make decisions about your health based on more than
          just guesswork?
        </Paragraph>
        <Form value={newTrack} onChange={setNewTrack} onSubmit={onSubmit}>
          <FormField label="Your name" name="name" required>
            <TextInput name="name" />
          </FormField>
          <FormField label="Your email" name="email" required>
            <TextInput name="email" type="email" />
          </FormField>
          <FormField label="Choose a password" name="password" required>
            <TextInput name="password" type="password" />
          </FormField>
          <Box
            margin={{ top: 'medium' }}
            direction="row"
            align="center"
            gap="small"
          >
            <Button
              title="get started"
              type="submit"
              label="Get Started"
              primary
              disabled={busy}
            />
            {busy && <Text>just a sec ...</Text>}
          </Box>
        </Form>
        <Box margin={{ top: 'large' }} direction="row" gap="xsmall">
          <RoutedButton label="Sign In" path="/sign-in" />
        </Box>
      </Box>
    </Box>
  );
};

export default Onboard;
