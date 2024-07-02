import { createContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import authConfig from 'src/configs/auth';
import useEncryptedStorage from 'src/hooks/useCrypto';
import { AuthValuesType, RegisterParams, LoginParams, ErrCallbackType, UserDataType } from './types';

const defaultProvider: AuthValuesType = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  register: () => Promise.resolve()
};

const AuthContext = createContext(defaultProvider);

type Props = {
  children: ReactNode;
};

const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<UserDataType | null>(defaultProvider.user);
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading);
  const router = useRouter();
  const { getDecryptedItem, setEncryptedItem } = useEncryptedStorage();

  useEffect(() => {
    const initAuth = async (): Promise<void> => {
      const storedToken = getDecryptedItem(authConfig.storageTokenKeyName);
      if (storedToken) {
        setLoading(true);
        await axios
          .get(authConfig.meEndpoint, {
            headers: {
              Authorization: storedToken
            }
          })
          .then(async (response) => {
            setLoading(false);
            setUser({ ...response.data });
          })
          .catch(() => {
            localStorage.removeItem('userData');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('accessToken');
            setUser(null);
            setLoading(false);
            if (authConfig.onTokenExpiration === 'logout' && !router.pathname.includes('login')) {
              router.replace('/login');
            }
          });
      } else {
        setLoading(false);
      }
    };

    initAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogin = (params: LoginParams, errorCallback?: ErrCallbackType) => {
    axios
      .post(authConfig.loginEndpoint, params)
      .then(async (response) => {
        const token = response.data.token;

        // Encriptar el token antes de almacenarlo en localStorage
        setEncryptedItem(authConfig.storageTokenKeyName, token);

        // Decodificar y manejar datos de usuario
        const decode: any = await axios
        .get(authConfig.meEndpoint, {
          headers: {
            Authorization: token
          }
        })
        const userData = {
          id: decode.data.id,
          name: decode.data.name,
          lastName: decode.data.lastName,
          rol: decode.data.rol || 'client' // Si no hay rol en el token, se asigna 'client' por defecto
        };

        setUser(userData);

        // Almacenar datos de usuario encriptados en localStorage
        params.rememberMe ? setEncryptedItem('userData', JSON.stringify(userData)) : null;

        const returnUrl = router.query.returnUrl;
        const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/';

        router.replace(redirectURL as string);
      })
      .catch((err) => {
        if (errorCallback) errorCallback(err);
      });
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('userData');
    localStorage.removeItem(authConfig.storageTokenKeyName);
    router.push('/login');
  };

  const handleRegister = (params: RegisterParams, errorCallback?: ErrCallbackType) => {
    axios
      .post(authConfig.registerEndpoint, params)
      .then((res) => {
        if (res.data.error) {
          if (errorCallback) errorCallback(res.data.error);
        } else {
          handleLogin({ email: params.email, password: params.password });
        }
      })
      .catch((err: { [key: string]: string }) => (errorCallback ? errorCallback(err) : null));
  };

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    login: handleLogin,
    logout: handleLogout,
    register: handleRegister
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };
