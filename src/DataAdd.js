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

const DataAdd = () => {
  const { push } = useContext(RouterContext);
  const [track, setTrack] = useTrack();
  const [categories, setCategories] = useState();
  useEffect(() => {
    if (!categories && track) setCategories(track.categories);
  }, [categories, track]);
  const [data, setData] = useState({
    category: 0,
    name: '',
    value: '',
    date: new Date().toISOString(),
  });
  const category = useMemo(
    () =>
      track && data.category ? getCategory(track, data.category) : undefined,
    [data, track],
  );

  if (!track) return null;

  const onSubmit = () => {
    const nextTrack = JSON.parse(JSON.stringify(track));
    let nextId = 1;
    nextTrack.data.forEach((d) => {
      nextId = Math.max(nextId, d.id + 1);
    });
    data.id = nextId;
    if (!data.date) data.date = new Date().toISOString();
    if (!data.name) data.name = category.name;
    if (category.type === 'number') data.value = parseInt(data.value, 10);
    nextTrack.data.unshift(data);
    sortOn(nextTrack.data, 'date', 'desc');
    setTrack(nextTrack);
    push('/data');
  };

  return (
    <Page>
      <Box pad={{ horizontal: 'medium' }}>
        <Header>
          <Heading>add data</Heading>
          <RoutedButton icon={<Close />} hoverIndicator path="/data" />
        </Header>
        <Form value={data} onChange={setData} onSubmit={onSubmit}>
          {categories && (
            <FormField label="category" name="category" required>
              <Select
                name="category"
                options={categories}
                labelKey="name"
                valueKey={{ key: 'id', reduce: true }}
                onSearch={(search) => {
                  const regexp = new RegExp(search, 'i');
                  setCategories(
                    track.categories.filter((c) => regexp.test(c.name)),
                  );
                }}
              />
            </FormField>
          )}
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
                  else if (option <= data.value) color = 'brand';
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
          {category && (
            <FormField label="date" name="date" required>
              <DateInput name="date" plain />
            </FormField>
          )}
          <Box margin={{ top: 'medium' }} align="start">
            <Button type="submit" label="Add" primary />
          </Box>
        </Form>
      </Box>
    </Page>
  );
};

export default DataAdd;
