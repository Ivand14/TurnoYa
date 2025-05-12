
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';
import { mockUsers } from '@/data/mockData';
import { toast } from 'sonner';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string, role?: string) => Promise<User>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulamos obtener el usuario desde localstorage
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('currentUser');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    // Simulamos una validación de login con los datos mockUsers
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // En un caso real, validaríamos la contraseña, aquí solo validamos email
        const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (user) {
          setCurrentUser(user);
          localStorage.setItem('currentUser', JSON.stringify(user));
          resolve(user);
        } else {
          reject(new Error('Credenciales inválidas'));
        }
      }, 800);
    });
  };

  const register = async (name: string, email: string, password: string, role: string = 'customer'): Promise<User> => {
    // Simulamos un registro
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Verificar si el email ya existe
        const userExists = mockUsers.some(u => u.email.toLowerCase() === email.toLowerCase());
        if (userExists) {
          reject(new Error('El email ya está registrado'));
          return;
        }

        // Crear nuevo usuario (en un caso real se enviaría al servidor)
        const newUser: User = {
          id: `user-${Date.now()}`,
          name,
          email,
          role: role as 'admin' | 'business' | 'customer',
        };

        setCurrentUser(newUser);
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        resolve(newUser);
      }, 800);
    });
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    toast.success('Sesión cerrada correctamente');
  };

  const value = {
    currentUser,
    loading,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
