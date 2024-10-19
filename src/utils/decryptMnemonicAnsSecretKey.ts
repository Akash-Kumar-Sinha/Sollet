import { PASSWORD_CIPHERTEXT } from "@/types/type";
import CryptoJS from "crypto-js";

const SECRET_KEY = import.meta.env.VITE_SECRET_KEY;

if (!SECRET_KEY) {
  throw new Error("VITE_SECRET_KEY is required");
}

export const decryptSecretKey = (
  ciphertextSecretKey: string
) => {
  try {
    const password = localStorage.getItem(PASSWORD_CIPHERTEXT);

    if (!password) {
      throw new Error("Password is not found");
    }
    const bytes = CryptoJS.AES.decrypt(ciphertextSecretKey, password);
    const decryptedHexString = bytes.toString(CryptoJS.enc.Utf8);

    // const hexToUint8Array = (hex: string): Uint8Array => {
    //   const byteArray = new Uint8Array(hex.length / 2);
    //   for (let i = 0; i < hex.length; i += 2) {
    //     byteArray[i / 2] = parseInt(hex.substr(i, 2), 16);
    //   }
    //   return byteArray;
    // };

    // const secretKeyArray = hexToUint8Array(decryptedHexString);

    return decryptedHexString;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error during decryption:", error.message);
    } else {
      console.error("Error during decryption:", error);
    }
    return null;
  }
};

export const decryptMnemonic = (ciphertextmnemonic: string) => {
  const bytes = CryptoJS.AES.decrypt(ciphertextmnemonic, SECRET_KEY);
  const mnemonic = bytes.toString(CryptoJS.enc.Utf8);
  return mnemonic;
};
