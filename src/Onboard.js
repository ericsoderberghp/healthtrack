import React, { useContext, useState } from 'react';
import {
  Anchor,
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
import { initialTrack } from './track';

const Onboard = () => {
  const [, setTrack] = useContext(TrackContext);
  const [newTrack, setNewTrack] = useState(initialTrack);

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
        round
        align="center"
        width={{ max: 'medium' }}
      >
        <Heading>Welcome!</Heading>
        <Paragraph textAlign="center">
          Track your behavior and symptoms to uncover correlations.
        </Paragraph>
        <Form
          value={newTrack}
          onChange={setNewTrack}
          onSubmit={() => setTrack(newTrack)}
        >
          <FormField label="Your name" name="name" required>
            <TextInput name="name" />
          </FormField>
          <FormField label="Your email" name="email" required>
            <TextInput name="email" />
          </FormField>
          <FormField label="Choose a password" name="password" required>
            <TextInput name="password" type="password" />
          </FormField>
          <Box margin={{ top: 'medium' }}>
            <Button type="submit" label="Create My Track" primary />
          </Box>
        </Form>
        <Box margin={{ top: 'large' }} direction="row" gap="xsmall">
          <Text>or</Text>
          <Anchor>Sign In</Anchor>
          <Text>to an existing track</Text>
        </Box>
      </Box>
    </Box>
  );
};

export default Onboard;
