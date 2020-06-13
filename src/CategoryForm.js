import React, { useState } from 'react';
import {
  Box,
  Button,
  Form,
  FormField,
  RadioButtonGroup,
  TextInput,
} from 'grommet';
import { frequencyLabel } from './track';

const CategoryForm = ({ defaultValue, label, onSubmit }) => {
  const [category, setCategory] = useState(defaultValue);
  return (
    <Form
      value={category}
      onChange={setCategory}
      onSubmit={() => onSubmit(category)}
    >
      <FormField label="name" name="name" htmlFor="name" required>
        <TextInput id="name" name="name" />
      </FormField>
      <FormField
        label="What kind of measurement is this?"
        name="aspect"
        htmlFor="aspect"
        required
      >
        <RadioButtonGroup
          id="aspect"
          name="aspect"
          options={[
            {
              value: 'behavior',
              label: 'behavior - something you do, like exercise',
            },
            {
              value: 'symptom',
              label: 'symptom - something you feel, like fatigue',
            },
          ]}
        />
      </FormField>
      <FormField
        label="How do you want to record it?"
        name="type"
        htmlFor="type"
        required
        help="Pick a level of detail that works for you.
          For example, do you want
          to track how many minutes you napped, how 'good' it felt,
          or just that you took a nap?"
      >
        <RadioButtonGroup
          id="type"
          name="type"
          options={[
            {
              value: 'number',
              label: 'number - like hours of sleep',
            },
            { value: 'scale', label: '5-point scale' },
            { value: 'yes/no', label: 'simple yes or no' },
            { value: 'name', label: 'free form - like "broccoli"' },
          ]}
        />
      </FormField>
      {category.type === 'number' && (
        <FormField label="units" name="units" htmlFor="units">
          <TextInput id="units" name="units" />
        </FormField>
      )}
      <FormField
        label="How often do you intend to record it?"
        name="frequency"
        htmlFor="frequency"
      >
        <RadioButtonGroup
          id="frequency"
          name="frequency"
          options={[0, 1, 2, 3, 4].map((value) => ({
            value,
            label: frequencyLabel[value],
          }))}
        />
      </FormField>
      <Box margin={{ top: 'large' }} align="start">
        <Button type="submit" label={label} primary title={label} />
      </Box>
    </Form>
  );
};

export default CategoryForm;
