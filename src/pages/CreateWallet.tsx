import { NavLink } from "react-router-dom";

const CreateWallet = () => {
  return (
    <div className="h-screen w-full bg-[#121212] flex items-center justify-center p-4">
      <div className="bg-[#1e1e1e] w-full max-w-md text-[#f8f8f2] rounded-lg shadow-lg p-6 md:p-10 text-center">
      <h1 className="text-3xl md:text-4xl font-bold text-[#00f0ff] mb-6 md:mb-8">
          Welcome to Sollet
        </h1>
        <NavLink
          to={"generate-mnemonic"}
          className="block text-zinc-50 font-semibold py-3 px-6 rounded-full shadow-md border-2 border-[#00f0ff] mb-4 md:mb-2"
        >
          Create Wallet
        </NavLink>
        <NavLink
          to={"import-wallet"}
          className="block text-zinc-50 font-semibold py-3 px-6 rounded-full shadow-md border-2 border-[#8e44ad] mb-4 md:mb-2"
        >
          Import Wallet
        </NavLink>
      </div>
    </div>
  );
};

export default CreateWallet;
 