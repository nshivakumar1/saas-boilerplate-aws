import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CognitoUserPool, CognitoUser, AuthenticationDetails, CognitoUserAttribute } from 'amazon-cognito-identity-js';
import { config } from '../config';

const userPool = new CognitoUserPool({
    UserPoolId: config.cognito.userPoolId,
    ClientId: config.cognito.userPoolClientId
});

interface User {
    username: string;
    email?: string;
}

interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    signup: (email: string, password: string) => Promise<void>;
    confirmSignup: (email: string, code: string) => Promise<void>;
    logout: () => void;
    clearError: () => void;
    error: string | null;
}

const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    user: null,
    login: async () => { },
    signup: async () => { },
    confirmSignup: async () => { },
    logout: () => { },
    clearError: () => { },
    error: null,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState<string | null>(null);

    const clearError = () => setError(null);

    useEffect(() => {
        const currentUser = userPool.getCurrentUser();
        if (currentUser) {
            currentUser.getSession((err: any, session: any) => {
                if (err) {
                    setIsAuthenticated(false);
                    return;
                }
                if (session.isValid()) {
                    setIsAuthenticated(true);
                    setUser({ username: currentUser.getUsername() });
                }
            });
        }
    }, []);

    const signup = async (email: string, password: string) => {
        setError(null);
        return new Promise<void>((resolve, reject) => {
            const attributeList = [
                new CognitoUserAttribute({ Name: 'email', Value: email })
            ];

            userPool.signUp(email, password, attributeList, [], (err, _result) => {
                if (err) {
                    setError(err.message || JSON.stringify(err));
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    };

    const confirmSignup = async (email: string, code: string) => {
        setError(null);
        return new Promise<void>((resolve, reject) => {
            const cognitoUser = new CognitoUser({
                Username: email,
                Pool: userPool
            });

            cognitoUser.confirmRegistration(code, true, (err, _result) => {
                if (err) {
                    setError(err.message || JSON.stringify(err));
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    };

    const login = async (email: string, password: string) => {
        setError(null);
        return new Promise<void>((resolve, reject) => {
            const authDetails = new AuthenticationDetails({
                Username: email,
                Password: password
            });

            const cognitoUser = new CognitoUser({
                Username: email,
                Pool: userPool
            });

            cognitoUser.authenticateUser(authDetails, {
                onSuccess: (result) => {
                    setIsAuthenticated(true);
                    setUser({ username: email });
                    // Store token for API calls
                    localStorage.setItem('id_token', result.getIdToken().getJwtToken());
                    resolve();
                },
                onFailure: (err) => {
                    setError(err.message || JSON.stringify(err));
                    reject(err);
                },
                newPasswordRequired: (_userAttributes, _requiredAttributes) => {
                    // Handle new password required if needed, for now just fail or impl later
                    reject(new Error("New password required"));
                }
            });
        });
    };

    const logout = () => {
        const currentUser = userPool.getCurrentUser();
        if (currentUser) {
            currentUser.signOut();
        }
        localStorage.removeItem('id_token');
        setIsAuthenticated(false);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, signup, confirmSignup, logout, clearError, error }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
