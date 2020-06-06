import React, { useContext, useState } from 'react';
import {
  Box,
  Button,
  Form,
  FormField,
  Header,
  Heading,
  RadioButtonGroup,
  TextArea,
  TextInput,
} from 'grommet';
import { Close } from 'grommet-icons';
import Page from './Page';
import RoutedButton from './RoutedButton';
import { RouterContext } from './Router';
import { useTrack } from './track';
import { sortOn } from './utils';

const CategoryAdd = () => {
  const { push } = useContext(RouterContext);
  const [track, setTrack] = useTrack();
  const [category, setCategory] = useState({
    name: '',
    aspect: '',
    type: '',
    units: '',
    options: '',
  });

  const onSubmit = () => {
    const nextTrack = JSON.parse(JSON.stringify(track));
    let nextId = 1;
    nextTrack.categories.forEach((c) => {
      nextId = Math.max(nextId, c.id + 1);
    });
    category.id = nextId;
    if (category.options) category.options = category.options.split('\n');
    nextTrack.categories.push(category);
    sortOn(nextTrack.categories, 'name');
    setTrack(nextTrack);
    push('/categories');
  };

  return (
    <Page>
      <Box pad={{ horizontal: 'medium' }}>
        <Header>
          <Heading>add category</Heading>
          <RoutedButton icon={<Close />} hoverIndicator path="/categories" />
        </Header>
        <Form value={category} onChange={setCategory} onSubmit={onSubmit}>
          <FormField label="name" name="name" required>
            <TextInput name="name" />
          </FormField>
          <FormField label="aspect" name="aspect" required>
            <RadioButtonGroup
              name="aspect"
              options={['behavior', 'symptom', 'remedy']}
            />
          </FormField>
          <FormField label="type" name="type" required>
            <RadioButtonGroup
              name="type"
              options={['number', 'rating', 'yes/no', 'name']}
            />
          </FormField>
          {category.type === 'number' && (
            <FormField label="units" name="units">
              <TextInput name="units" />
            </FormField>
          )}
          {(category.type === 'number' || category.type === 'name') && (
            <FormField label="options" name="options">
              <TextArea name="options" />
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

export default CategoryAdd;
