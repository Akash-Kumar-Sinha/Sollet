import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { derivePath } from "ed25519-hd-key";
import nacl from "tweetnacl";
import { mnemonicToSeed } from "bip39";
import { BsCopy } from "react-icons/bs";
import {
  PublicKey,
  Keypair,
  Connection,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";

import { toast } from "sonner";
import Header from "../components/Header";

const DEVNET_URL = import.meta.env.VITE_SOLANA_DEVNET_RPC_URL;
const MAINNET_URL = import.meta.env.VITE_SOLANA_MAINNET_RPC_URL;

type NETWORK_URL = typeof DEVNET_URL | typeof MAINNET_URL;

if (!MAINNET_URL) {
  throw new Error("VITE_SOLANA_MAINNET_RPC_URL is required");
}

const WalletApp = () => {
  const navigate = useNavigate();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [wallets, setWallets] = useState<PublicKey[]>([]);
  const [network, setNetwork] = useState<NETWORK_URL>(MAINNET_URL);
  const [solAmounts, setSolAmounts] = useState<Map<string, number>>(new Map());

  const addNewWallet = async () => {
    const mnemonic = localStorage.getItem("mnemonic");
    if (mnemonic) {
      try {
        const seed = await mnemonicToSeed(mnemonic);
        const path = `m/44'/501'/${currentIndex}'/0'`;
        const derivedSeed = derivePath(path, seed.toString("hex")).key;
        const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
        const keypair = Keypair.fromSecretKey(secret);

        setCurrentIndex(currentIndex + 1);
        setWallets([...wallets, keypair.publicKey]);
      } catch {
        console.log("Failed to add wallet.");
      }
    } else {
      console.log("No mnemonic found in local storage.");
    }
  };

  const changeNetworkToTestnetOrMainnet = () => {
    console.log("Changing network...");
    const resetSolAmounts = new Map(
      wallets.map((wallet) => [wallet.toBase58(), 0])
    );
    setSolAmounts(resetSolAmounts);
    setNetwork((prev: NETWORK_URL) =>
      prev === DEVNET_URL ? MAINNET_URL : DEVNET_URL
    );
    console.log("Network changed to: ", network);
  };

  useEffect(() => {
    const fetchBalances = async () => {
      if (wallets.length > 0) {
        const connection = new Connection(network, "confirmed"); // Change to mainnet

        const address = wallets[wallets.length - 1].toBase58();
        const wallet = new PublicKey(address);

        const balance = await connection.getBalance(wallet);
        setSolAmounts((prev) =>
          new Map(prev).set(wallet.toBase58(), balance / LAMPORTS_PER_SOL)
        );
      }
    };

    fetchBalances();
  }, [network, wallets]); // Add wallets as a dependency

  useEffect(() => {
    addNewWallet();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const copyToClipboard = (address: string) => {
    navigator.clipboard.writeText(address);
    toast.success("Address copied to clipboard!");
  };

  return (
    <div className="h-full min-h-screen w-full bg-zinc-950 p-6">
      <Header
        addNewWallet={addNewWallet}
        changeNetworkToTestnetOrMainnet={changeNetworkToTestnetOrMainnet}
      />

      <div className="flex flex-wrap justify-center gap-6">
        {wallets.map((publicKey, index) => (
          <div
            key={index}
            className="max-w-5xl bg-zinc-200 border border-fuchsia-500 p-6 rounded-lg shadow-md"
          >
            <p className="text-lg font-semibold mb-2 text-fuchsia-700">
              Wallet Address:
            </p>
            <p className="text-sm flex gap-3 font-mono break-all mb-4 text-black">
              {publicKey.toBase58()}
              <span
                onClick={() => copyToClipboard(publicKey.toBase58())}
                className="cursor-pointer text-fuchsia-700 hover:text-fuchsia-500"
              >
                <BsCopy />
              </span>
            </p>

            <p className="text-lg font-semibold text-fuchsia-700">
              SOL Balance:
            </p>
            <p className="text-xl font-mono mb-4 text-black">
              {solAmounts.get(publicKey.toBase58()) ?? "0"} SOL
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => navigate("/send")}
                className="flex-1 bg-[#00f0ff] text-black font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-[#00c0cc] transition duration-300 ease-in-out text-sm"
              >
                Send
              </button>
              <button
                onClick={() => navigate("/receive")}
                className="flex-1 bg-fuchsia-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-[#7b3f7a] transition duration-300 ease-in-out text-sm"
              >
                Receive
              </button>
            </div>
          </div>
        ))}

        {wallets.length === 0 && (
          <div className="text-center text-zinc-400">No wallets added yet.</div>
        )}
      </div>
    </div>
  );
};

export default WalletApp;
