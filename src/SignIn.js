import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Form,
  FormField,
  Heading,
  Text,
  TextInput,
} from 'grommet';
import TrackContext from './TrackContext';
import { RoutedButton } from './components';
import { signIn } from './track';

const SignIn = () => {
  const [, setTrack] = useContext(TrackContext);
  const [identity, setIdentity] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [busy, setBusy] = useState();
  const [message, setMessage] = useState();

  useEffect(() => setMessage(undefined), [identity]);

  const onSubmit = () => {
    setBusy(true);
    signIn(identity).then((nextTrack) => {
      setBusy(false);
      if (nextTrack) setTrack(nextTrack);
      else setMessage('UhOh, perhaps you mis-typed?');
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
        <Heading>Sign In</Heading>
        <Form value={identity} onChange={setIdentity} onSubmit={onSubmit}>
          <FormField label="Name" name="name" required>
            <TextInput name="name" />
          </FormField>
          <FormField label="Email" name="email" required>
            <TextInput name="email" type="email" />
          </FormField>
          <FormField label="Password" name="password" required>
            <TextInput name="password" type="password" />
          </FormField>
          {message && (
            <Text margin="small" color="text-xweak">
              {message}
            </Text>
          )}
          <Box
            margin={{ top: 'medium' }}
            direction="row"
            align="center"
            gap="small"
          >
            <Button
              title="sign in"
              type="submit"
              label="Sign In"
              primary
              disabled={busy}
            />
            {busy && <Text>just a sec ...</Text>}
          </Box>
        </Form>
        <Box margin={{ top: 'large' }} direction="row" gap="xsmall">
          <RoutedButton label="Sign Up" path="/onboard" />
        </Box>
      </Box>
    </Box>
  );
};

export default SignIn;
