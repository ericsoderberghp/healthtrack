import React, { forwardRef } from 'react';
import { TextInput } from 'grommet';

const DataName = forwardRef(({ value, ...rest }, ref) => (
  <TextInput
    ref={ref}
    size="large"
    plain
    placeholder="_"
    value={value || ''}
    {...rest}
  />
));

DataName.normalize = (value) => (value === '' ? undefined : value);

export default DataName;
