import { createContext, useContext, useState, ReactNode } from 'react';

// Mock Auth - just generating a random user ID or static one
interface AuthContextType {
    userId: string;
    isAdmin: boolean;
    loginAsAdmin: () => void;
    loginAsUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [userId, setUserId] = useState('user-' + Math.random().toString(36).substr(2, 9));
    const [isAdmin, setIsAdmin] = useState(false);

    const loginAsAdmin = () => setIsAdmin(true);
    const loginAsUser = () => setIsAdmin(false);

    return (
        <AuthContext.Provider value={{ userId, isAdmin, loginAsAdmin, loginAsUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};
