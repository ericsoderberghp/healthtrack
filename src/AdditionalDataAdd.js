import React, { useMemo, useState } from 'react';
import { Box, Button, Form, FormField, Select, TextInput } from 'grommet';
import { toDateFormat } from './utils';

const AdditionalDataAdd = ({ date, track, onAdd, onCancel }) => {
  const [data, setData] = useState({
    category: '',
    value: '',
    time: `${new Date().getHours()}:00`,
  });
  // sort categories by !times then times
  const options = useMemo(
    () => [
      ...track.categories.filter((c) => !c.times),
      ...track.categories.filter((c) => c.times),
    ],
    [track.categories],
  );
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
        data.date = toDateFormat(dataDate, hours, minutes);
        delete data.time;
        if (
          track.categories.find((c) => c.id === data.category).type !== 'name'
        )
          delete data.value;
        else data.name = data.value;
        onAdd(data);
      }}
    >
      <FormField label="category" name="category" htmlFor="category" required>
        <Select
          id="category"
          name="category"
          options={options}
          labelKey="name"
          valueKey={{ key: 'id', reduce: true }}
          placeholder="select category ..."
        />
      </FormField>
      {data.category &&
        track.categories.find((c) => c.id === data.category).type ===
          'name' && (
          <FormField label="name" name="value" htmlFor="value" required>
            <TextInput id="value" name="value" />
          </FormField>
        )}
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
