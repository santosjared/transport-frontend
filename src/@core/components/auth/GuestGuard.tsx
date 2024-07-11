// ** React Imports
import { ReactNode, ReactElement, useEffect } from 'react';

// ** Next Import
import { useRouter } from 'next/router';

// ** Hooks Import
import { useAuth } from 'src/hooks/useAuth';
import { getDecryptedItem } from 'src/utils/crypto';

interface GuestGuardProps {
  children: ReactNode;
  fallback: ReactElement | null;
}

const GuestGuard = (props: GuestGuardProps) => {
  const { children, fallback } = props;
  const auth = useAuth();
  const router = useRouter();
  // const { getDecryptedItem } = useEncryptedStorage();

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    const storedUserData = getDecryptedItem('userData');

    if (storedUserData) {
      router.replace('/');
    }
  }, [router.isReady, router, getDecryptedItem]);

  if (auth.loading || (!auth.loading && auth.user !== null)) {
    return fallback;
  }

  return <>{children}</>;
};

export default GuestGuard;
