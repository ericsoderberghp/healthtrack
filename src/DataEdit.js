import React, { useContext, useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  CheckBox,
  Form,
  FormField,
  Header,
  Heading,
  RadioButtonGroup,
  Select,
  TextInput,
} from 'grommet';
import { Close, Star } from 'grommet-icons';
import Page from './Page';
import RoutedButton from './RoutedButton';
import DateInput from './DateInput';
import { RouterContext } from './Router';
import { getCategory, useTrack } from './track';
import { sortOn } from './utils';

const DataEdit = ({ id: idArg }) => {
  const { push } = useContext(RouterContext);
  const id = parseInt(idArg, 10);
  const [track, setTrack] = useTrack();
  const [data, setData] = useState();
  useEffect(() => {
    if (track && id) setData(track.data.find((d) => d.id === id));
  }, [id, track]);

  const category = useMemo(
    () =>
      track && data && data.category
        ? getCategory(track, data.category)
        : undefined,
    [data, track],
  );

  const onSubmit = () => {
    const nextTrack = JSON.parse(JSON.stringify(track));
    const index = nextTrack.data.findIndex((d) => d.id === id);
    if (category.type === 'number') data.value = parseInt(data.value, 10);
    nextTrack.data[index] = data;
    sortOn(nextTrack.data, 'date', 'desc');
    setTrack(nextTrack);
    push('/data');
  };

  if (!data) return null;

  return (
    <Page>
      <Box pad={{ horizontal: 'medium' }}>
        <Header>
          <Heading>edit data</Heading>
          <RoutedButton icon={<Close />} hoverIndicator path="/data" />
        </Header>
        <Form value={data} onChange={setData} onSubmit={onSubmit}>
          <FormField label="category" name="category" required>
            <Select
              name="category"
              options={track.categories}
              labelKey="name"
              valueKey={{ key: 'id', reduce: true }}
              disabled
            />
          </FormField>
          {category && category.type === 'yes/no' && (
            <FormField name="value" required>
              <CheckBox name="value" toggle />
            </FormField>
          )}
          {category && category.type === 'rating' && (
            <FormField label="rating" name="value" required>
              <RadioButtonGroup
                name="value"
                options={[1, 2, 3, 4, 5]}
                direction="row"
              >
                {(option, { checked, hover }) => {
                  let color;
                  if (hover) color = 'active-text';
                  else if (option <= data.value) color = 'control';
                  else color = 'status-disabled';
                  return <Star key={option} color={color} />;
                }}
              </RadioButtonGroup>
            </FormField>
          )}
          {category && category.type === 'number' && (
            <FormField label={category.units || 'value'} name="value" required>
              <TextInput name="value" type="number" />
            </FormField>
          )}
          {category && category.type === 'name' && (
            <FormField label="name" name="value" required>
              <TextInput name="value" />
            </FormField>
          )}
          <FormField label="date" name="date" required>
            <DateInput name="date" plain />
          </FormField>
          <Box margin={{ top: 'medium' }} align="start">
            <Button type="submit" label="Update" primary />
          </Box>
        </Form>
        <Box margin={{ top: 'xlarge' }} align="start">
          <Button
            label="Delete"
            onClick={() => {
              const nextTrack = JSON.parse(JSON.stringify(track));
              const index = nextTrack.data.findIndex((d) => d.id === id);
              nextTrack.data.splice(index, 1);
              setTrack(nextTrack);
              push('/data');
            }}
          />
        </Box>
      </Box>
    </Page>
  );
};

export default DataEdit;
