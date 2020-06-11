import React, { useContext } from 'react';
import { Box, Header, Heading } from 'grommet';
import { Close } from 'grommet-icons';
import { Page, RoutedButton } from './components';
import TrackContext from './TrackContext';
import { RouterContext } from './Router';
import { sortOn } from './utils';
import CategoryForm from './CategoryForm';

const initialCategory = {
  name: '',
  aspect: '',
  type: '',
  units: '',
  options: '',
};

const CategoryAdd = () => {
  const { push } = useContext(RouterContext);
  const [track, setTrack] = useContext(TrackContext);

  const onSubmit = (nextCategory) => {
    const nextTrack = JSON.parse(JSON.stringify(track));
    let nextId = 1;
    nextTrack.categories.forEach((c) => {
      nextId = Math.max(nextId, c.id + 1);
    });
    nextCategory.id = nextId;
    nextCategory.date = new Date().toISOString();
    nextTrack.categories.push(nextCategory);
    sortOn(nextTrack.categories, 'name');
    setTrack(nextTrack);
    push('/categories');
  };

  return (
    <Page>
      <Box pad={{ horizontal: 'medium' }} flex="grow" responsive={false}>
        <Header>
          <Heading>add category</Heading>
          <RoutedButton icon={<Close />} path="/categories" />
        </Header>
        <CategoryForm
          defaultValue={initialCategory}
          label="Add"
          onSubmit={onSubmit}
        />
      </Box>
    </Page>
  );
};

export default CategoryAdd;
