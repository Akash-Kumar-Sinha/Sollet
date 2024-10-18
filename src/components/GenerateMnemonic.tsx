import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BsCopy } from "react-icons/bs";
import { toast } from "sonner";

import { generateWallet } from "../utils/generateWallet";

const GenerateMnemonic = () => {
  const [mnemonic, setMnemonic] = useState<string | undefined>("");
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const { mnemonic } = await generateWallet();
      setMnemonic(mnemonic);
    })();
  }, []);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const handleNext = () => {
    if (isChecked) {
      navigate("/create-password");
    } else {
      alert("Please confirm that you have saved your secret recovery phrase.");
    }
  };

  const handleCopyClick = () => {
    if (mnemonic) {
      navigator.clipboard
        .writeText(mnemonic)
        .then(() => {
          toast.success("Mnemonic copied to clipboard!");
        })
        .catch((error) => {
          console.error("Failed to copy mnemonic: ", error);
        });
    }
  };

  const mnemonicWords = mnemonic?.split(" ");

  return (
    <div className="h-screen bg-zinc-950 flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-md text-black text-center rounded-lg shadow-lg p-8 md:p-10 relative">
        <h1 className="text-3xl md:text-4xl font-bold text-[#8e44ad] mb-6">
          Secret Recovery Phrase
        </h1>

        <p className="text-base text-gray-600 mb-6">
          Save these words in a safe place. You will need them to restore your
          wallet.
        </p>

        <div className="grid grid-cols-3 gap-4 mb-6">
          {mnemonicWords?.map((word, index) => (
            <div key={index} className="flex items-center">
              <div className="w-full bg-zinc-200 text-black border border-fuchsia-500 rounded-md p-2">
                {word}
              </div>
            </div>
          ))}
        </div>

        {/* Copy button aligned to the right */}
        <div className="flex justify-end mb-6">
          <button
            onClick={handleCopyClick}
            className=" text-fuchsia-500 font-semibold py-2 px-4 rounded-full shadow-md hover:bg-[#8e44ad] hover:text-white transition-colors duration-300 flex items-center"
          >
            <BsCopy />
          </button>
        </div>

        <div className="flex items-center justify-center mb-6">
          <input
            type="checkbox"
            id="confirm-phrase"
            checked={isChecked}
            onChange={handleCheckboxChange}
            className="mr-2 accent-fuchsia-500"
          />
          <label htmlFor="confirm-phrase" className="text-gray-500 text-sm">
            I have saved my secret recovery phrase
          </label>
        </div>

        <button
          onClick={handleNext}
          className="bg-fuchsia-500 text-white font-semibold py-3 px-6 rounded-full shadow-lg hover:bg-[#8e44ad] transition duration-300 ease-in-out"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default GenerateMnemonic;
