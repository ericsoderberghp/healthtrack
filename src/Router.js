import React, { Children } from 'react';

export const RouterContext = React.createContext({});

export const Router = ({ children, initialPath }) => {
  const [path, setPath] = React.useState(initialPath);

  React.useEffect(() => {
    const onPopState = () => setPath(document.location.pathname);
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const push = (nextPath) => {
    if (nextPath !== path) {
      window.history.pushState(
        undefined,
        undefined,
        nextPath + window.location.search,
      );
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
  if (path === contextPath) return {};
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
export const Routes = ({ children, redirect }) => {
  const { path: contextPath, push } = React.useContext(RouterContext);
  let found;
  Children.forEach(children, (child) => {
    if (!found && pathMatch(child.props.path, contextPath)) found = child;
  });
  if (!found) push(redirect);
  return found;
};

export const Route = ({ Component, path }) => {
  const { path: contextPath } = React.useContext(RouterContext);

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
