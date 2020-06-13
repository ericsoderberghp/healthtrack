import React, { forwardRef } from 'react';
import { TextInput } from 'grommet';

const DataName = forwardRef((props, ref) => (
  <TextInput ref={ref} size="large" plain placeholder="_" {...props} />
));

export default DataName;
