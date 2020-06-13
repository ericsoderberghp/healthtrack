import React, { forwardRef } from 'react';
import { TextInput } from 'grommet';

const DataName = forwardRef((props, ref) => (
  <TextInput ref={ref} size="xlarge" plain placeholder="_" {...props} />
));

export default DataName;
