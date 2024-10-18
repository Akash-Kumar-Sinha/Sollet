import { NavLink } from "react-router-dom";

const CreateWallet = () => {
  return (
    <div className="h-screen w-full bg-zinc-950 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md text-black rounded-lg shadow-lg p-6 md:p-10 text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#8e44ad] mb-6 md:mb-8">
          Welcome to Sollet
        </h1>
        <NavLink
          to={"generate-mnemonic"}
          className="block font-semibold py-3 px-6 rounded-full shadow-lg border-2 border-fuchsia-500 bg-transparent text-black hover:text-white hover:bg-fuchsia-500 transition-colors duration-300 ease-in-out mb-4 md:mb-6"
        >
          Create Wallet
        </NavLink>
        <NavLink
          to={"import-wallet"}
          className="block font-semibold py-3 px-6 rounded-full shadow-lg border-2 border-[#8e44ad] bg-transparent text-black hover:text-white hover:bg-[#8e44ad] transition-colors duration-300 ease-in-out mb-4 md:mb-6"
        >
          Import Wallet
        </NavLink>
      </div>
    </div>
  );
};

export default CreateWallet;
