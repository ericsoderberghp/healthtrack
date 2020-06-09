import React, {
  Children,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

export const RouterContext = createContext({});

export const Router = ({ children, path: pathArg }) => {
  const [path, setPath] = useState(pathArg);

  // use the supplied path whenever it changes
  useEffect(() => {
    if (pathArg !== window.location.pathname)
      window.history.pushState(undefined, undefined, pathArg);
    setPath(pathArg);
  }, [pathArg]);

  // track with the user interacting with the browser's back and
  // forward controls
  useEffect(() => {
    const onPopState = () => setPath(window.location.pathname);
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const push = (nextPath) => {
    if (nextPath !== path) {
      window.history.pushState(undefined, undefined, nextPath);
      setPath(nextPath);
      window.scrollTo(0, 0);
    }
  };

  return (
    <RouterContext.Provider value={{ path, push }}>
      {children}
    </RouterContext.Provider>
  );
};

const pathMatch = (path, contextPath) => {
  if (path === contextPath || path === '*') return {};
  // check for something like /categories/:id
  const contextParts = contextPath.split('/');
  const pathParts = path.split('/');
  if (contextParts.length === pathParts.length) {
    const props = {};
    let match = true;
    for (let i = 0; i < pathParts.length; i += 1) {
      if (pathParts[i][0] === ':')
        props[pathParts[i].slice(1)] = contextParts[i];
      else if (contextParts[i] !== pathParts[i]) match = false;
    }
    if (match) return props;
  }
  return undefined;
};

// only renders at most one child
export const Routes = ({ children }) => {
  const { path: contextPath } = useContext(RouterContext);
  let found;
  Children.forEach(children, (child) => {
    if (!found && pathMatch(child.props.path, contextPath)) found = child;
  });
  return found;
};

export const Route = ({ Component, path }) => {
  const { path: contextPath } = useContext(RouterContext);

  if (contextPath === path) return <Component />;

  // check for something like /categories/:id
  const contextParts = contextPath.split('/');
  const pathParts = path.split('/');
  if (contextParts.length === pathParts.length) {
    const props = {};
    let match = true;
    for (let i = 0; i < pathParts.length; i += 1) {
      if (pathParts[i][0] === ':')
        props[pathParts[i].slice(1)] = contextParts[i];
      else if (contextParts[i] !== pathParts[i]) match = false;
    }
    if (match) return <Component {...props} />;
  }

  return null;
};

export default Router;
