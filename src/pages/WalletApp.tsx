import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { derivePath } from "ed25519-hd-key";
import { PublicKey, Keypair } from "@solana/web3.js";
import nacl from "tweetnacl";
import { mnemonicToSeed } from "bip39";

const WalletApp = () => {
  const navigate = useNavigate();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [wallets, setWallets] = useState<PublicKey[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [solAmounts, setSolAmounts] = useState<Map<string, number>>(new Map());

  const addNewWallet = async () => {
    const mnemonic = localStorage.getItem("mnemonic");
    if (mnemonic) {
      const seed = await mnemonicToSeed(mnemonic);

      const path = `m/44'/501'/${currentIndex}'/0'`;

      const derivedSeed = derivePath(path, seed.toString("hex")).key;

      const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;

      const keypair = Keypair.fromSecretKey(secret);
      
      setCurrentIndex(currentIndex + 1);
      setWallets([...wallets, keypair.publicKey]);
    }
  };

  useEffect(()=>{
    addNewWallet()
    // gaze industry busy noodle square trumpet adapt like clown grief cotton glove
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  return (
    <div className="h-screen bg-[#121212] flex flex-col items-center justify-center p-6">
      <div className="bg-[#1e1e1e] w-full max-w-lg text-[#f8f8f2] rounded-lg border border-[#8e44ad] shadow-md p-6">
        <h1 className="text-2xl font-bold text-[#00f0ff] mb-4">
          Wallets
        </h1>

        <div className="space-y-4 mb-4">
          {wallets.map((publicKey, index) => (
            <div
              key={index}
              className="bg-[#2a2a2a] border border-[#8e44ad] p-4 rounded-md"
            >
              <p className="text-lg font-semibold mb-2">Wallet Address:</p>
              <p className="text-sm font-mono break-all mb-2">
                {publicKey.toBase58()}
              </p>
              <p className="text-lg font-semibold">SOL Balance:</p>
              <p className="text-xl font-mono mb-4">
                {solAmounts.get(publicKey.toBase58()) ?? "0"} SOL
              </p>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => navigate("/send")}
                  className="bg-[#00f0ff] text-[#121212] font-semibold py-1 px-3 rounded-md shadow-sm hover:bg-[#00c0cc] transition duration-300 text-sm"
                >
                  Send
                </button>
                <button
                  onClick={() => navigate("/receive")}
                  className="bg-[#8e44ad] text-[#f8f8f2] font-semibold py-1 px-3 rounded-md shadow-sm hover:bg-[#7b3f7a] transition duration-300 text-sm"
                >
                  Receive
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={addNewWallet}
          className="bg-[#00f0ff] text-[#121212] font-semibold py-2 px-4 rounded-md shadow-sm hover:bg-[#00c0cc] transition duration-300 text-sm"
        >
          Add Wallet
        </button>
      </div>
    </div>
  );
};

export default WalletApp;
