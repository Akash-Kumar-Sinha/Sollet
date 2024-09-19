import React from "react";
import CreateWallet from "./pages/CreateWallet";
import { Route, Routes } from "react-router-dom";
import GenerateMnemonic from "./components/GenerateMnemonic";
import CreatePassword from "./components/CreatePassword";
import WalletApp from "./pages/WalletApp";
import ImportWallet from "./pages/ImportWallet";

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<CreateWallet />} />
      <Route path="/generate-mnemonic" element={<GenerateMnemonic />} />
      <Route path="/create-password" element={<CreatePassword />} />
      <Route path="/wallet" element={<WalletApp />} />
      <Route path="/import-wallet" element={<ImportWallet />} />

    </Routes>
  );
};

export default App;
