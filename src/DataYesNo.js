import React, { forwardRef } from 'react';
import { Box, RadioButtonGroup, Text } from 'grommet';

const DataYesNo = forwardRef((props, ref) => (
  <RadioButtonGroup
    ref={ref}
    direction="row"
    options={[true, false]}
    {...props}
  >
    {(option, { checked, hover }) => {
      let color;
      if (hover) color = 'active-background';
      else if (checked) color = 'control';
      return (
        <Box
          key={option}
          pad={{ vertical: 'xsmall', horizontal: 'small' }}
          background={color}
          round="xsmall"
          responsive={false}
        >
          <Text size="large" weight="bold">
            {option ? 'yes' : 'no'}
          </Text>
        </Box>
      );
    }}
  </RadioButtonGroup>
));

export default DataYesNo;
