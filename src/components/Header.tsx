import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";

interface HeaderProps {
  addNewWallet: () => void;
  changeNetworkToTestnetOrMainnet: () => void;
}

const Header: React.FC<HeaderProps> = ({
  addNewWallet,
  changeNetworkToTestnetOrMainnet,
}) => {
  const handleSwitchClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-4xl font-bold text-[#00f0ff]">Sollet</h1>
      <DropdownMenu>
        <DropdownMenuTrigger className="text-white font-semibold">
          Manage Accounts
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-zinc-800 text-[#00f0ff]">
          <DropdownMenuItem
            onClick={addNewWallet}
            className="hover:bg-zinc-700 cursor-pointer flex items-center justify-start space-x-2 px-4 py-2"
          >
            <span>Add Wallet</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="hover:bg-zinc-700 cursor-pointer flex items-center justify-between space-x-2 px-4 py-2">
            <div
              className="flex items-center space-x-2"
              onClick={handleSwitchClick}
            >
              <Label htmlFor="Testnet-mode">Testnet</Label>
              <Switch
                id="Testnet"
                className="ring-2 ring-[#00f0ff]"
                onClick={changeNetworkToTestnetOrMainnet}
              />
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default Header;
