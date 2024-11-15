import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import Logout from "./Logout";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  Connection,
  GetTransactionConfig,
  PublicKey,
  TransactionResponse,
} from "@solana/web3.js";
import { toast } from "sonner";
import { NETWORK_URL } from "@/types/type";

interface HeaderProps {
  networkUrl: string;
  addNewWallet: () => void;
  changeNetworkToTestnetOrMainnet: () => void;
  setTrackAddress: (address: string) => void;
  trackAddress?: string;
  setTransactionHistory?: React.Dispatch<
    React.SetStateAction<(TransactionResponse | null)[]>
  >;
  setNetwork: (network: NETWORK_URL) => void;
}

const Header: React.FC<HeaderProps> = ({
  networkUrl,
  addNewWallet,
  changeNetworkToTestnetOrMainnet,
  setTrackAddress,
  setTransactionHistory,
  trackAddress,
  setNetwork
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [networkType, setNetworkType] = useState("");

  const handleSwitchClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  useEffect(() => {
    if (networkUrl.includes("mainnet")) setNetworkType("Mainnet");
    else if (networkUrl.includes("devnet")) setNetworkType("Devnet");
  }, [networkUrl, setNetwork]);

  const getTransactionHistory = async () => {
    setIsDialogOpen(false);

    const network = localStorage.getItem("network");

    if (!trackAddress || !network) {
      toast.error(
        trackAddress ? "Network not set" : "No track address provided."
      );
      return;
    }

    try {
      const connection = new Connection(network, "confirmed");

      let address;
      try {
        address = new PublicKey(trackAddress);
      } catch {
        toast.error("Invalid address format.");
        return;
      }

      const signatures = await connection.getSignaturesForAddress(address, {
        limit: 10,
      });

      if (signatures.length === 0) {
        toast.info("No transactions found for this address.");
        return;
      }

      const getTransactionConfig: GetTransactionConfig = {
        commitment: "confirmed",
      };

      const transactions = await Promise.all(
        signatures.map(async (signature) => {
          try {
            const tx = await connection.getTransaction(
              signature.signature,
              getTransactionConfig
            );
            return tx;
          } catch (error) {
            console.error(
              `Error fetching transaction for signature ${signature.signature}:`,
              error
            );
            toast.error(
              `Error fetching transaction for signature ${signature.signature}`
            );
            return null;
          }
        })
      );

      const validTransactions = transactions.filter((tx) => tx !== null);
      if (validTransactions.length > 0) {
        setTransactionHistory?.((prevHistory) => [
          ...prevHistory,
          ...validTransactions,
        ]);
      } else {
        toast.info("No valid transactions found.");
      }
    } catch (error) {
      console.error("Error fetching transaction history:", error);
      toast.error("Error fetching transaction history.");
    }
  };

  return (
    <div className="flex justify-between bg-zinc-900 rounded-xl border-b border-gray-300 items-center p-2 px-4">
      <h1 className="text-4xl font-bold text-[#00f0ff]">Sollet</h1>
      <DropdownMenu>
        <DropdownMenuTrigger className="text-white font-semibold flex flex-col">
          Manage Accounts
          <span className="text-xs text-fuchsia-500">[{networkType}]</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-zinc-800 text-[#00f0ff]">
          <DropdownMenuItem
            onClick={addNewWallet}
            className="hover:bg-zinc-700 px-4 py-2"
          >
            Add Wallet
          </DropdownMenuItem>
          <DropdownMenuItem className="hover:bg-zinc-700 px-4 py-2">
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
          <DropdownMenuItem
            onClick={() => setIsDialogOpen(true)}
            className="hover:bg-zinc-700 px-4 py-2"
          >
            Trace
          </DropdownMenuItem>
          <DropdownMenuItem className="hover:bg-zinc-700 px-4 py-2">
            <Logout />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-zinc-200">
          <DialogHeader>
            <DialogTitle className="text-fuchsia-700">
              Track Address
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              id="address"
              onChange={(e) => setTrackAddress(e.target.value)}
              placeholder="Enter Address"
              className="col-span-3 border-2 border-[#61a7ac]"
            />
          </div>
          <DialogFooter>
            <Button onClick={getTransactionHistory} className="bg-fuchsia-700">
              Track
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Header;
