import React, { useState } from "react";
import QRCode from "react-qr-code";
import { BsCopy } from "react-icons/bs";
import { toast } from "sonner";
import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { Input } from "@/components/ui/input";
import { SECRET_KEY_CIPHERTEXT } from "@/types/type";
import { decryptSecretKey } from "@/utils/decryptMnemonicAnsSecretKey";
import bs58 from "bs58";

interface WalletListProps {
  wallets: PublicKey[];
  solAmounts: Map<string, number>;
  copyAddress: (text: string) => void;
}

const WalletList: React.FC<WalletListProps> = ({
  wallets,
  solAmounts,
  copyAddress,
}) => {
  const [recipientAddress, setRecipientAddress] = useState("");
  const [sendSolAmount, setSendSolAmount] = useState(0);
  const [sendingStatus, setSendingStatus] = useState(false);

  const SendSol = async (
    recipientAddress: string,
    solAmount: number,
    index: number
  ) => {
    setSendingStatus(true);
    try {
      if (!recipientAddress || solAmount <= 0) {
        toast.error(
          "Please enter a valid recipient address and amount to send"
        );
        return;
      }

      const network = localStorage.getItem("network");
      if (!network) {
        toast.error("Network not found");
        return;
      }

      const walletPublicKey = wallets[index]?.toBase58();
      if (!walletPublicKey) {
        toast.error("Wallet public key not found");
        return;
      }

      const encryptedSecretKey = localStorage.getItem(
        `${SECRET_KEY_CIPHERTEXT}_${walletPublicKey}`
      );
      if (!encryptedSecretKey) {
        toast.error("Secret key not found");
        return;
      }

      const secretKey = decryptSecretKey(encryptedSecretKey);
      if (!secretKey) {
        toast.error("Failed to decrypt secret key.");
        return;
      }

      let keypair: Keypair;
      try {
        keypair = Keypair.fromSecretKey(bs58.decode(secretKey));
      } catch (error) {
        console.error("Invalid secret key:", error);
        toast.error("Invalid secret key.");
        return;
      }

      try {
        const connection = new Connection(network, "confirmed");
        const recipientPublicKey = new PublicKey(recipientAddress);

        const transaction = new Transaction().add(
          SystemProgram.transfer({
            fromPubkey: keypair.publicKey,
            toPubkey: recipientPublicKey,
            lamports: solAmount * LAMPORTS_PER_SOL,
          })
        );

        const signature = await sendAndConfirmTransaction(
          connection,
          transaction,
          [keypair]
        );

        console.log(
          `💸 Transaction complete! Sent ${solAmount} SOL to ${recipientAddress}.`
        );
        const updatedBalance = await connection.getBalance(keypair.publicKey);
        const updatedSolAmount = updatedBalance / LAMPORTS_PER_SOL;

        solAmounts.set(walletPublicKey, updatedSolAmount);
        toast.success(`Transaction successful! Signature: ${signature}`);
      } catch (error) {
        console.error("Transaction error:", error);
        toast.error("Failed to complete the transaction.");
      }
    } catch (error) {
      console.error("SendSol error:", error);
      toast.error("An unexpected error occurred.");
    } finally {
      setSendingStatus(false);
    }
  };

  return (
    <div className="flex flex-wrap justify-center gap-6">
      {wallets.map((publicKey, index) => (
        <div
          key={index}
          className="flex flex-col max-w-5xl bg-zinc-200 border border-fuchsia-500 p-6 rounded-lg shadow-md"
        >
          <div className="flex justify-center flex-wrap items-center gap-2">
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

              <div className="flex flex-col gap-3">
                <div className="flex gap-2">
                  <Input
                    onChange={(e) => setRecipientAddress(e.target.value)}
                    type="text"
                    placeholder="Recipient Address"
                    className="border-fuchsia-500"
                  />
                  <Input
                    onChange={(e) => setSendSolAmount(Number(e.target.value))}
                    type="number"
                    placeholder="Enter Sol value"
                    className="w-28 border-fuchsia-500"
                  />
                </div>
                <button
                  onClick={() =>
                    SendSol(recipientAddress, sendSolAmount, index)
                  }
                  className="flex-1 bg-[#00f0ff] text-black font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-[#00c0cc] transition duration-300 ease-in-out text-sm"
                  disabled={sendingStatus}
                >
                  Send
                </button>
                {sendingStatus && toast.info("Sending SOL...")}
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
