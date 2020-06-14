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
  deletable,
  id,
  label,
  track,
  setTrack,
  ...rest
}) => {
  const responsive = useContext(ResponsiveContext);

  const onChange = (value) => {
    let nextTrack;
    if (data.id && value === undefined) nextTrack = deleteData(track, data);
    else {
      const nextData = {
        name: typeof value === 'string' ? value : category.name,
        value,
      };
      if (data.id) nextTrack = updateData(track, data, nextData);
      else nextTrack = addData(track, { ...data, ...nextData });
    }
    setTrack(nextTrack);
  };

  let Input = TypeInput[category.type];
  let inputProps;
  if (category.type === 'number') inputProps = { units: category.units };

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
      <Input
        id={id}
        name={id}
        {...inputProps}
        value={data.value}
        onChange={(event) => onChange(Input.normalize(event.target.value))}
      />
      <Box
        flex={false}
        direction={responsive === 'small' ? 'column' : 'row'}
        align={responsive === 'small' ? 'end' : 'center'}
        alignSelf={responsive === 'small' ? 'end' : undefined}
      >
        {deletable && (
          <Button
            label="delete"
            onClick={() => setTrack(deleteData(track, data))}
          />
        )}
        <Text truncate margin={{ start: 'medium' }}>
          {label} {category.name}
        </Text>
      </Box>
    </Box>
  );
};

export default CalendarData;
