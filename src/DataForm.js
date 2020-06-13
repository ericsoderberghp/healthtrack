import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Box, Button, Form, FormField } from 'grommet';
import { DateInput } from './components';
import DataYesNo from './DataYesNo';
import DataScale from './DataScale';
import DataNumber from './DataNumber';
import DataName from './DataName';

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

  return (
    <Form
      value={data}
      onChange={setData}
      onSubmit={() => {
        if (!data.date) data.date = new Date().toISOString();
        if (!data.name)
          data.name =
            typeof data.value === 'string' ? data.value : category.name;
        if (category.type === 'number') data.value = parseFloat(data.value, 10);
        onSubmit(data);
      }}
    >
      {category && category.type === 'yes/no' && (
        <FormField name="value">
          <DataYesNo ref={inputRef} name="value" />
        </FormField>
      )}
      {category && category.type === 'scale' && (
        <FormField name="value" required>
          <DataScale ref={inputRef} name="value" />
        </FormField>
      )}
      {category && category.type === 'number' && (
        <FormField name="value" required>
          <DataNumber ref={inputRef} name="value" units={category.units} />
        </FormField>
      )}
      {category && category.type === 'name' && (
        <FormField name="value" required>
          <DataName ref={inputRef} name="value" suggestions={suggestions} />
        </FormField>
      )}
      {data && (
        <FormField name="date" required htmlFor="date">
          <DateInput id="date" name="date" plain format="mm/dd/yyyy" />
        </FormField>
      )}
      <Box margin={{ top: 'medium' }} align="start">
        <Button type="submit" label={label} primary title={label} />
      </Box>
    </Form>
  );
};

export default DataForm;
