import React, { useState } from 'react';
import {
  Box,
  Button,
  Form,
  FormField,
  RadioButtonGroup,
  TextInput,
} from 'grommet';

// old - { name, aspect, type, units, frequency, hour }
// new - {
//   name: '',
//   aspect: behavior|symptom,
//   type: number|scale|yes/no|name,
//   units: '',
//   times: ['T08:00'],
// }

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
            { value: 'yes/no', label: 'simple yes or no' },
            { value: 'scale', label: '5-point scale' },
            {
              value: 'number',
              label: 'number - like hours of sleep',
            },
            { value: 'name', label: 'free form - like "broccoli"' },
          ]}
        />
      </FormField>
      {category.type === 'number' && (
        <FormField label="units" name="units" htmlFor="units">
          <TextInput id="units" name="units" />
        </FormField>
      )}
      <FormField label="When do you intend to record it?" htmlFor="daily">
        <RadioButtonGroup
          id="daily"
          name="daily"
          value={category.times ? 'daily' : 'once in a while'}
          options={['once in a while', 'daily']}
          onChange={(event) => {
            const nextCategory = JSON.parse(JSON.stringify(category));
            if (category.times) delete nextCategory.times;
            else nextCategory.times = ['12:00'];
            setCategory(nextCategory);
          }}
        />
        {category.times && (
          <Box margin={{ top: 'small' }} gap="small" align="start">
            {category.times.map((time, index) => (
              <Box
                key={index}
                direction="row"
                align="center"
                justify="between"
                gap="small"
              >
                <TextInput
                  type="time"
                  value={time}
                  onChange={(event) => {
                    const nextCategory = JSON.parse(JSON.stringify(category));
                    nextCategory.times[index] = event.target.value;
                    setCategory(nextCategory);
                  }}
                />
                {category.times.length > 1 && (
                  <Button
                    label="remove"
                    onClick={() => {
                      const nextCategory = JSON.parse(JSON.stringify(category));
                      nextCategory.times.splice(index, 1);
                      setCategory(nextCategory);
                    }}
                  />
                )}
              </Box>
            ))}
            <Button
              label="add another time"
              onClick={() => {
                const nextCategory = JSON.parse(JSON.stringify(category));
                nextCategory.times.push('');
                setCategory(nextCategory);
              }}
            />
          </Box>
        )}
      </FormField>
      <Box margin={{ top: 'large' }} align="start">
        <Button type="submit" label={label} primary title={label} />
      </Box>
    </Form>
  );
};

export default CategoryForm;
