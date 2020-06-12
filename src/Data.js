import React, { useContext, useMemo } from 'react';
import { Box, Header, Heading, List, Text } from 'grommet';
import { Add, Star } from 'grommet-icons';
import { Page, RoutedButton } from './components';
import TrackContext from './TrackContext';
import { RouterContext } from './Router';
import { getCategory } from './track';

const Data = () => {
  const { push } = useContext(RouterContext);
  const [track] = useContext(TrackContext);

  const categoryMap = useMemo(() => {
    const result = {};
    if (track)
      track.data.forEach((d) => {
        result[d.category] = getCategory(track, d.category);
      });
    return result;
  }, [track]);

  if (!track) return null;

  return (
    <Page>
      <Box pad={{ horizontal: 'medium' }} responsive={false}>
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
      <List
        aria-label="data"
        data={track.data}
        primaryKey={(item, _, ref) => {
          const category = categoryMap[item.category];
          const parts = [];
          if (category.type === 'number' || category.type === 'name')
            parts.push(
              <Text key="v" weight="bold">
                {item.value}
              </Text>,
            );
          else if (category.type === 'rating')
            parts.push(
              <Box key="v" direction="row">
                {Array.from(Array(item.value)).map((_, index) => (
                  <Star key={index} color="selected" />
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
          if (category.type !== 'name')
            parts.push(<Text key="n">{item.name}</Text>);
          return (
            <Box key={item.date} ref={ref} direction="row" gap="small">
              {parts}
            </Box>
          );
        }}
        secondaryKey={(item) => {
          return new Date(item.date).toLocaleString(undefined, {
            month: 'short',
            day: 'numeric',
          });
        }}
        onClickItem={({ item }) => push(`/data/${item.id}`)}
      />
    </Page>
  );
};

export default Data;
