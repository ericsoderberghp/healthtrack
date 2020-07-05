import React, { forwardRef } from 'react';
import { Box, Text, TextInput } from 'grommet';

const NumberInput = forwardRef(({ units, value, ...rest }, ref) => (
  <Box direction="row" align="center">
    <Box flex={false} basis="small">
      <TextInput
        ref={ref}
        type="number"
        step=".1"
        size="large"
        placeholder="-"
        plain
        value={value || ''}
        {...rest}
      />
    </Box>
    <Text size="large">{units}</Text>
  </Box>
));

NumberInput.normalize = (value) =>
  value === '' ? undefined : parseFloat(value, 10);

export default NumberInput;
