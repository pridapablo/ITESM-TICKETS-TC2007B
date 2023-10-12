import * as React from 'react';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

type IndeterminateCheckboxProps = {
    setVisible1: React.Dispatch<React.SetStateAction<boolean>>;
    setVisible2: React.Dispatch<React.SetStateAction<boolean>>;
    setVisible3: React.Dispatch<React.SetStateAction<boolean>>;
    setVisible4: React.Dispatch<React.SetStateAction<boolean>>;
    setVisible5: React.Dispatch<React.SetStateAction<boolean>>;
    isVisible1?: boolean;
    isVisible2?: boolean;
    isVisible3?: boolean;
    isVisible4?: boolean;
    isVisible5?: boolean;
}

export default function IndeterminateCheckbox({setVisible1, setVisible2, setVisible3, setVisible4, setVisible5, isVisible1, isVisible2, isVisible3, isVisible4, isVisible5}: IndeterminateCheckboxProps) {
  const handleChange1 = () => {
    setVisible1(!isVisible1);
  };

  const handleChange2 = () => {
    setVisible2(!isVisible2);
  };

  const handleChange3 = () => {
    setVisible3(!isVisible3);
  };

  const handleChange4 = () => {
    setVisible4(!isVisible4);
  }

  const handleChange5 = () => {
    setVisible5(!isVisible5);
  }

  const children = (
    <Box sx={{ display: 'flex', flexDirection: 'column', ml: 3 }}>
    <FormControlLabel
        label="Categorias"
        labelPlacement="start" // Align the label to the right
        control={<Checkbox checked={isVisible1} onChange={handleChange1} />}
      />
      <FormControlLabel
        label="Semanal"
        labelPlacement="start" // Align the label to the right
        control={<Checkbox checked={isVisible2} onChange={handleChange2} />}
      />
      <FormControlLabel
        label="Aulas"
        labelPlacement="start" // Align the label to the right
        control={<Checkbox checked={isVisible3} onChange={handleChange3} />}
      />
      <FormControlLabel
        label="Invetario"
        labelPlacement="start" // Align the label to the right
        control={<Checkbox checked={isVisible4} onChange={handleChange4} />}
      />
      <FormControlLabel
        label="Tickets"
        labelPlacement="start" // Align the label to the right
        control={<Checkbox checked={isVisible5} onChange={handleChange5} />}
      />
    </Box>
  );

  return (
    <div className='shadow-md shadow-slate-500 p-4 rounded-xl justify-end w-30'>
      <FormControlLabel
        label="Todos"
        labelPlacement="start" // Align the label to the right
        control={
          <Checkbox
            checked={isVisible1 && isVisible2 && isVisible3}
            onChange={() => {
              setVisible1(true);
              setVisible2(true);
              setVisible3(true);
              setVisible4(true);
              setVisible5(true);
            }}
          />
        }
      />
      {children}
    </div>
  );
}
