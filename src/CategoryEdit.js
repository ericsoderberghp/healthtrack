import React, { useContext, useEffect, useState } from 'react';
import { Box, Button, Header, Heading } from 'grommet';
import { Close } from 'grommet-icons';
import { Page, RoutedButton } from './components';
import TrackContext from './TrackContext';
import { RouterContext } from './Router';
import { getCategory } from './track';
import { sortOn } from './utils';
import CategoryForm from './CategoryForm';

const CategoryEdit = ({ id: idArg }) => {
  const { push } = useContext(RouterContext);
  const id = parseInt(idArg, 10);
  const [track, setTrack] = useContext(TrackContext);
  const [category, setCategory] = useState();
  useEffect(() => {
    if (track && id) setCategory(getCategory(track, id));
  }, [id, track]);

  const onSubmit = (nextCategory) => {
    const nextTrack = JSON.parse(JSON.stringify(track));
    const index = nextTrack.categories.findIndex((c) => c.id === id);
    nextTrack.categories[index] = nextCategory;
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
          <RoutedButton icon={<Close />} path="/categories" />
        </Header>
        <CategoryForm
          defaultValue={category}
          label="Update"
          onSubmit={onSubmit}
        />
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
