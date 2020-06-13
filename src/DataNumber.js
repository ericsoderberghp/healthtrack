import React, { forwardRef } from 'react';
import { Box, Text, TextInput } from 'grommet';

const DataNumber = forwardRef(({ units, ...rest }, ref) => (
  <Box direction="row" align="center" justify="between">
    <TextInput
      ref={ref}
      type="number"
      step=".1"
      size="large"
      placeholder="0"
      plain
      {...rest}
    />
    <Text size="large">{units}</Text>
  </Box>
));

export default DataNumber;
