import React, { forwardRef } from 'react';
import { Box, TextInput } from 'grommet';

const NameInput = forwardRef(({ value, ...rest }, ref) => (
  <Box
    flex
    background="background-contrast"
    round="xsmall"
    margin={{ horizontal: 'small' }}
  >
    <TextInput ref={ref} size="large" plain value={value || ''} {...rest} />
  </Box>
));

NameInput.normalize = (value) => (value === '' ? undefined : value);

export default NameInput;
