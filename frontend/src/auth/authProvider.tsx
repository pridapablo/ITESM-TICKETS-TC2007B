import { AuthProvider } from "react-admin";


export const authProvider: AuthProvider = {
    // called when the user attempts to log in
    login: async ({ username, password }) => {
        try {
            const response = await fetch('http://localhost:8000/user/auth', {
                method: 'POST',
                headers: new Headers({ 'Content-Type': 'application/json' }),
                body: JSON.stringify({
                    username,
                    pwdHash: password,
                }),
            });

            if (response.status < 200 || response.status >= 300) {
                throw new Error(response.statusText);
            }
            
            const token = response.headers.get('Authorization');
            if (!token) {
                throw new Error('No token found');
            }

            localStorage.setItem('auth', token);


            const data = await response.json();

            const userID = data.userID;

            console.log(userID);

            localStorage.setItem('userID', userID);
          
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
            localStorage.removeItem("auth");
            return Promise.reject();
        }
        return Promise.resolve();
    },
    // called when the user navigates to a new location, to check for authentication
    checkAuth: () => {
        return localStorage.getItem("auth")
            ? Promise.resolve()
            : Promise.reject();
    },
    // called when the user navigates to a new location, to check for permissions / roles
    getPermissions: () => Promise.resolve(),
};