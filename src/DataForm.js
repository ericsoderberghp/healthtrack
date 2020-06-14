import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Box, Button, Form, FormField } from 'grommet';
import { DateInput } from './components';
import DataYesNo from './DataYesNo';
import DataScale from './DataScale';
import DataNumber from './DataNumber';
import DataName from './DataName';

const TypeInput = {
  'yes/no': DataYesNo,
  scale: DataScale,
  number: DataNumber,
  name: DataName,
};

const DataForm = ({ category, defaultValue, label, onSubmit, track }) => {
  const [data, setData] = useState(defaultValue);

  const suggestions = useMemo(() => {
    if (category && category.type === 'name') {
      return Array.from(
        new Set(
          track.data
            .filter((d) => d.category === category.id)
            .map((d) => d.name),
        ),
      );
    }
    return undefined;
  }, [category, track]);

  const inputRef = useRef();
  useEffect(() => {
    if (data && !data.value && inputRef.current) inputRef.current.focus();
  }, [data]);

  let Input = TypeInput[category.type];
  let inputProps;
  if (category.type === 'number') inputProps = { units: category.units };
  if (category.type === 'name') inputProps = { suggestions };

  return (
    <Form
      value={data}
      onChange={setData}
      onSubmit={() => {
        // normalize non-string values
        data.value = Input.normalize(data.value);
        if (!data.date) data.date = new Date().toISOString();
        if (!data.name)
          data.name =
            typeof data.value === 'string' ? data.value : category.name;
        onSubmit(data);
      }}
    >
      <FormField name="value" required={category.type !== 'yes/no'}>
        <Input ref={inputRef} name="value" {...inputProps} />
      </FormField>
      <FormField name="date" required htmlFor="date">
        <DateInput id="date" name="date" plain format="mm/dd/yyyy" />
      </FormField>
      <Box margin={{ top: 'medium' }} align="start">
        <Button type="submit" label={label} primary title={label} />
      </Box>
    </Form>
  );
};

export default DataForm;
