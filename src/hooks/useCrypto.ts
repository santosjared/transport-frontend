import { useCallback } from 'react';
import * as CryptoJS from 'crypto-js';

const secretKey = 'your-secret-key'; // Debe almacenarse de forma segura

const useEncryptedStorage = () => {
  const encrypt = useCallback((text: string): string => {
    return CryptoJS.AES.encrypt(text, secretKey).toString();
  }, []);

  const decrypt = useCallback((encryptedText: string): string => {
    const bytes = CryptoJS.AES.decrypt(encryptedText, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }, []);

  const setEncryptedItem = useCallback((key: string, value: string): void => {
    localStorage.setItem(key, encrypt(value));
  }, [encrypt]);

  const getDecryptedItem = useCallback((key: string): string | null => {
    const data = localStorage.getItem(key);
    return data ? decrypt(data) : null;
  }, [decrypt]);

  return { setEncryptedItem, getDecryptedItem };
};

export default useEncryptedStorage;
