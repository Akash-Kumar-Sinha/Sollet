import * as bip39 from "bip39";

import { MEMONICS_PHRASE_CIPHERTEXT } from "../types/type";
import {encryptMnemonic} from "./encryptMnemonicAndSecretKey";

export interface Wallet {
  mnemonic: string;
}

const SECRET_KEY = import.meta.env.VITE_SECRET_KEY;

if (!SECRET_KEY) {
  throw new Error("VITE_SECRET_KEY is required");
}

export const generateMnemonicPhrase = async (): Promise<Wallet> => {
  const mnemonic = bip39.generateMnemonic();
  const ciphertext_encrypt_sollet = encryptMnemonic(mnemonic);

  localStorage.setItem(MEMONICS_PHRASE_CIPHERTEXT, ciphertext_encrypt_sollet);
  return { mnemonic };
};
