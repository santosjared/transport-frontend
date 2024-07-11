// encryptedStorage.ts
import * as CryptoJS from 'crypto-js';
import getConfig from 'src/configs/environment'

const secretKey = getConfig().keyAes

export const encrypt = (text: string): string => {
  try {
    return CryptoJS.AES.encrypt(text, secretKey).toString();
  } catch (error) {
    // console.error('Encryption failed:', error);
    throw error;
  }
};

export const decrypt = (encryptedText: string): string => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedText, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    // console.error('Decryption failed:', error);
    throw error;
  }
};

export const setEncryptedItem = (key: string, value: string): void => {
  try {
    localStorage.setItem(key, encrypt(value));
  } catch (error) {
    // console.error('Setting encrypted item failed:', error);
  }
};

export const getDecryptedItem = (key: string): string | null => {
  try {
    const data = localStorage.getItem(key);
    return data ? decrypt(data) : null;
  } catch (error) {
    // console.error('Getting decrypted item failed:', error);
    return null;
  }
};
