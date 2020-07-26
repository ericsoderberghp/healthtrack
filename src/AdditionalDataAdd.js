import React, { useState } from 'react';
import { Box, Button, Form, FormField, Select, TextInput } from 'grommet';

const AdditionalDataAdd = ({ date, track, onAdd, onCancel }) => {
  const [data, setData] = useState({
    category: '',
    time: `${new Date().getHours()}:00`,
  });
  return (
    <Form
      value={data}
      onChange={setData}
      onSubmit={() => {
        // convert time to date
        const dataDate = new Date(date);
        const [hours, minutes] = data.time.split(':');
        dataDate.setHours(hours);
        dataDate.setMinutes(minutes);
        data.date = dataDate.toISOString();
        delete data.time;
        onAdd(data);
      }}
    >
      <FormField label="category" name="category" htmlFor="category" required>
        <Select
          id="category"
          name="category"
          options={track.categories.filter((c) => !c.times)}
          labelKey="name"
          valueKey={{ key: 'id', reduce: true }}
          placeholder="select category ..."
        />
      </FormField>
      <FormField label="time" name="time" htmlFor="time">
        <TextInput id="time" name="time" type="time" />
      </FormField>
      <Box
        margin={{ top: 'large' }}
        direction="row"
        align="center"
        gap="medium"
      >
        <Button type="submit" label="Add" primary title="add additional data" />
        <Button
          label="Cancel"
          title="cancel add additional data"
          onClick={onCancel}
        />
      </Box>
    </Form>
  );
};

export default AdditionalDataAdd;
