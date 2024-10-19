import React from "react";
import QRCode from "react-qr-code";
import { BsCopy } from "react-icons/bs";
import { toast } from "sonner";
import { PublicKey } from "@solana/web3.js";

interface WalletListProps {
  wallets: PublicKey[];
  solAmounts: Map<string, number>;
  copyAddress: (text: string) => void;
}

const WalletList: React.FC<WalletListProps> = ({ wallets, solAmounts, copyAddress }) => {
  return (
    <div className="flex flex-wrap justify-center gap-6">
      {wallets.map((publicKey, index) => (
        <div
          key={index}
          className="flex flex-col max-w-5xl bg-zinc-200 border border-fuchsia-500 p-6 rounded-lg shadow-md"
        >
          <div className="flex justify-between">
            <div className="flex flex-col">
              <p className="text-lg font-semibold mb-2 text-fuchsia-700">
                Wallet Address:
              </p>
              <p className="text-sm flex gap-3 font-mono break-all mb-4 text-black">
                {publicKey.toBase58()}
                <span
                  onClick={() => copyAddress(publicKey.toBase58())}
                  className="cursor-pointer text-fuchsia-700 hover:text-fuchsia-500"
                >
                  <BsCopy />
                </span>
              </p>

              <p className="text-lg font-semibold text-fuchsia-700">
                SOL Balance:
              </p>
              <p className="text-xl font-mono mb-4 text-black">
                {solAmounts.get(publicKey.toBase58())?.toString() ?? "0"} SOL
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => toast.success("Sending SOL...")}
                  className="flex-1 bg-[#00f0ff] text-black font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-[#00c0cc] transition duration-300 ease-in-out text-sm"
                >
                  Send
                </button>
                <button
                  onClick={() => toast.success("Receiving SOL...")}
                  className="flex-1 bg-fuchsia-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-[#7b3f7a] transition duration-300 ease-in-out text-sm"
                >
                  Receive
                </button>
              </div>
            </div>

            <div className="flex items-center ml-4 border-2 border-zinc-50 bg-white rounded-lg p-4 shadow-lg">
              <QRCode value={publicKey.toBase58()} size={128} />
            </div>
          </div>
        </div>
      ))}

      {wallets.length === 0 && (
        <div className="text-center text-zinc-400">No wallets added yet.</div>
      )}
    </div>
  );
};

export default WalletList;
