import { PASSWORD_CIPHERTEXT } from "@/types/type";
import CryptoJS from "crypto-js";
import { decryptPassword } from "./decryptMnemonicAnsSecretKey";

const SECRET_KEY = import.meta.env.VITE_SECRET_KEY;

if (!SECRET_KEY) {
  throw new Error("VITE_SECRET_KEY is required");
}

export const encryptPassword = (password: string) => {
  const encryptedData = CryptoJS.AES.encrypt(password, SECRET_KEY).toString();
  return encryptedData;
}

export const encryptSecretKey = (secretKey: string) => {
  try {
    const passwordCipher = localStorage.getItem(PASSWORD_CIPHERTEXT);

    if (!passwordCipher) {
      throw new Error("Password is required for encryption");
    }

    const password = decryptPassword(passwordCipher);

    if (!password) {
      throw new Error("Password is required for encryption");
    }
    const encryptData = CryptoJS.AES.encrypt(
      secretKey,
      password
    ).toString();
    return encryptData;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error during decryption:", error.message);
    } else {
      console.error("Error during decryption:", error);
    }
    return null;
  }
};

export const encryptMnemonic = (mnemonic: string) => {
  const encryptData = CryptoJS.AES.encrypt(mnemonic, SECRET_KEY).toString();
  return encryptData;
};
