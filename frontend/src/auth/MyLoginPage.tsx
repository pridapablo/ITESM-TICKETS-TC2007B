import * as React from 'react';
import { useState, FC, useCallback } from 'react';
import { useLogin, useNotify, SimpleForm, TextInput, Button } from 'react-admin';

interface LoginState {
    username: string;
    password: string;
}

const MyLoginPage: FC = () => {
    const [loginState, setLoginState] = useState<LoginState>({ username: '', password: '' });
    const login = useLogin();
    const notify = useNotify();

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.currentTarget;
        setLoginState(prevState => ({ ...prevState, [name]: value }));
    }, []);

    const handleSubmit = useCallback(() => {
        login(loginState).catch(() => notify('Error during login process'));
    }, [login, loginState, notify]);

    const containerStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100vw'
    };    

    const buttonStyle: React.CSSProperties = {
        marginTop: '1rem',
        width: '100%',
        display: 'flex',
        justifyContent: 'center'
    };

    return (
        <div style={containerStyle}>
            <SimpleForm onSubmit={handleSubmit} toolbar={false}>
                <TextInput
                    label="Username"
                    source="username"
                    value={loginState.username}
                    onChange={handleInputChange}
                    fullWidth
                />
                <TextInput
                    label="Password"
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
                        label="Login"
                    />
                </div>
            </SimpleForm>
        </div>
    );
};

export default MyLoginPage;
