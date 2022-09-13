import React from 'react';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';

const Heading = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.h3,
  padding: theme.spacing(1),
  textAlign: 'center',
  marginTop: '2rem',
  color: theme.palette.text.secondary,
}));

export const Header: React.FC = () => {
  return (
    <div>
      <Heading> Molecule Online Decoder </Heading>
    </div>
  );
}


