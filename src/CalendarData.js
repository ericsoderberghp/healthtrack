import React from 'react';
import { Box, Button, Text } from 'grommet';
import { NameInput, NumberInput, ScaleInput, YesNoInput } from './components';
import { addData, deleteData, updateData } from './track';

const TypeInput = {
  'yes/no': YesNoInput,
  scale: ScaleInput,
  number: NumberInput,
  name: NameInput,
};

const CalendarData = ({
  category,
  data,
  deletable, // not part of category.times
  id,
  label,
  track,
  setTrack,
  ...rest
}) => {
  const onChange = (value) => {
    let nextTrack;
    // if unsetting saved category.times data, delete it
    if (value === undefined && !deletable && data.id)
      nextTrack = deleteData(track, data);
    // otherwise, set the data
    else {
      const nextData = {
        name: typeof value === 'string' ? value : category.name,
        value,
      };
      if (data.id) nextTrack = updateData(track, data, nextData);
      else if (value !== undefined)
        nextTrack = addData(track, { ...data, ...nextData });
    }
    setTrack(nextTrack);
  };

  let Input = TypeInput[category.type];
  let inputProps;
  if (category.type === 'number') inputProps = { units: category.units };

  let control;
  if (deletable)
    control = (
      <Button
        label="delete"
        onClick={() => setTrack(deleteData(track, data))}
      />
    );
  else if (!deletable && data.value !== undefined)
    control = <Button label="clear" onClick={() => onChange(undefined)} />;

  return (
    <Box pad={{ vertical: 'large' }} border="top" {...rest}>
      <Box
        direction="row"
        align="center"
        justify="between"
        gap="small"
        pad={{ bottom: 'medium' }}
      >
        <Text>{category.name}</Text>
        {label && <Text color="text-xweak">{label}</Text>}
      </Box>
      <Box direction="row" justify="between" align="center" gap="large">
        <Input
          id={id}
          name={id}
          {...inputProps}
          value={data.value === undefined ? '' : data.value}
          onChange={(event) => onChange(Input.normalize(event.target.value))}
        />
        {control}
      </Box>
    </Box>
  );
};

export default CalendarData;
