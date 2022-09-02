import * as React from 'react';
import { styled } from '@mui/material/styles';
import LinearProgress, { linearProgressClasses,LinearProgressProps } from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import {tema} from '../coresStyled'


const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: tema === 'light' ? '#1a90ff' : '#6F6BF2',
  },
}));

function LinearProgressWithLabel(props: LinearProgressProps & { value: number }) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ width: '100%', mr: 1 }}>
          <BorderLinearProgress variant="determinate" {...props} />
        </Box>
        <Box sx={{ minWidth: 35 }}>
          <Typography variant="body2" color={tema === 'light' ? "#000" : "#fff"}>{`${Math.round(
            props.value,
          )}%`}</Typography>
        </Box>
      </Box>
    );
  }
export function LinearProgressBar({value}) {
  return (
    <Box sx={{ width: '100%' }}>
    <LinearProgressWithLabel value={value} />
  </Box>

  );
}