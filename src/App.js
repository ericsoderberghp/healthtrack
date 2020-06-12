import { Grommet } from 'grommet';
import React, { useEffect, useState } from 'react';
import { Loading } from './components';
import Onboard from './Onboard';
import SignIn from './SignIn';
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
import TrackContext from './TrackContext';
import theme from './theme';
import { useTrack } from './track';

const App = () => {
  const [themeMode, setThemeMode] = useState();
  // align the themeMode with the browser/OS setting
  useEffect(() => {
    if (window.matchMedia) {
      setThemeMode(
        window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light',
      );
    }
  }, []);

  const [track, setTrack] = useTrack();

  const [nextPath, setNextPath] = useState();
  useEffect(() => {
    if (!nextPath && track !== undefined) {
      // initial load has finished, decide where to go
      if (track) setNextPath(window.location.pathname || '/');
      else if (track === false) setNextPath('/onboard');
    } else if (nextPath !== '/onboard' && track === false) {
      setNextPath('/onboard');
    } else if (nextPath === '/onboard' && track) {
      setNextPath('/');
    }
  }, [nextPath, track]);

  if (!nextPath) return <Loading />;

  return (
    <Router path={nextPath}>
      <Grommet
        theme={theme}
        themeMode={themeMode}
        style={{ minHeight: '100%' }}
      >
        <TrackContext.Provider value={[track, setTrack]}>
          <Routes redirect="/">
            <Route path="/onboard" Component={Onboard} />
            <Route path="/sign-in" Component={SignIn} />
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
        </TrackContext.Provider>
      </Grommet>
    </Router>
  );
};

export default App;
