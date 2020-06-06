import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  DataChart,
  Form,
  Header,
  Heading,
  RadioButtonGroup,
  Select,
  Text,
} from 'grommet';
import { Next, Previous } from 'grommet-icons';
import Page from './Page';
import { useTrack } from './track';

const Correlate = () => {
  const [track] = useTrack();
  const [filter, setFilter] = useState();

  useEffect(() => {
    if (track && !filter) {
      setFilter({
        referenceCategory:
          track.categories.filter((c) => c.type === 'symptom')[0] ||
          track.categories[0],
        duration: 'week',
        end: new Date().toISOString(),
      });
    }
  }, [filter, track]);

  const data = useMemo(() => {
    if (track && filter && filter.referenceCategory)
      return track.data.filter(
        (d) => d.category === filter.referenceCategory.id,
      );
    return [];
  }, [filter, track]);

  if (!filter) return null;

  console.log('!!! Correlate', data);

  return (
    <Page>
      <Box pad={{ horizontal: 'medium' }}>
        <Header>
          <Heading>correlate</Heading>
        </Header>

        <Form value={filter} onChange={setFilter}>
          <Box direction="row-responsive" gap="medium" justify="between">
            <Select
              name="referenceCategory"
              options={track.categories}
              labelKey="name"
              valueKey="id"
            />
            <Box direction="row-responsive" gap="medium">
              <RadioButtonGroup
                name="duration"
                options={['week', 'month']}
                direction="row"
                border="between"
              >
                {(option, { checked, hover }, ref) => (
                  <Box key={option} ref={ref} pad="xsmall" round="xsmall">
                    <Text weight={checked ? 'bold' : undefined}>{option}</Text>
                  </Box>
                )}
              </RadioButtonGroup>
              <Box direction="row" border="between" gap="small">
                <Button icon={<Previous />} hoverIndicator />
                <Button icon={<Next />} hoverIndicator />
              </Box>
            </Box>
          </Box>
        </Form>

        <DataChart data={data} chart={{ key: 'value' }} />
      </Box>
    </Page>
  );
};

export default Correlate;
