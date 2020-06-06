import React, { useContext } from 'react';
import { Box, Header, Heading, List } from 'grommet';
import { Add } from 'grommet-icons';
import Page from './Page';
import RoutedButton from './RoutedButton';
import { RouterContext } from './Router';
import { useTrack } from './track';

const Categories = () => {
  const { push } = useContext(RouterContext);
  const [track] = useTrack();

  if (!track) return null;

  return (
    <Page>
      <Box pad={{ horizontal: 'medium' }}>
        <Header>
          <Heading>categories</Heading>
          <RoutedButton
            icon={<Add />}
            primary
            hoverIndicator
            path="/categories/add"
          />
        </Header>
      </Box>
      <List
        data={track.categories}
        primaryKey="name"
        secondaryKey="aspect"
        onClickItem={({ item: { id } }) => push(`/categories/${id}`)}
      />
    </Page>
  );
};

export default Categories;
