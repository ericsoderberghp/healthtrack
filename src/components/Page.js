import React, { useContext } from 'react';
import { Box, Grid, Nav, ResponsiveContext } from 'grommet';
import { Test, List, Note, User } from 'grommet-icons';
import RoutedButton from './RoutedButton';

const MainNav = ({ pin }) => {
  return (
    <Nav
      direction="row"
      justify="center"
      background={{ color: 'brand' }}
      round={{ size: 'small', corner: pin ? 'top' : 'bottom' }}
      pad={
        pin ? { bottom: 'medium', vertical: 'small' } : { vertical: 'small' }
      }
      responsive={false}
      style={
        pin ? { position: 'fixed', bottom: 0, left: 0, right: 0 } : undefined
      }
    >
      <RoutedButton title="home" icon={<User />} hoverIndicator path="/" />
      <RoutedButton title="data" icon={<List />} hoverIndicator path="/data" />
      <RoutedButton
        title="correlate"
        icon={<Test />}
        hoverIndicator
        path="/correlate"
      />
      <RoutedButton
        title="notes"
        icon={<Note />}
        hoverIndicator
        path="/notes"
      />
    </Nav>
  );
};

const Page = ({ children }) => {
  const size = useContext(ResponsiveContext);
  return (
    <Grid
      columns={['flex', ['small', 'large'], 'flex']}
      rows={['100%']}
      areas={[{ name: 'content', start: [1, 0], end: [1, 0] }]}
      style={{ minHeight: '100%' }}
    >
      <Box
        gridArea="content"
        pad={{ bottom: 'xlarge' }}
        margin={{ bottom: 'xlarge' }}
      >
        {size !== 'small' && <MainNav />}
        {children}
        {size === 'small' && <MainNav pin />}
      </Box>
    </Grid>
  );
};

export default Page;
