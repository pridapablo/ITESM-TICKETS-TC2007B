import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import MyLoginPage from "../auth/MyLoginPage";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";

jest.mock("react-admin", () => ({
  ...jest.requireActual("react-admin"),
  useLogin: jest.fn(),
  useNotify: jest.fn(),
  SimpleForm: jest.fn((props) => (
    <form onSubmit={props.onSubmit}>{props.children}</form>
  )),
  Button: jest.fn(),
  ToggleThemeButton: jest.fn(),
  useTranslate: () => (key: string) => key,
  TextInput: jest.fn((props) => (
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

describe("MyLoginPage", () => {
  it("renders without crashing", () => {
    render(
      <BrowserRouter>
        <MyLoginPage />
      </BrowserRouter>
    );
  });

  it("updates username on input change", async () => {
    const { getByLabelText } = render(<MyLoginPage />);

    const usernameInput = getByLabelText(/login.username/i);

    // Activa el campo de password
    // fireEvent.blur(usernameInput);

    // const passwordInput = await findByLabelText(/login.password/i);

    fireEvent.change(usernameInput, { target: { value: "testUser" } });
    // fireEvent.change(passwordInput, { target: { value: "testPassword" } });

    expect(usernameInput).toHaveValue("testUser");
    // expect(passwordInput).toHaveValue("testPassword");
  });
});
