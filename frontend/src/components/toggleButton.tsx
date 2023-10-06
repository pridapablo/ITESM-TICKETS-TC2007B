import * as React from 'react';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import DnsIcon from '@mui/icons-material/Dns';

export default function ToggleButtons(props: any) {
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
        <DnsIcon />
      </ToggleButton>
      <ToggleButton value="center" aria-label='List'>
        <FormatListBulletedIcon />
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
