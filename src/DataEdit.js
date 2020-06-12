import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Box, Button, Header, Heading } from 'grommet';
import { Close } from 'grommet-icons';
import { Page, RoutedButton } from './components';
import TrackContext from './TrackContext';
import { RouterContext } from './Router';
import { getCategory, getData } from './track';
import { sortOn } from './utils';
import DataForm from './DataForm';

const DataEdit = ({ id: idArg }) => {
  const { push } = useContext(RouterContext);
  const id = parseInt(idArg, 10);
  const [track, setTrack] = useContext(TrackContext);
  const [data, setData] = useState();
  useEffect(() => {
    if (track && id) setData(getData(track, id));
  }, [id, track]);

  const category = useMemo(
    () =>
      track && data && data.category
        ? getCategory(track, data.category)
        : undefined,
    [data, track],
  );

  const onSubmit = (nextData) => {
    const nextTrack = JSON.parse(JSON.stringify(track));
    const index = nextTrack.data.findIndex((d) => d.id === id);
    if (category.type === 'number')
      nextData.value = parseInt(nextData.value, 10);
    nextTrack.data[index] = nextData;
    sortOn(nextTrack.data, 'date', 'desc');
    setTrack(nextTrack);
    push('/data');
  };

  if (!data) return null;

  return (
    <Page>
      <Box pad={{ horizontal: 'medium' }} flex="grow" responsive={false}>
        <Header>
          <Heading>edit {category.name}</Heading>
          <RoutedButton icon={<Close />} path="/data" />
        </Header>
        <DataForm
          category={category}
          defaultValue={data}
          label="Update"
          onSubmit={onSubmit}
          track={track}
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
            const index = nextTrack.data.findIndex((d) => d.id === id);
            nextTrack.data.splice(index, 1);
            setTrack(nextTrack);
            push('/data');
          }}
        />
      </Box>
    </Page>
  );
};

export default DataEdit;
