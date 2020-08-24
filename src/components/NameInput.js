import React, { forwardRef } from 'react';
import { Box, TextInput } from 'grommet';

const NameInput = forwardRef((props, ref) => (
  <Box flex background="background-contrast" round="xsmall">
    <TextInput ref={ref} size="large" plain {...props} />
  </Box>
));

NameInput.normalize = (value) => (value === '' ? undefined : value);

export default NameInput;
