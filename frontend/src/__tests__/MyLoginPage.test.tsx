import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MyLoginPage from '../auth/MyLoginPage';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import { waitFor } from '@testing-library/react';

jest.mock('react-admin', () => ({
    ...jest.requireActual('react-admin'),
    useLogin: jest.fn(),
    useNotify: jest.fn(),
    SimpleForm: jest.fn(props => <form onSubmit={props.onSubmit}>{props.children}</form>),
    Button: jest.fn(),
    ToggleThemeButton: jest.fn(),
    useTranslate: () => (key: string) => key,
    TextInput: jest.fn(props => (
        <div>
            <label htmlFor={props.source}>{props.label}</label>
            <input
                type={props.type || "text"}
                value={props.value}
                onChange={props.onChange}
                placeholder={props.label}
                name={props.source}
                id={props.source}
            />
        </div>
    )),
}));

describe('MyLoginPage', () => {
    it('renders without crashing', () => {
        render(
            <BrowserRouter>
                <MyLoginPage />
            </BrowserRouter>
        );
    });

    it('updates username and password on input change', () => {
        render(<MyLoginPage />);

        const usernameInput = screen.getByLabelText(/login.username/i);
        const passwordInput = screen.getByLabelText(/login.password/i);

        fireEvent.change(usernameInput, { target: { value: 'testUser' } });
        fireEvent.change(passwordInput, { target: { value: 'testPassword' } });

        expect(usernameInput).toHaveValue('testUser');
        expect(passwordInput).toHaveValue('testPassword');
    });
});
