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
        align="start"
        round
        width={{ max: 'medium' }}
      >
        <Heading>Hi!</Heading>
        <Paragraph>
          Do you want to know what you are doing that's exacerbating some
          problem you are having? Track your behaviors and symptoms to uncover
          correlations based on real data.
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
            <Button type="submit" label="Get Started" primary />
          </Box>
        </Form>
        <Box margin={{ top: 'large' }} direction="row" gap="xsmall">
          <Text>or</Text>
          <Anchor>Sign In</Anchor>
        </Box>
      </Box>
    </Box>
  );
};

export default Onboard;
