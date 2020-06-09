import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  Box,
  Button,
  Form,
  FormField,
  Header,
  Heading,
  List,
  RadioButtonGroup,
  Text,
  TextInput,
} from 'grommet';
import { Close, Search, Star } from 'grommet-icons';
import { DateInput, Page, RoutedButton } from './components';
import TrackContext from './TrackContext';
import { RouterContext } from './Router';
import { getCategory } from './track';
import { sortOn } from './utils';

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
        const matchedNames = {};
        const matchedData = track.data.filter((d) => {
          if (exp.test(d.value) && !matchedNames[d.value]) {
            matchedNames[d.value] = true;
            return true;
          }
          return false;
        });
        const matchedCategories = track.categories.filter((c) =>
          exp.test(c.name),
        );
        setStarters([...matchedData, ...matchedCategories]);
      } else {
        const latestData = track.data[0] && track.data[0].date.split('T')[0];
        const recentData = latestData
          ? track.data.filter((d) => d.date.split('T')[0] === latestData)
          : [];
        setStarters([...recentData, ...track.categories]);
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

  const suggestions = useMemo(() => {
    if (category && category.type === 'name') {
      return Array.from(
        new Set(
          track.data
            .filter((d) => d.category === category.id)
            .map((d) => d.name),
        ),
      );
    }
    return undefined;
  }, [category, track]);

  const inputRef = useRef();

  useEffect(() => {
    if (data && !data.value && inputRef.current) inputRef.current.focus();
  }, [data]);

  if (!track) return null;

  const onSubmit = () => {
    const nextTrack = JSON.parse(JSON.stringify(track));
    let nextId = 1;
    nextTrack.data.forEach((d) => {
      nextId = Math.max(nextId, d.id + 1);
    });
    data.id = nextId;
    if (!data.date) data.date = new Date().toISOString();
    if (!data.name) data.name = category.name;
    if (category.type === 'number') data.value = parseInt(data.value, 10);
    if (category.type === 'yes/no') data.value = true;
    nextTrack.data.unshift(data);
    sortOn(nextTrack.data, 'date', 'desc');
    setTrack(nextTrack);
    push('/data');
  };

  return (
    <Page>
      <Box pad={{ horizontal: 'medium' }} flex="grow" responsive={false}>
        <Header>
          <Box direction="row" align="center">
            {/* {data && (
              <Button
                icon={<Previous />}
                hoverIndicator
                onClick={() => setData(undefined)}
              />
            )} */}
            <Heading>add {category ? category.name : 'data'}</Heading>
          </Box>
          <RoutedButton icon={<Close />} hoverIndicator path="/data" />
        </Header>
        {!data ? (
          <Box>
            <TextInput
              icon={<Search />}
              placeholder="search ..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <List
              data={starters}
              primaryKey={(item) => (
                <Text key={item.value || item.name} weight="bold">
                  {item.category && typeof item.value === 'string'
                    ? item.value
                    : item.name}
                </Text>
              )}
              secondaryKey={(item) => {
                if (item.date && item.category)
                  return new Date(item.date).toLocaleString(undefined, {
                    month: 'short',
                    day: 'numeric',
                  });
                return null;
              }}
              onClickItem={({ item }) => {
                const base = item.category
                  ? item
                  : { category: item.id, name: '' };
                setData({
                  ...base,
                  date: new Date().toISOString(),
                  id: undefined,
                  value: '',
                });
              }}
            />
          </Box>
        ) : (
          <Form value={data} onChange={setData} onSubmit={onSubmit}>
            {category && category.type === 'rating' && (
              <FormField name="value" required>
                <RadioButtonGroup
                  ref={inputRef}
                  name="value"
                  options={[1, 2, 3, 4, 5]}
                  direction="row"
                >
                  {(option, { checked, hover }) => {
                    let color;
                    if (hover) color = 'active-text';
                    else if (option <= data.value) color = 'control';
                    else color = 'status-disabled';
                    return <Star key={option} color={color} size="large" />;
                  }}
                </RadioButtonGroup>
              </FormField>
            )}
            {category && category.type === 'number' && (
              <FormField ref={inputRef} name="value" required>
                <Box direction="row" align="center" justify="between">
                  <TextInput
                    ref={inputRef}
                    name="value"
                    type="number"
                    size="xlarge"
                    plain
                  />
                  <Text size="large">{category.units || 'value'}</Text>
                </Box>
              </FormField>
            )}
            {category && category.type === 'name' && (
              <FormField name="value" required>
                <TextInput
                  ref={inputRef}
                  name="value"
                  size="xlarge"
                  placeholder="name"
                  suggestions={suggestions}
                />
              </FormField>
            )}
            {data && (
              <FormField name="date" required>
                <DateInput name="date" plain format="mm/dd/yyyy" />
              </FormField>
            )}
            <Box margin={{ top: 'medium' }} align="start">
              <Button type="submit" label="Add" primary />
            </Box>
          </Form>
        )}
      </Box>
    </Page>
  );
};

export default DataAdd;
