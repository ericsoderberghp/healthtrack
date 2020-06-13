import React, { forwardRef, useEffect, useState } from 'react';
import { RadioButtonGroup } from 'grommet';
import { Star } from 'grommet-icons';

const DataScale = forwardRef((props, ref) => {
  const [value, setValue] = useState();
  useEffect(() => {
    if (props.value !== undefined) setValue(props.value);
  }, [props.value]);
  return (
    <RadioButtonGroup
      ref={ref}
      direction="row"
      options={[1, 2, 3, 4, 5]}
      {...props}
    >
      {(option, { checked, hover }) => {
        let color;
        if (hover) color = 'active-text';
        else if (checked || option <= value) color = 'control';
        else color = 'status-disabled';
        // hack to have access to the value, update grommet someday
        if (checked && option !== value) setTimeout(() => setValue(option), 1);
        return <Star key={option} color={color} size="large" />;
      }}
    </RadioButtonGroup>
  );
});

export default DataScale;
