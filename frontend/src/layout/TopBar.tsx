import React from 'react';
import { AppBar, AppBarProps } from 'react-admin';
import { styled } from '@mui/system';
import logo from '../assets/logo.png';
import { Link } from "react-router-dom";
import CustomUserMenu from "../auth/CustomUserMenu";

const LogoContainer = styled('div')(({ theme }) => ({
  flex: 1,
  display: 'flex',
  justifyContent: 'flex-start',
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(2),
}));

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'light' ? '#4CAF50' : '#006847', // verde claro para el tema claro y verde oscuro para el tema oscuro
}));

const TopBar = (props: AppBarProps) => {
  return (
    <StyledAppBar {...props} userMenu={<CustomUserMenu />}>
      <LogoContainer>
        <Link to="/">
          <img src={logo} alt="Logo" className="h-16" />
        </Link>
      </LogoContainer>
    </StyledAppBar>
  );
}

export default TopBar;
