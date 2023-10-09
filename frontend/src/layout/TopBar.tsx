import {
  AppBar,
} from "react-admin";
import { styled } from "@mui/system";
import logo from '../assets/logo.png';
import { Link } from "react-router-dom";

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  '&.MuiAppBar-root': {
    display: 'flex',
    minHeight: '64px',
    justififyContent: 'center',
    backgroundColor: theme.palette.mode === 'light' ? '#4CAF50' : '#006847', // verde claro para el tema claro y verde oscuro para el tema oscuro
  },
  '& .logoContainer': {
    flex: 1,
    display: 'flex',
    justifyContent: 'flex-start',
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
})) as typeof AppBar;

export const TopBar = () => {
  return (
    <StyledAppBar position="fixed">
      <div className="logoContainer">
        <Link to="/">
          <img src={logo} alt="Logo" className="h-16" />
        </Link>
      </div>
    </StyledAppBar>
  );
};

