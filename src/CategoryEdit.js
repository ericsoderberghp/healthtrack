import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Form,
  FormField,
  Header,
  Heading,
  RadioButtonGroup,
  // TextArea,
  TextInput,
} from 'grommet';
import { Close } from 'grommet-icons';
import { Page, RoutedButton } from './components';
import TrackContext from './TrackContext';
import { RouterContext } from './Router';
import { getCategory } from './track';
import { sortOn } from './utils';

const CategoryEdit = ({ id: idArg }) => {
  const { push } = useContext(RouterContext);
  const id = parseInt(idArg, 10);
  const [track, setTrack] = useContext(TrackContext);
  const [category, setCategory] = useState();
  useEffect(() => {
    if (track && id) setCategory(getCategory(track, id));
  }, [id, track]);

  const onSubmit = () => {
    const nextTrack = JSON.parse(JSON.stringify(track));
    const index = nextTrack.categories.findIndex((c) => c.id === id);
    nextTrack.categories[index] = category;
    sortOn(nextTrack.categories, 'name');
    setTrack(nextTrack);
    push('/categories');
  };

  if (!category) return null;

  return (
    <Page>
      <Box pad={{ horizontal: 'medium' }} flex="grow" responsive={false}>
        <Header>
          <Heading>edit category</Heading>
          <RoutedButton icon={<Close />} hoverIndicator path="/categories" />
        </Header>
        <Form value={category} onChange={setCategory} onSubmit={onSubmit}>
          <FormField label="name" name="name">
            <TextInput name="name" />
          </FormField>
          <FormField label="aspect" name="aspect">
            <RadioButtonGroup
              name="aspect"
              options={['behavior', 'symptom', 'remedy']}
            />
          </FormField>
          <FormField label="type" name="type">
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
          {/* {(category.type === 'number' || category.type === 'name') && (
            <FormField label="options" name="options">
              <TextArea name="options" />
            </FormField>
          )} */}
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
            const index = nextTrack.categories.findIndex((c) => c.id === id);
            nextTrack.categories.splice(index, 1);
            setTrack(nextTrack);
            push('/categories');
          }}
        />
      </Box>
    </Page>
  );
};

export default CategoryEdit;
