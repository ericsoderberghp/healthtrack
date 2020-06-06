import React, { useContext } from 'react';
import { Button } from 'grommet';
import { RouterContext } from './Router';

const RoutedButton = ({ onClick, path, ...rest }) => {
  const { path: contextPath, push } = useContext(RouterContext);
  return (
    <Button
      active={path === contextPath}
      onClick={(event) => {
        if (onClick) onClick(event);
        push(path);
      }}
      {...rest}
    />
  );
};

export default RoutedButton;
