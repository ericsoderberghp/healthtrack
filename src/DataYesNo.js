import React, { forwardRef } from 'react';
import { Box, RadioButtonGroup, Text } from 'grommet';

const label = {
  true: 'yes',
  false: 'no',
  undefined: 'clear',
};

const DataYesNo = forwardRef((props, ref) => {
  const options = [true, false];
  if (props.value !== undefined) options.push(undefined);
  return (
    <RadioButtonGroup
      ref={ref}
      direction="row"
      options={options}
      border="between"
      {...props}
    >
      {(option, { checked, hover }) => {
        let color;
        if (hover) color = 'active-background';
        else if (checked) color = 'control';
        return (
          <Box
            key={label[option]}
            pad={{ vertical: 'xsmall', horizontal: 'small' }}
            background={color}
            round="xsmall"
            responsive={false}
          >
            <Text
              size={option !== undefined ? 'large' : undefined}
              weight={option !== undefined ? 'bold' : undefined}
              color={checked ? 'text' : 'text-xweak'}
            >
              {label[option]}
            </Text>
          </Box>
        );
      }}
    </RadioButtonGroup>
  );
});

DataYesNo.normalize = (value) => (value === '' ? undefined : JSON.parse(value));

export default DataYesNo;
