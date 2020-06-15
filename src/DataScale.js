import React, { forwardRef, useState } from 'react';
import { Box, RadioButtonGroup } from 'grommet';
import { Star } from 'grommet-icons';

const DataScale = forwardRef((props, ref) => {
  // track value internally so we can highlight stars below value
  const [valueOption, setValueOption] = useState();
  let checkedOption;

  return (
    <RadioButtonGroup
      ref={ref}
      direction="row"
      options={[1, 2, 3, 4, 5]}
      pad={{ horizontal: 'small' }}
      {...props}
    >
      {(option, { checked, hover }) => {
        let color;
        if (hover) color = 'active-text';
        else if (checked || option <= valueOption) color = 'control';
        else color = 'status-disabled';

        // hack to have access to the value, update grommet some day
        if (checked) checkedOption = option;
        if (option === 5 && checkedOption !== valueOption)
          setTimeout(() => setValueOption(checkedOption), 1);

        return (
          <Box key={option} pad={{ vertical: 'xsmall' }} responsive={false}>
            <Star key={option} color={color} />
          </Box>
        );
      }}
    </RadioButtonGroup>
  );
});

DataScale.normalize = (value) => (value === '' ? undefined : JSON.parse(value));

export default DataScale;
