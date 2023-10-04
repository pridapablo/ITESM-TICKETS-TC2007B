import * as React from 'react';
import { useState, FC, useCallback } from 'react';
import { useLogin, useNotify, SimpleForm, TextInput, Button, ToggleThemeButton, useTranslate } from 'react-admin';
import { useTheme } from "@mui/material/styles";
import logo from '../assets/logo.png';

interface LoginState {
    username: string;
    password: string;
}

const MyLoginPage: FC = () => {
    const [loginState, setLoginState] = useState<LoginState>({ username: '', password: '' });
    const login = useLogin();
    const notify = useNotify();
    const theme = useTheme();
    const translate = useTranslate();

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.currentTarget;
        setLoginState(prevState => ({ ...prevState, [name]: value }));
    }, []);

    const handleSubmit = useCallback(async () => {
        try {
            const successMessage = await login(loginState);
            notify(successMessage);
        } catch (error: any) {
            notify(error.message);
        }
    }, [login, loginState, notify]);

    const containerStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100vw',
        backgroundColor: theme.palette.mode === "dark" ? "#333" : "#FFF",
    };

    const buttonStyle: React.CSSProperties = {
        marginTop: '1rem',
        width: '100%',
        display: 'flex',
        justifyContent: 'center'
    };

    const topRightStyle: React.CSSProperties = {
        position: 'absolute',
        top: '1rem',
        right: '1rem',
    };

    const logoStyle: React.CSSProperties = theme.palette.mode === "light" ? {
        maxWidth: '100%',
        maxHeight: '100%',
        display: 'block',
        filter: 'brightness(0.0)'
    } : {
        maxWidth: '100%',
        maxHeight: '100%',
        display: 'block'
    };

    const logoContainerStyle: React.CSSProperties = {
        position: 'relative',
        width: '150px',
        height: '150px', // Asegúrate de que este valor sea el mismo que el alto de tu logo.
        marginBottom: '2rem',
        overflow: 'hidden' // Esto es para asegurarte de que el pseudo-elemento no se desborde.
    };

    return (
        <div style={containerStyle}>
            <div style={logoContainerStyle}>
                <img src={logo} alt="logo" style={logoStyle} />
            </div>
            <SimpleForm onSubmit={handleSubmit} toolbar={false}>
                <TextInput
                    label={translate('login.username')}
                    source="username"
                    value={loginState.username}
                    onChange={handleInputChange}
                    fullWidth
                />
                <TextInput
                    label={translate('login.password')}
                    source="password"
                    type="password"
                    value={loginState.password}
                    onChange={handleInputChange}
                    fullWidth
                />
                <div style={buttonStyle}>
                    <Button
                        type="submit"
                        color="primary"
                        variant="contained"
                        label={translate('login.loginButton')}
                    />
                </div>
            </SimpleForm>
        </div>
    );
};

export default MyLoginPage;
