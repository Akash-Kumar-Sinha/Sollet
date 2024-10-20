import { useEffect, useState } from "react";
import { derivePath } from "ed25519-hd-key";
import nacl from "tweetnacl";
import { mnemonicToSeed } from "bip39";
import bs58 from "bs58";
import {
  PublicKey,
  Keypair,
  Connection,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";

import { toast } from "sonner";

import Header from "../components/Header";

import {
  DEVNET_URL,
  MAINNET_URL,
  MEMONICS_PHRASE_CIPHERTEXT,
  SECRET_KEY_CIPHERTEXT,
} from "@/types/type";

import {
  decryptMnemonic,
  decryptSecretKey,
} from "@/utils/decryptMnemonicAnsSecretKey";

import { encryptSecretKey } from "@/utils/encryptMnemonicAndSecretKey";

import WalletList from "./WalletList";

type NETWORK_URL = typeof DEVNET_URL | typeof MAINNET_URL;

if (!MAINNET_URL) {
  throw new Error("VITE_SOLANA_MAINNET_RPC_URL is required");
}

const WalletApp = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [wallets, setWallets] = useState<PublicKey[]>([]);
  const [network, setNetwork] = useState<NETWORK_URL>(DEVNET_URL);
  const [solAmounts, setSolAmounts] = useState<Map<string, number>>(new Map());

  const fetchBalances = async (wallet: PublicKey) => {
    if (wallet) {
      const connection = new Connection(network, "confirmed");
      // for (const wallet of wallets) {
      const balance = await connection.getBalance(wallet);
      setSolAmounts((prev) =>
        new Map(prev).set(wallet.toBase58(), balance / LAMPORTS_PER_SOL)
      );
    }
  };

  const loadWalletsFromLocalStorage = async () => {
    const storedKeys = Object.keys(localStorage).filter((key) =>
      key.startsWith(SECRET_KEY_CIPHERTEXT)
    );

    if (storedKeys.length <= wallets.length) {
      return;
    }

    const loadedWallets: PublicKey[] = [];

    for (const storekey of storedKeys) {
      const encryptedSecretKeys = localStorage.getItem(storekey);

      if (!encryptedSecretKeys) {
        throw new Error("Encrypted secret keys not found");
      }

      const decryptedSecretKey = decryptSecretKey(encryptedSecretKeys);

      if (!decryptedSecretKey) {
        throw new Error("Failed to decrypt secret key");
      }
      const keypair = Keypair.fromSecretKey(bs58.decode(decryptedSecretKey));

      loadedWallets.push(keypair.publicKey);
      console.log("loadedWallets")
      fetchBalances(keypair.publicKey);
    }

    setWallets(loadedWallets);
  };

  useEffect(() => {
    const checkLocalStorage = async () => {
      const storedKeys = Object.keys(localStorage).filter((key) =>
        key.startsWith(SECRET_KEY_CIPHERTEXT)
      );

      if (storedKeys.length > wallets.length) {
        await loadWalletsFromLocalStorage();
      }
    };

    const intervalId = setInterval(checkLocalStorage, 5000);

    loadWalletsFromLocalStorage();

    return () => clearInterval(intervalId);
  }, [wallets]);

  const addNewWallet = async () => {
    const ciphertextmnemonic = localStorage.getItem(MEMONICS_PHRASE_CIPHERTEXT);
    if (ciphertextmnemonic) {
      try {
        const mnemonic = decryptMnemonic(ciphertextmnemonic);
        const seed = await mnemonicToSeed(mnemonic);
        const path = `m/44'/501'/${currentIndex}'/0'`;
        const derivedSeed = derivePath(path, seed.toString("hex")).key;
        const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
        const keypair = Keypair.fromSecretKey(secret);

        const secretKeyBase58 = bs58.encode(keypair.secretKey);

        const encryptedSecretKey = encryptSecretKey(secretKeyBase58);

        if (!encryptedSecretKey) {
          throw new Error("Failed to encrypt secret key");
        }

        const walletPublicKeyString = keypair.publicKey.toBase58();
        const existingKeys = localStorage.getItem(SECRET_KEY_CIPHERTEXT) || "";
        localStorage.setItem(
          `${SECRET_KEY_CIPHERTEXT}_${walletPublicKeyString}`,
          existingKeys
            ? existingKeys + "," + encryptedSecretKey
            : encryptedSecretKey
        );

        setCurrentIndex(currentIndex + 1);
        setWallets([...wallets, keypair.publicKey]);
        fetchBalances(keypair.publicKey);
      } catch (error) {
        console.error("Failed to add wallet:", error);
      }
    } else {
      console.log("No mnemonic found in local storage.");
    }
  };

  // Make teh function addNewWallet to create one wallet as the new user lands on this page
  useEffect(() => {
    addNewWallet();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const changeNetworkToTestnetOrMainnet = () => {
    const resetSolAmounts = new Map(
      wallets.map((wallet) => [wallet.toBase58(), 0])
    );
    setSolAmounts(resetSolAmounts);
    setNetwork((prev: NETWORK_URL) =>
      prev === DEVNET_URL ? MAINNET_URL : DEVNET_URL
    );
  };

  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    toast.success("Address copied to clipboard!");
  };

  return (
    <div className="h-full min-h-screen w-full bg-zinc-950 p-6">
      <Header
        networkUrl={network}
        addNewWallet={addNewWallet}
        changeNetworkToTestnetOrMainnet={changeNetworkToTestnetOrMainnet}
      />

      <WalletList
        wallets={wallets}
        solAmounts={solAmounts}
        copyAddress={copyAddress}
      />
    </div>
  );
};

export default WalletApp;
