# Sollet - A crypto wallet

- The aim of this wallet that makes crypto transactions as effortless and smooth as traditional payment methods. The vision is to encourage users to rely on this wallet for everyday purchases and financial activities, making cryptocurrency more accessible and practical for daily life.

- While many wallets share user data as a means to generate revenue, we believe there's a better way. Maintaining a wallet requires funding, but rather than compromising user privacy, this project proposes an alternative model. By incorporating non-intrusive ads within the wallet interface, we can generate the necessary revenue without selling user data. This ensures that users can enjoy a secure, privacy-focused wallet while still allowing the platform to remain financially viable.

- One more feature I would like to add is the Watcher feature, which will help traders monitor cryptocurrency flows effectively. With this feature, anyone can track the transactions of businesses, empowering traders to follow the movement of funds and stay ahead in the world of cryptocurrency.


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
  TransactionResponse,
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
import TransactionList from "./TransactionList ";

type NETWORK_URL = typeof DEVNET_URL | typeof MAINNET_URL;

if (!MAINNET_URL) {
  throw new Error("VITE_SOLANA_MAINNET_RPC_URL is required");
}

const WalletApp = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [wallets, setWallets] = useState<PublicKey[]>([]);
  const [network, setNetwork] = useState<NETWORK_URL>(DEVNET_URL);
  const [solAmounts, setSolAmounts] = useState<Map<string, number>>(new Map());
  const [trackAddress, setTrackAddress] = useState("");
  const [transactionHistory, setTransactionHistory] = useState<
    (TransactionResponse | null)[]
  >([]);

  const fetchBalances = async (wallet: PublicKey) => {
    if (wallet) {
      const connection = new Connection(network, "confirmed");
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
    <div className="min-h-screen w-full bg-zinc-900 p-6 flex flex-col">
      <div className="w-full rounded-xl shadow-md mb-6">
        <Header
          networkUrl={network}
          addNewWallet={addNewWallet}
          changeNetworkToTestnetOrMainnet={changeNetworkToTestnetOrMainnet}
          setTrackAddress={setTrackAddress}
          trackAddress={trackAddress}
          setTransactionHistory={setTransactionHistory}
        />
      </div>

      <div className="flex flex-col lg:flex-row w-full flex-1 gap-6">
        <div className="flex flex-col w-full lg:w-2/3">
          <WalletList
            wallets={wallets}
            solAmounts={solAmounts}
            copyAddress={copyAddress}
          />
        </div>

        <div className="h-auto lg:h-screen overflow-auto w-full lg:w-1/3 bg-zinc-800 p-4 rounded-lg shadow-lg flex flex-col justify-center items-center">
          {trackAddress ? (
            <TransactionList
              transactions={transactionHistory.filter(
                (transaction): transaction is TransactionResponse =>
                  transaction !== null
              )}
              isLoading={false}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-40 bg-zinc-700 rounded-md border border-dashed border-[#00f0ff] p-4 text-center">
              <p className="text-xl font-semibold text-[#00f0ff] mb-2">
                No Address Tracked
              </p>
              <p className="text-sm text-zinc-400">
                Start tracking an address to view transactions here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WalletApp;
