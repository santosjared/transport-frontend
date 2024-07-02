// ** React Imports
import { ReactNode, ReactElement, useEffect } from 'react';

// ** Next Import
import { useRouter } from 'next/router';

// ** Hooks Import
import { useAuth } from 'src/hooks/useAuth';
import useEncryptedStorage from 'src/hooks/useCrypto';

interface AuthGuardProps {
  children: ReactNode;
  fallback: ReactElement | null;
}

const AuthGuard = (props: AuthGuardProps) => {
  const { children, fallback } = props;
  const auth = useAuth();
  const router = useRouter();
  const { getDecryptedItem } = useEncryptedStorage();

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    const storedUserData = getDecryptedItem('userData');

    if (auth.user === null && !storedUserData) {
      if (router.asPath !== '/') {
        router.replace({
          pathname: '/login',
          query: { returnUrl: router.asPath },
        });
      } else {
        router.replace('/login');
      }
    }
  }, [router.isReady, router.asPath, auth.user, getDecryptedItem, router]);

  if (auth.loading || auth.user === null) {
    return fallback;
  }

  return <>{children}</>;
};

export default AuthGuard;
