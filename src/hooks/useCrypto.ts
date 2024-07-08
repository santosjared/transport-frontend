import { useCallback } from 'react';
import * as CryptoJS from 'crypto-js';

const secretKey = 'your-secret-key'; // Debe almacenarse de forma segura

const useEncryptedStorage = () => {
  const encrypt = useCallback((text: string): string => {
    try {
      return CryptoJS.AES.encrypt(text, secretKey).toString();
    } catch (error) {
      console.error('Encryption failed:', error);
      throw error;
    }
  }, []);

  const decrypt = useCallback((encryptedText: string): string => {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedText, secretKey);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error('Decryption failed:', error);
      throw error;
    }
  }, []);

  const setEncryptedItem = useCallback((key: string, value: string): void => {
    try {
      localStorage.setItem(key, encrypt(value));
    } catch (error) {
      console.error('Setting encrypted item failed:', error);
    }
  }, [encrypt]);

  const getDecryptedItem = useCallback((key: string): string | null => {
    try {
      const data = localStorage.getItem(key);
      return data ? decrypt(data) : null;
    } catch (error) {
      console.error('Getting decrypted item failed:', error);
      return null;
    }
  }, [decrypt]);

  return { setEncryptedItem, getDecryptedItem };
};

export default useEncryptedStorage;
