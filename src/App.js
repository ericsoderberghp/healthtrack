import { Grommet } from 'grommet';
import React, { useEffect, useState } from 'react';
import Loading from './Loading';
import Onboard from './Onboard';
import Home from './Home';
import Categories from './Categories';
import CategoryAdd from './CategoryAdd';
import CategoryEdit from './CategoryEdit';
import Data from './Data';
import DataAdd from './DataAdd';
import DataEdit from './DataEdit';
import Correlate from './Correlate';
import NoteAdd from './NoteAdd';
import NoteEdit from './NoteEdit';
import Notes from './Notes';
import Router, { Route, Routes } from './Router';
import theme from './theme';
import { useTrack } from './track';

const App = () => {
  const [themeMode, setThemeMode] = useState();
  useEffect(() => {
    if (window.matchMedia) {
      setThemeMode(
        window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light',
      );
    }
  }, []);
  const [initialPath, setInitialPath] = useState();
  const [track] = useTrack();
  useEffect(() => {
    if (!initialPath && track !== undefined) {
      if (track) setInitialPath(window.location.pathname);
      else if (track === false) setInitialPath('/onboard');
    }
  }, [initialPath, track]);

  if (!initialPath) return <Loading />;

  return (
    <Router initialPath={initialPath}>
      <Grommet theme={theme} themeMode={themeMode} style={{ height: '100%' }}>
        <Routes redirect="/">
          <Route path="/onboard" Component={Onboard} />
          <Route path="/" Component={Home} />
          <Route path="/categories" Component={Categories} />
          <Route path="/categories/add" Component={CategoryAdd} />
          <Route path="/categories/:id" Component={CategoryEdit} />
          <Route path="/data" Component={Data} />
          <Route path="/data/add" Component={DataAdd} />
          <Route path="/data/:id" Component={DataEdit} />
          <Route path="/correlate" Component={Correlate} />
          <Route path="/notes" Component={Notes} />
          <Route path="/notes/add" Component={NoteAdd} />
          <Route path="/notes/:id" Component={NoteEdit} />
        </Routes>
      </Grommet>
    </Router>
  );
};

export default App;
