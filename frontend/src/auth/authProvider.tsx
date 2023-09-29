import { AuthProvider } from "react-admin";

export const authProvider: AuthProvider = {
    // called when the user attempts to log in
    login: async ({ username, password }) => {
        try {
            const response = await fetch('http://localhost:8000/user/auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    pwdHash: password,
                }),
            });

            const data = await response.json();

            if (!response.ok || data.message === "Usuario o password incorrecto") {
                // Si la respuesta no es correcta o si el mensaje indica un error, lanzamos una excepción
                throw new Error(data.message);
            }

            localStorage.setItem("username", username);
            return data.message;  // Devolvemos el mensaje "bien"

        } catch (error: any) {
            throw new Error(error.message);  // Aquí arrojamos el mensaje de error
        }
    },
    // called when the user clicks on the logout button
    logout: () => {
        localStorage.removeItem("username");
        return Promise.resolve();
    },
    // called when the API returns an error
    checkError: ({ status }: { status: number }) => {
        if (status === 401 || status === 403) {
            localStorage.removeItem("username");
            return Promise.reject();
        }
        return Promise.resolve();
    },
    // called when the user navigates to a new location, to check for authentication
    checkAuth: () => {
        return localStorage.getItem("username")
            ? Promise.resolve()
            : Promise.reject();
    },
    // called when the user navigates to a new location, to check for permissions / roles
    getPermissions: () => Promise.resolve(),
};