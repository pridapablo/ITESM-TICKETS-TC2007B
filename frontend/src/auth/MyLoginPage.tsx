import * as React from 'react';
import { useState, FC, useCallback, useRef } from 'react';
import { useLogin, useNotify, SimpleForm, TextInput, Button, ToggleThemeButton, useTranslate } from 'react-admin';
import { useTheme } from "@mui/material/styles";
import logo from '../assets/logo.png';
import { motion } from 'framer-motion';

interface LoginState {
    username: string;
    password: string;
}

const MyLoginPage: FC = () => {
    const [loginState, setLoginState] = useState<LoginState>({ username: '', password: '' });
    const [isUsername, setIsUsername] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const login = useLogin();
    const notify = useNotify();
    const theme = useTheme();
    const translate = useTranslate();
    const passwordInputRef = useRef<HTMLInputElement>(null);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.currentTarget;
        setLoginState(prevState => ({ ...prevState, [name]: value }));
        if (value !== '') {
            setIsUsername(true);
        } else {
            setIsUsername(false);
        }
    }, []);

    const handleUsernameBlur = () => {
        setShowPassword(true);
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Prevent the default form submission behavior
            if (!showPassword) {
                setShowPassword(true);
                if (passwordInputRef.current) {
                    passwordInputRef.current.focus();
                }
            } else {
                handleSubmit();
            }
        }
    };

    const handleSubmit = useCallback(async () => {
        try {
            if (showPassword) {
                const successMessage = await login(loginState);
                notify(successMessage);
            }
        } catch (error: any) {
            if (showPassword) {
                notify(error.message);
            }
        }
    }, [login, loginState, notify, showPassword]);

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

    const [randImage, setRandImage] = useState('')

    const imageArr = 
    ['https://images.unsplash.com/photo-1534312663388-244b6be22824?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2874&q=80','https://images.unsplash.com/photo-1512813389649-acb9131ced20?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80','https://images.unsplash.com/photo-1585464231875-d9ef1f5ad396?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80','https://images.unsplash.com/photo-1521216774850-01bc1c5fe0da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80', 'https://images.unsplash.com/photo-1547995886-6dc09384c6e6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2826&q=80']

    
    React.useEffect(() => {
        const rand = Math.floor(Math.random() * imageArr.length);
        setRandImage(imageArr[rand])
        console.log(imageArr[rand])
    }
    , [])

    return (
        <div className={`h-screen font-sans bg-cover`} style={{ backgroundImage: `url('${randImage}')` }}>
            <div className="container mx-auto h-full flex flex-1 justify-center items-center">
                <SimpleForm onSubmit={handleSubmit} toolbar={false}>
                    <div className="w-full max-w-lg ">
                        <div className="leading-loose">
                            <div className={`max-w-sm m-4 p-10 ${theme.palette.mode == 'dark'? 'bg-black': 'bg-white'} bg-opacity-80 rounded shadow-xl`}>
                                <img src={logo} alt="logo" className="h-24 mx-auto mb-4"/>
                                <p className="text-white text-center text-lg font-bold">Iniciar Sesion</p>
                                <div className="">
                                    <TextInput
                                        label={translate('login.username')}
                                        source="username"
                                        value={loginState.username}
                                        onChange={handleInputChange}
                                        onBlur={handleUsernameBlur}
                                        onKeyPress={handleKeyPress}
                                        fullWidth
                                    />
                                </div>
                                {showPassword ? (
                                    <motion.div 
                                        className="mt-2"
                                        animate={{
                                            y: [-10, 0],
                                            opacity: [0, 1],
                                        }}
                                    >
                                        <TextInput
                                            label={translate('login.password')}
                                            source="password"
                                            type="password"
                                            value={loginState.password}
                                            onChange={handleInputChange}
                                            onKeyPress={handleKeyPress}
                                            fullWidth
                                            inputRef={passwordInputRef}
                                            autoFocus // Automatically focus on the password input
                                        />
                                    </motion.div>
                                ) : (
                                    <></>
                                )}

                                <div className="mt-4 items-center flex justify-between">
                                    <Button
                                        type="submit"
                                        color="primary"
                                        variant="contained"
                                        label={translate('login.loginButton')}
                                        disabled={!showPassword}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </SimpleForm>
            </div>
        </div>
    );
};

export default MyLoginPage;
