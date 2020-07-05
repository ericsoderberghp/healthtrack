import React, { useContext, useEffect, useState } from 'react';
import { Box, Header, Heading, List, TextInput } from 'grommet';
import { Add, Search, User } from 'grommet-icons';
import { Page, RoutedButton } from './components';
import { RouterContext } from './Router';
import TrackContext from './TrackContext';
import { timeLabel } from './utils';

const sortCategories = (categories) =>
  categories.sort((c1, c2) => {
    if (c1.times && !c2.times) return -1;
    if (c2.times && !c1.times) return 1;
    if (c1.times && c2.times) {
      if (c1.times[0] < c2.times[0]) return -1;
      if (c2.times[0] < c1.times[0]) return 1;
    }
    const n1 = c1.name.toLowerCase();
    const n2 = c2.name.toLowerCase();
    if (n1 < n2) return -1;
    if (n2 < n1) return 1;
    return 0;
  });

const Categories = () => {
  const { push } = useContext(RouterContext);
  const [track] = useContext(TrackContext);
  const [search, setSearch] = useState('');
  const [categories, setCategories] = useState(
    sortCategories(track ? track.categories : []),
  );
  useEffect(() => {
    if (track && search) {
      const exp = new RegExp(search, 'i');
      setCategories(
        sortCategories(track.categories.filter((c) => exp.test(c.name))),
      );
    } else if (track) setCategories(sortCategories(track.categories));
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
