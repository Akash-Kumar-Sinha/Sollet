import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import * as bip39 from "bip39";

const ImportWallet = () => {
  const navigate = useNavigate();
  const { handleSubmit, register } = useForm();

  const onSubmit = (data: any) => {
    const mnemonic = Object.values(data).join(" ");
    console.log(mnemonic);
    if (bip39.validateMnemonic(mnemonic)) {
      localStorage.setItem("mnemonic", mnemonic);
      navigate("/create-password");
    } else {
      console.log("Invalid recovery phrase");
    }
  };

  return (
    <div className="h-screen bg-[#121212] flex items-center justify-center p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-[#1e1e1e] w-full max-w-md text-[#f8f8f2] rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-[#00f0ff] mb-4">Import Wallet</h1>
        <p className="text-base mb-4">Secret Recovery Phrase</p>
        <p className="text-sm mb-6">Enter your 12-word recovery phrase below. Each box represents one word.</p>
        <div className="grid grid-cols-3 gap-4 mb-6">
          {Array.from({ length: 12 }).map((_, index) => (
            <div key={index} className="flex items-center">
              <span className="text-[#00f0ff] font-semibold mr-2">{index + 1}.</span>
              <input
                {...register(`word_${index}`, { required: true })}
                type="text"
                className="w-full bg-[#2a2a2a] text-[#f8f8f2] border border-[#8e44ad] rounded-md p-2"
                placeholder={`Word ${index + 1}`}
              />
            </div>
          ))}
        </div>
        <button
          type="submit"
          className="bg-[#00f0ff] text-[#121212] font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-[#00c0cc] transition duration-300"
        >
          Import Wallet
        </button>
      </form>
    </div>
  );
};

export default ImportWallet;
