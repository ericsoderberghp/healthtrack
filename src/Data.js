import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Box, Header, Heading, List, Text, TextInput } from 'grommet';
import { Add, Search, User } from 'grommet-icons';
import { Page, RoutedButton } from './components';
import TrackContext from './TrackContext';
import { RouterContext } from './Router';
import { getCategory } from './track';
import { toDate } from './utils';

const Data = () => {
  const { push } = useContext(RouterContext);
  const [track] = useContext(TrackContext);
  const [search, setSearch] = useState('');
  const [data, setData] = useState(track ? track.data : []);

  useEffect(() => {
    if (search) {
      const exp = new RegExp(search, 'i');
      setData(track.data.filter((d) => exp.test(d.name)));
    } else setData(track.data);
  }, [search, track]);

  const categoryMap = useMemo(() => {
    const result = {};
    if (track)
      track.data.forEach((d) => {
        result[d.category] = getCategory(track, d.category);
      });
    return result;
  }, [track]);

  return (
    <Page>
      <Box pad={{ horizontal: 'large' }}>
        <Header>
          <Heading>data</Heading>
          <RoutedButton
            icon={<Add />}
            primary
            path="/data/add"
            title="add data"
          />
        </Header>
      </Box>
      {track.data.length > 20 && (
        <Box margin={{ bottom: 'large', horizontal: 'large' }}>
          <TextInput
            aria-label="search input"
            icon={<Search />}
            placeholder="search ..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </Box>
      )}
      <Box pad={{ horizontal: 'large' }}>
        <List
          aria-label="data"
          pad={{ vertical: 'medium', horizontal: 'none' }}
          data={data}
          primaryKey={(item, _, ref) => {
            const category = categoryMap[item.category];
            const parts = [];
            if (category.type === 'number' || category.type === 'name')
              parts.push(
                <Text key="v" weight="bold">
                  {item.value}
                </Text>,
              );
            else if (category.type === 'scale')
              parts.push(
                <Box key="v" direction="row" gap="xsmall">
                  {Array.from(Array(item.value)).map((_, index) => (
                    <Box
                      key={index}
                      pad="small"
                      round="xsmall"
                      background="selected"
                    />
                  ))}
                </Box>,
              );
            else if (category.type === 'yes/no')
              parts.push(
                <Text key="v" weight="bold">
                  {item.value ? 'yes' : 'no'}
                </Text>,
              );
            if (category.units)
              parts.push(
                <Text key="u" weight="bold" color="text-xweak">
                  {category.units}
                </Text>,
              );
            parts.push(<Text key="n">{category.name}</Text>);
            return (
              <Box key={item.date} ref={ref} direction="row" gap="small">
                {parts}
              </Box>
            );
          }}
          secondaryKey={(item) => {
            return toDate(item.date).toLocaleString(undefined, {
              month: 'short',
              day: 'numeric',
            });
          }}
          onClickItem={({ item }) => push(`/data/${item.id}`)}
        />
      </Box>
      <Box
        margin={{ top: 'large' }}
        pad={{ horizontal: 'large' }}
        align="start"
      >
        <RoutedButton label="guide" icon={<User />} path="/" />
      </Box>
    </Page>
  );
};

export default Data;
