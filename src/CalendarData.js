import React, { useContext } from 'react';
import { Box, Button, ResponsiveContext, Text } from 'grommet';
import { addData, deleteData, updateData } from './track';
import DataYesNo from './DataYesNo';
import DataScale from './DataScale';
import DataNumber from './DataNumber';
import DataName from './DataName';

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
    const nextTrack = data.id
      ? updateData(track, data, {
          name: typeof value === 'string' ? value : category.name,
          value,
        })
      : addData(track, {
          ...data,
          name: typeof value === 'string' ? value : category.name,
          value,
        });
    setTrack(nextTrack);
  };

  let content;
  if (category.type === 'number') {
    content = (
      <DataNumber
        id={id}
        name={id}
        units={category.units}
        value={data.value || ''}
        onChange={(event) => onChange(event.target.value)}
      />
    );
  } else if (category.type === 'yes/no') {
    content = (
      <DataYesNo
        id={id}
        name={id}
        value={data.value || ''}
        onChange={(event) => onChange(JSON.parse(event.target.value))}
      />
    );
  } else if (category.type === 'scale') {
    content = (
      <DataScale
        id={id}
        name={id}
        value={data.value || ''}
        onChange={(event) => onChange(event.target.value)}
      />
    );
  } else if (category.type === 'name') {
    content = (
      <DataName
        id={id}
        name={id}
        value={data.value || ''}
        onChange={(event) => onChange(event.target.value)}
      />
    );
  }
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
      {content}
      {deletable && (
        <Box
          flex={false}
          alignSelf={responsive === 'small' ? 'end' : undefined}
        >
          <Button
            label="delete"
            onClick={() => setTrack(deleteData(track, data))}
          />
        </Box>
      )}
      <Box flex={false} alignSelf={responsive === 'small' ? 'end' : undefined}>
        <Text truncate>
          {label} {category.name}
        </Text>
      </Box>
    </Box>
  );
};

export default CalendarData;
