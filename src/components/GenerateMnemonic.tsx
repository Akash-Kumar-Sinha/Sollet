import { useEffect, useState } from "react";
import { generateWallet } from "../utils/generateWallet";
import { useNavigate } from "react-router-dom";

const GenerateMnemonic = () => {
  const [mnemonic, setMnemonic] = useState<string | undefined>("");
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const { mnemonic} = await generateWallet();
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

  const mnemonicWords = mnemonic?.split(" ");

  return (
    <div className="h-screen bg-[#121212] flex items-center justify-center p-6">
      <div className="bg-[#1e1e1e] w-full max-w-lg text-[#f8f8f2] text-center rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-[#8e44ad] mb-4">
          Secret Recovery Phrase
        </h1>
        <p className="text-base mb-4">
          Save these words in a safe place. You will need them to restore your
          wallet.
        </p>
        <div className="grid grid-cols-3 gap-4 mb-6">
          {mnemonicWords?.map((word, index) => (
            <div key={index} className="flex items-center">
              <span className="text-[#00f0ff] font-semibold mr-2">
                {index + 1}.
              </span>
              <div className="w-full bg-[#2a2a2a] text-[#f8f8f2] border border-[#8e44ad] rounded-md p-2">
                {word}
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center mb-6">
          <input
            type="checkbox"
            id="confirm-phrase"
            checked={isChecked}
            onChange={handleCheckboxChange}
            className="mr-2"
          />
          <label htmlFor="confirm-phrase" className="text-gray-400 text-sm">
            I have saved my secret recovery phrase
          </label>
        </div>
        <button
          onClick={handleNext}
          className="bg-[#00f0ff] text-[#121212] font-semibold py-3 px-6 rounded-full shadow-lg hover:bg-[#7b3f7a] transition duration-300"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default GenerateMnemonic;
