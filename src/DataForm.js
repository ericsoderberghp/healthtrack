import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Box, Button, DateInput, Form, FormField } from 'grommet';
import { NameInput, NumberInput, ScaleInput, YesNoInput } from './components';
import { toDate, toDateFormat } from './utils';

const TypeInput = {
  'yes/no': YesNoInput,
  scale: ScaleInput,
  number: NumberInput,
  name: NameInput,
};

const DataForm = ({ category, defaultValue, label, onSubmit, track }) => {
  const [data, setData] = useState({
    ...defaultValue,
    date: toDate(defaultValue.date).toISOString(),
  });

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
        data.date = toDateFormat(new Date(data.date));
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
