import React from 'react';
import { Box } from 'grommet';

const Loading = () => {
  return (
    <Box fill align="center" justify="center" background="background-back">
      <Box
        background="background-front"
        pad="large"
        round
        align="center"
        animation="pulse"
      />
    </Box>
  );
};

export default Loading;
