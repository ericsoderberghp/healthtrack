import React, { forwardRef } from 'react';
import { TextInput } from 'grommet';

const NameInput = forwardRef(({ value, ...rest }, ref) => (
  <TextInput
    ref={ref}
    size="large"
    plain
    placeholder="_"
    value={value || ''}
    {...rest}
  />
));

NameInput.normalize = (value) => (value === '' ? undefined : value);

export default NameInput;
