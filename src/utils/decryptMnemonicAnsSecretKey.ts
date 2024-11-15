import { PASSWORD_CIPHERTEXT } from "@/types/type";
import CryptoJS from "crypto-js";

const SECRET_KEY = import.meta.env.VITE_SECRET_KEY;

if (!SECRET_KEY) {
  throw new Error("VITE_SECRET_KEY is required");
}

export const decryptPassword = (ciphertextMnemonic: string) => {
  const bytes = CryptoJS.AES.decrypt(ciphertextMnemonic, SECRET_KEY);
  const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
  return decryptedData;
}


export const decryptSecretKey = (ciphertextSecretKey: string) => {
  try {
    const encryptedPassword = localStorage.getItem(PASSWORD_CIPHERTEXT);

    if (!encryptedPassword) {
      throw new Error("Password is not found");
    }

    const password = decryptPassword(encryptedPassword);
    
    if (!password) {
      throw new Error("Password is not found");
    }

    const bytes = CryptoJS.AES.decrypt(ciphertextSecretKey, password);
    const decryptedHexString = bytes.toString(CryptoJS.enc.Utf8);

    if (!decryptedHexString) {
      throw new Error("Decryption failed, result is empty.");
    }

    return decryptedHexString;
  } catch (error: unknown) {
    console.error("Error during decryption:", error);
    return null;
  }
};


export const decryptMnemonic = (ciphertextmnemonic: string) => {
  const bytes = CryptoJS.AES.decrypt(ciphertextmnemonic, SECRET_KEY);
  const mnemonic = bytes.toString(CryptoJS.enc.Utf8);
  return mnemonic;
};
