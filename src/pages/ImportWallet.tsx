import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as bip39 from "bip39";
import CryptoJS from "crypto-js";
import { MEMONICS_PHRASE_CIPHERTEXT } from "../types/type";

const SECRET_KEY = import.meta.env.VITE_SECRET_KEY;

if (!SECRET_KEY) {
  throw new Error("VITE_SECRET_KEY is required");
}

const ImportWallet = () => {
  const navigate = useNavigate();
  const { handleSubmit, register } = useForm();

  const onSubmit = (data: Record<string, string>) => {
    const mnemonic = Object.values(data).join(" ");
    if (bip39.validateMnemonic(mnemonic)) {
      const ciphertext_encrypt_sollet = CryptoJS.AES.encrypt(
        mnemonic,
        SECRET_KEY
      ).toString();

      localStorage.setItem(
        MEMONICS_PHRASE_CIPHERTEXT,
        ciphertext_encrypt_sollet
      );
      navigate("/create-password");
    } else {
      console.log("Invalid recovery phrase");
    }
  };

  return (
    <div className="h-screen bg-zinc-950 flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white w-full max-w-md text-black rounded-lg shadow-xl p-8 flex flex-col items-center justify-center"
      >
        <h1 className="text-4xl font-bold text-purple-700 mb-6">
          Import Wallet
        </h1>
        <p className="text-base mb-4">Secret Recovery Phrase</p>
        <p className="text-sm mb-6 text-center">
          Enter your 12-word recovery phrase below. Each box represents one
          word.
        </p>
        <div className="grid grid-cols-3 gap-4 mb-6">
          {Array.from({ length: 12 }).map((_, index) => (
            <div key={index} className="flex items-center">
              <input
                {...register(`word_${index}`, { required: true })}
                type="text"
                className="w-full bg-zinc-200 text-black border border-fuchsia-500 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-200"
                placeholder={`${index + 1}.`}
              />
            </div>
          ))}
        </div>
        <button
          type="submit"
          className="bg-gradient-to-r from-purple-500 to-purple-800 text-white font-semibold py-3 px-6 rounded-full shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
        >
          Import Wallet
        </button>
      </form>
    </div>
  );
};

export default ImportWallet;
