import * as React from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import TodayIcon from '@mui/icons-material/Today';
import DateRangeIcon from '@mui/icons-material/DateRange';

export default function ToggleButtonDashboard(props: any) {
  const [alignment, setAlignment] = React.useState<string | null>('left');

  

  const handleAlignment = (event: React.MouseEvent<HTMLElement>, newAlignment: string | null) => {
    if (newAlignment !== null) {
      setAlignment(newAlignment);
      if (newAlignment === 'left') {
        props.handleClick1();
      } else {
        props.handleClick2();
      }
    }
  };

  return (
    <ToggleButtonGroup
      value={alignment}
      exclusive
      onChange={handleAlignment}
      aria-label="text alignment"
    >
      <ToggleButton value="left" aria-label='Card'>
        <TodayIcon />
      </ToggleButton>
      <ToggleButton value="center" aria-label='List'>
        <DateRangeIcon />
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
