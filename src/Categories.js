import React, { useContext, useEffect, useState } from 'react';
import { Box, Header, Heading, List, TextInput } from 'grommet';
import { Add, Search } from 'grommet-icons';
import { Page, RoutedButton } from './components';
import { RouterContext } from './Router';
import TrackContext from './TrackContext';
import { frequencyHourLabel, frequencyLabel } from './track';

const Categories = () => {
  const { push } = useContext(RouterContext);
  const [track] = useContext(TrackContext);
  const [search, setSearch] = useState('');
  const [categories, setCategories] = useState(track ? track.categories : []);
  useEffect(() => {
    if (track && search) {
      const exp = new RegExp(search, 'i');
      setCategories(track.categories.filter((c) => exp.test(c.name)));
    } else if (track) setCategories(track.categories);
  }, [search, track]);

  if (!track) return null;

  return (
    <Page>
      <Box pad={{ horizontal: 'medium' }}>
        <Header>
          <Heading>categories</Heading>
          <RoutedButton
            icon={<Add />}
            primary
            path="/categories/add"
            title="add category"
          />
        </Header>
      </Box>
      {track.categories.length > 20 && (
        <Box margin={{ bottom: 'medium' }} responsive={false}>
          <TextInput
            aria-label="search input"
            icon={<Search />}
            placeholder="search ..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </Box>
      )}
      <List
        aria-label="categories"
        data={categories}
        primaryKey="name"
        secondaryKey={(item) => {
          if (item.frequency)
            if (item.hour)
              return `${frequencyLabel[item.frequency]} - ${
                frequencyHourLabel[item.hour]
              }`;
            else return frequencyLabel[item.frequency];
          return '';
        }}
        onClickItem={({ item: { id } }) => push(`/categories/${id}`)}
      />
    </Page>
  );
};

export default Categories;
