import * as React from 'react';
import { useState, FC, useCallback } from 'react';
import { useLogin, useNotify, SimpleForm, TextInput, Button, ToggleThemeButton, useTranslate } from 'react-admin';
import { useTheme } from "@mui/material/styles";

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

    return (
        <div style={containerStyle}>
            <ToggleThemeButton />
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
