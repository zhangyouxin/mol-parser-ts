import React from 'react';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import TextareaAutosize from '@mui/material/TextareaAutosize';

const Label = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.h5,
  padding: theme.spacing(1),
  textAlign: 'center',
  marginLeft: '20%',
  marginRight: '20%',
  color: theme.palette.text.secondary,
}));
const InputArea = styled(TextareaAutosize)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body1,
  marginTop: '1rem',
  marginLeft: '20%',
  marginRight: '20%',
  width: '60%',
  color: theme.palette.text.secondary,
}));

export const DataInput: React.FC = () => {
  return (
    <div>
      <Label>please input your data here:</Label>
      <br></br>
      <InputArea
        minRows={3}
        maxRows={10}
        placeholder="Input data here."
      />
      <br></br>
      <Button variant="contained" style={{ margin: 'auto', display: 'block' }}>Decode!</Button>  
    </div>
  );
}


