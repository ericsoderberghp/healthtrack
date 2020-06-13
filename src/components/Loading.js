import React from 'react';
import { Box } from 'grommet';
import { Test } from 'grommet-icons';

const Loading = () => {
  return (
    <Box fill align="center" justify="center" background="background-back">
      <Box
        background="background-front"
        pad="large"
        round
        align="center"
        animation="pulse"
      >
        <Test size="large" color="text-weak" />
      </Box>
    </Box>
  );
};

export default Loading;
