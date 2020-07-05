import React, { useContext, useEffect, useState } from 'react';
import { Box, Header, Heading, List, TextInput } from 'grommet';
import { Add, Search, User } from 'grommet-icons';
import { Page, RoutedButton } from './components';
import { RouterContext } from './Router';
import TrackContext from './TrackContext';
import { sortCategories, timeLabel } from './utils';

const Categories = () => {
  const { push } = useContext(RouterContext);
  const [track] = useContext(TrackContext);
  const [search, setSearch] = useState('');
  const [categories, setCategories] = useState(
    (track ? track.categories : []).sort(sortCategories),
  );
  useEffect(() => {
    if (track && search) {
      const exp = new RegExp(search, 'i');
      setCategories(
        sortCategories(track.categories.filter((c) => exp.test(c.name))),
      );
    } else if (track) setCategories(track.categories.sort(sortCategories));
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
        secondaryKey={(c) =>
          c.times ? c.times.map((t) => timeLabel(undefined, t)).join(', ') : ''
        }
        onClickItem={({ item: { id } }) => push(`/categories/${id}`)}
      />
      <Box margin={{ top: 'large' }} align="start">
        <RoutedButton label="guide" icon={<User />} path="/" />
      </Box>
    </Page>
  );
};

export default Categories;
