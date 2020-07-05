import React, { forwardRef } from 'react';
import { Box, RadioButtonGroup, Text } from 'grommet';

const label = {
  true: 'yes',
  false: 'no',
};

const YesNoInput = forwardRef((props, ref) => (
  <RadioButtonGroup
    ref={ref}
    direction="row"
    options={[true, false]}
    gap="medium"
    border="between"
    pad={{ horizontal: 'small' }}
    {...props}
  >
    {(option, { checked, hover }) => {
      let color;
      // if (hover) color = 'active-background';
      if (checked) color = 'control';
      else color = 'background-contrast';
      return (
        <Box
          key={label[option]}
          pad={{ vertical: 'xsmall', horizontal: 'small' }}
          background={color}
          round="xsmall"
          responsive={false}
        >
          <Text
            size="large"
            weight="bold"
            color={checked ? 'text' : 'text-xweak'}
          >
            {label[option]}
          </Text>
        </Box>
      );
    }}
  </RadioButtonGroup>
));

YesNoInput.normalize = (value) =>
  value === '' ? undefined : JSON.parse(value);

export default YesNoInput;
