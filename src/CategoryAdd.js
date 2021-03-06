import React, { useContext } from 'react';
import { Box, Header, Heading } from 'grommet';
import { Close } from 'grommet-icons';
import { Page, RoutedButton } from './components';
import TrackContext from './TrackContext';
import { RouterContext } from './Router';
import { nextId, sortOn } from './utils';
import CategoryForm from './CategoryForm';

const initialCategory = {
  name: '',
  aspect: '',
  type: '',
  units: '',
};

const CategoryAdd = () => {
  const { push } = useContext(RouterContext);
  const [track, setTrack] = useContext(TrackContext);

  const onSubmit = (nextCategory) => {
    const nextTrack = JSON.parse(JSON.stringify(track));
    nextCategory.id = nextId(nextTrack.categories);
    nextCategory.date = new Date().toISOString();
    nextTrack.categories.push(nextCategory);
    sortOn(nextTrack.categories, 'name');
    setTrack(nextTrack);
    push('/categories');
  };

  if (!track) return null;

  return (
    <Page>
      <Box pad={{ horizontal: 'large' }} flex="grow">
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
