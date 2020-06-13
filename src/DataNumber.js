import React, { forwardRef } from 'react';
import { Box, Text, TextInput } from 'grommet';

const DataNumber = forwardRef(({ units, ...rest }, ref) => (
  <Box direction="row" align="center">
    <Box flex={false} basis="small">
      <TextInput
        ref={ref}
        type="number"
        step=".1"
        size="large"
        placeholder="-"
        plain
        {...rest}
      />
    </Box>
    <Text size="large">{units}</Text>
  </Box>
));

export default DataNumber;
