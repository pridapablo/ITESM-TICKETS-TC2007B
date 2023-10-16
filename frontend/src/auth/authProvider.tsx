import { AuthProvider } from "react-admin";


export const authProvider: AuthProvider = {
    // called when the user attempts to log in
    login: async ({ username, password }) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_JSON_SERVER_URL}/user/auth`, {
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
            const { userID, role } = data;
            
            if (!role || !userID) {
                throw new Error('Role or userID not found, please contact the administrator');
            }

            localStorage.setItem('userID', userID);
            localStorage.setItem('role', role); 
          
            return data.message;  

        } catch (error: any) {
            throw new Error(error.message);  // Aquí arrojamos el mensaje de error
        }
    },
    // called when the user clicks on the logout button
    logout: () => {
        localStorage.removeItem("auth");
        localStorage.removeItem("userID");
        localStorage.removeItem("role");
        return Promise.resolve();
    },
    // called when the API returns an error
    checkError: ({ status }: { status: number }) => {
        if (status === 401 || status === 403) {
            localStorage.removeItem("auth");
            localStorage.removeItem("userID");
            localStorage.removeItem("role");
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