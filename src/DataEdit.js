import React, { useContext, useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Form,
  FormField,
  Header,
  Heading,
  RadioButtonGroup,
  Text,
  TextInput,
} from 'grommet';
import { Close, Star } from 'grommet-icons';
import { DateInput, Page, RoutedButton } from './components';
import TrackContext from './TrackContext';
import { RouterContext } from './Router';
import { getCategory, getData } from './track';
import { sortOn } from './utils';

const DataEdit = ({ id: idArg }) => {
  const { push } = useContext(RouterContext);
  const id = parseInt(idArg, 10);
  const [track, setTrack] = useContext(TrackContext);
  const [data, setData] = useState();
  useEffect(() => {
    if (track && id) setData(getData(track, id));
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
      <Box pad={{ horizontal: 'medium' }} flex="grow" responsive={false}>
        <Header>
          <Heading>edit {category.name}</Heading>
          <RoutedButton icon={<Close />} path="/data" />
        </Header>
        <Form value={data} onChange={setData} onSubmit={onSubmit}>
          {/* {category && category.type === 'yes/no' && (
            <FormField name="value" required>
              <CheckBox name="value" toggle />
            </FormField>
          )} */}
          {category && category.type === 'rating' && (
            <FormField name="value" required>
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
                  return <Star key={option} color={color} size="large" />;
                }}
              </RadioButtonGroup>
            </FormField>
          )}
          {category && category.type === 'number' && (
            <FormField name="value" required>
              <Box direction="row" align="center" justify="between">
                <TextInput name="value" type="number" size="xlarge" plain />
                <Text size="large">{category.units || 'value'}</Text>
              </Box>
            </FormField>
          )}
          {category && category.type === 'name' && (
            <FormField name="value" required>
              <TextInput name="value" size="xlarge" placeholder="name" />
            </FormField>
          )}
          <FormField name="date" required>
            <DateInput name="date" plain format="mm/dd/yyyy" />
          </FormField>
          <Box margin={{ top: 'large' }} align="start">
            <Button type="submit" label="Update" primary />
          </Box>
        </Form>
      </Box>
      <Box
        margin={{ top: 'xlarge' }}
        pad={{ horizontal: 'medium' }}
        align="start"
        responsive={false}
      >
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
    </Page>
  );
};

export default DataEdit;
