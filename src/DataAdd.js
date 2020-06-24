import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Box, Header, Heading, List, Text, TextInput } from 'grommet';
import { Close, Search } from 'grommet-icons';
import { Page, RoutedButton } from './components';
import TrackContext from './TrackContext';
import { RouterContext } from './Router';
import { getCategory } from './track';
import { alignDate, nextId, sortOn } from './utils';
import DataForm from './DataForm';

const DataAdd = () => {
  const { push } = useContext(RouterContext);
  const [track, setTrack] = useContext(TrackContext);
  const [search, setSearch] = useState('');
  const [starters, setStarters] = useState();

  // set starters from categories and data, using search if any
  useEffect(() => {
    if (track) {
      if (search) {
        const exp = new RegExp(search, 'i');
        const matchedCategories = track.categories.filter((c) =>
          exp.test(c.name),
        );
        setStarters(matchedCategories);
      } else {
        setStarters(track.categories);
      }
    }
  }, [search, track]);

  const [data, setData] = useState();

  const category = useMemo(
    () =>
      track && data && data.category
        ? getCategory(track, data.category)
        : undefined,
    [data, track],
  );

  if (!track) return null;

  const onSubmit = (nextData) => {
    const nextTrack = JSON.parse(JSON.stringify(track));
    nextData.id = nextId(nextTrack.data);
    nextTrack.data.unshift(nextData);
    sortOn(nextTrack.data, 'date', 'desc');
    setTrack(nextTrack);
    push('/data');
  };

  return (
    <Page>
      <Box pad={{ horizontal: 'medium' }} flex="grow" responsive={false}>
        <Header>
          <Box direction="row" align="center">
            <Heading>add {category ? category.name : 'data'}</Heading>
          </Box>
          <RoutedButton icon={<Close />} path="/data" />
        </Header>
        {!data ? (
          <Box>
            <TextInput
              aria-label="search"
              icon={<Search />}
              placeholder="search ..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <List
              data={starters}
              primaryKey={(item) => (
                <Text key={item.name} weight="bold">
                  {item.name}
                </Text>
              )}
              onClickItem={({ item }) => {
                setData({
                  category: item.id,
                  date: alignDate(new Date()).toISOString(),
                  id: undefined,
                  value: '',
                });
              }}
            />
          </Box>
        ) : (
          <DataForm
            category={category}
            defaultValue={data}
            label="Add"
            onSubmit={onSubmit}
            track={track}
          />
        )}
      </Box>
    </Page>
  );
};

export default DataAdd;
