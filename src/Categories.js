import React, { useContext } from 'react';
import { Box, Header, Heading, List } from 'grommet';
import { Add } from 'grommet-icons';
import { Page, RoutedButton } from './components';
import { RouterContext } from './Router';
import TrackContext from './TrackContext';

const Categories = () => {
  const { push } = useContext(RouterContext);
  const [track] = useContext(TrackContext);

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
