import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useState } from 'react';

export default function BasicTextFields(props) {
    const [number, setNumber] = useState(0);
    const handleSubmit = (event) => {
        event.preventDefault();
        props.setNumberofData(number)
      }
    
  return (
    <Box
      component="form"
      sx={{
        '& > :not(style)': { m: 1, width: '25ch' },
      }}
      noValidate
      autoComplete="off"
    >
      <TextField id="outlined-basic" label="No of Data" variant="outlined" value={number} onChange={(e) => setNumber(e.target.value)}  />
      <Button variant="contained" className='mt-3' type='submit'  onClick={handleSubmit}>Generate Data</Button>
    </Box>
  );
}
