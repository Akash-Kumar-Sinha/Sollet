import * as bip39 from "bip39";

export interface Wallet {
  mnemonic: string;
}

export const generateWallet = async (): Promise<Wallet> => {
  const mnemonic = bip39.generateMnemonic();
  localStorage.setItem("mnemonic", mnemonic);
  return { mnemonic };
};
