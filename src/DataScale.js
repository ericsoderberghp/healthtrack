import React, { forwardRef, useEffect, useMemo, useState } from 'react';
import { RadioButtonGroup, Text } from 'grommet';
import { Star } from 'grommet-icons';

const DataScale = forwardRef((props, ref) => {
  // track value internally so we can highlight stars below value
  const [value, setValue] = useState();
  useEffect(() => {
    if (props.hasOwnProperty('value')) setValue(props.value);
  }, [props]);

  const options = useMemo(() => {
    const options = [1, 2, 3, 4, 5];
    if (props.hasOwnProperty('value') && value !== undefined)
      options.push(undefined);
    return options;
  }, [props, value]);

  return (
    <RadioButtonGroup ref={ref} direction="row" options={options} {...props}>
      {(option, { checked, hover }) => {
        let color;
        if (hover) color = 'active-text';
        else if (checked || option <= value) color = 'control';
        else color = 'status-disabled';
        // hack to have access to the value, update grommet someday
        if (checked && option !== value) setTimeout(() => setValue(option), 1);
        if (option === undefined) return <Text color="text-xweak">clear</Text>;
        return <Star key={option} color={color} />;
      }}
    </RadioButtonGroup>
  );
});

DataScale.normalize = (value) => (value === '' ? undefined : JSON.parse(value));

export default DataScale;
