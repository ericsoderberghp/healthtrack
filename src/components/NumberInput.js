import React, { forwardRef } from 'react';
import { Box, Text, TextInput } from 'grommet';

const NumberInput = forwardRef(({ units, value, ...rest }, ref) => (
  <Box
    flex
    direction="row"
    align="center"
    background="background-contrast"
    round="xsmall"
  >
    <TextInput
      ref={ref}
      type="number"
      step=".1"
      size="large"
      plain
      value={value || ''}
      {...rest}
    />
    {units && (
      <Text size="large" margin={{ right: 'small' }}>
        {units}
      </Text>
    )}
  </Box>
));

NumberInput.normalize = (value) =>
  value === '' ? undefined : parseFloat(value, 10);

export default NumberInput;
