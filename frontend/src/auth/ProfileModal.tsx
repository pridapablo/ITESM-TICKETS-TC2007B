// ProfileModal.tsx
import { FC, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from '@mui/material';
import { styled } from '@mui/system';
import { useNotify } from 'react-admin';

const StyledDialog = styled(Dialog)({
  '& .MuiDialog-paper': {
    borderRadius: '10px',
    padding: '12px',
    boxShadow: '0 4px 20px 0 rgba(0, 0, 0, 0.1)'
  }
});

const StyledDialogTitle = styled(DialogTitle)({
  textAlign: 'center',
  '& .MuiTypography-root': {
    fontSize: '24px',
    fontWeight: 500,
    color: '#333'
  }
});

const StyledDialogContent = styled(DialogContent)({
  '& .MuiFormControl-root': {
    marginTop: '15px',
    width: '360px',
  }
});

const StyledDialogActions = styled(DialogActions)({
  justifyContent: 'flex-end',
  '& .MuiButton-root': {
    width: '120px',
    borderRadius: '5px',
    boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.1)',
    '&:first-child': {
      marginRight: '10px'
    }
  }
});

const StyledTextField = styled(TextField)({
  '& .MuiInput-root': {
    borderRadius: '5px',
  }
});

interface ProfileModalProps {
  open: boolean;
  onClose: () => void;
}

const ProfileModal: FC<ProfileModalProps> = ({ open, onClose }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const notify = useNotify();

  const handleSave = () => {
    const userID = localStorage.getItem('userID'); // TODO: get userID directly from token in backend
    const dataToSend = {
      phone: phoneNumber,
      userID 
    };

    fetch(`${import.meta.env.VITE_JSON_SERVER_URL}/phone/confirm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataToSend),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
        notify('Número de teléfono guardado con éxito!', { type: 'success' });
        onClose();
      })
      .catch((error) => {
        notify('Error al guardar el número de teléfono.', { type: 'error' });
        console.error('Error:', error);
      });
  };

  return (
    <StyledDialog open={open} onClose={onClose}>
      <StyledDialogTitle>Editar número de teléfono</StyledDialogTitle>
      <StyledDialogContent>
        <StyledTextField
          fullWidth
          variant="outlined"
          label="Número de teléfono"
          value={phoneNumber}
          onChange={e => setPhoneNumber(e.target.value)}
        />
      </StyledDialogContent>
      <StyledDialogActions>
        <Button onClick={onClose} color="primary">
          Cancelar
        </Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Guardar
        </Button>
      </StyledDialogActions>
    </StyledDialog>
  );
};

export default ProfileModal;