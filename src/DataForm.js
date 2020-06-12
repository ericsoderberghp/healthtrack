import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Box,
  Button,
  CheckBox,
  Form,
  FormField,
  RadioButtonGroup,
  Text,
  TextInput,
} from 'grommet';
import { Star } from 'grommet-icons';
import { DateInput } from './components';

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
    <Form value={data} onChange={setData} onSubmit={() => onSubmit(data)}>
      {category && category.type === 'yes/no' && (
        <FormField name="value" required>
          <CheckBox name="value" toggle />
        </FormField>
      )}
      {category && category.type === 'rating' && (
        <FormField name="value" required>
          <RadioButtonGroup
            ref={inputRef}
            name="value"
            options={[1, 2, 3, 4, 5]}
            direction="row"
          >
            {(option, { checked, hover }) => {
              let color;
              if (hover) color = 'active-text';
              else if (option <= data.value) color = 'control';
              else color = 'status-disabled';
              return <Star key={option} color={color} size="large" />;
            }}
          </RadioButtonGroup>
        </FormField>
      )}
      {category && category.type === 'number' && (
        <FormField ref={inputRef} name="value" required>
          <Box direction="row" align="center" justify="between">
            <TextInput
              ref={inputRef}
              name="value"
              type="number"
              size="xlarge"
              plain
            />
            <Text size="large">{category.units || 'value'}</Text>
          </Box>
        </FormField>
      )}
      {category && category.type === 'name' && (
        <FormField name="value" required>
          <TextInput
            ref={inputRef}
            name="value"
            size="xlarge"
            placeholder="name"
            suggestions={suggestions}
          />
        </FormField>
      )}
      {data && (
        <FormField name="date" required>
          <DateInput name="date" plain format="mm/dd/yyyy" />
        </FormField>
      )}
      <Box margin={{ top: 'medium' }} align="start">
        <Button type="submit" label={label} primary title={label} />
      </Box>
    </Form>
  );
};

export default DataForm;
