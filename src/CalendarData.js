import React, { useContext } from 'react';
import { Box, Button, ResponsiveContext, Text } from 'grommet';
import { addData, deleteData, updateData } from './track';
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

const CalendarData = ({
  category,
  data,
  deletable, // not part of frequency
  id,
  label,
  track,
  setTrack,
  ...rest
}) => {
  const responsive = useContext(ResponsiveContext);

  const onChange = (value) => {
    let nextTrack;
    // if unsetting saved frequency data, delete it
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
    <Box
      key={category.id}
      direction="row-responsive"
      justify="between"
      align="center"
      gap="medium"
      pad={{ vertical: 'small' }}
      border="top"
      responsive={false}
      {...rest}
    >
      <Box flex direction="row" justify="between" align="center">
        <Input
          id={id}
          name={id}
          {...inputProps}
          value={data.value === undefined ? '' : data.value}
          onChange={(event) => onChange(Input.normalize(event.target.value))}
        />
        {control}
      </Box>
      <Box flex={false} alignSelf={responsive === 'small' ? 'end' : undefined}>
        <Text truncate margin={{ horizontal: 'small', vertical: 'small' }}>
          {label} {category.name}
        </Text>
      </Box>
    </Box>
  );
};

export default CalendarData;
