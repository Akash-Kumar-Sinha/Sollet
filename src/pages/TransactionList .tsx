import { TransactionResponse } from "@solana/web3.js";
import React from "react";

interface TransactionListProps {
  transactions: TransactionResponse[];
  isLoading: boolean;
}

const TransactionList: React.FC<TransactionListProps> = React.memo(
  ({ transactions, isLoading }) => {
    return (
      <div className="bg-zinc-900 p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-4xl mx-auto overflow-x-auto">
        <h2 className="text-xl sm:text-2xl font-bold text-[#00f0ff] mb-6 text-center">
          Track Wallet
        </h2>

        {isLoading ? (
          <div className="flex justify-center items-center">
            <p className="text-zinc-400 text-lg animate-pulse">
              Loading transactions...
            </p>
          </div>
        ) : transactions.length > 0 ? (
          <ul className="space-y-4">
            {transactions.map((transaction, index) => (
              <li
                key={index}
                className="bg-zinc-800 p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
              >
                <div className="space-y-3">
                  <div className="flex flex-wrap justify-between items-center gap-2">
                    <p className="text-white text-sm break-words max-w-full sm:max-w-[70%]">
                      <span className="font-semibold">Signature:</span>{" "}
                      {transaction.transaction.signatures[0]}
                    </p>
                    <p
                      className={`text-sm font-semibold ${
                        transaction.meta?.err
                          ? "text-red-500"
                          : "text-green-500"
                      }`}
                    >
                      {transaction.meta?.err ? "Failed" : "Success"}
                    </p>
                  </div>
                  <div className="text-zinc-400 text-sm space-y-2">
                    <p>
                      <span className="font-semibold">Amount:</span>{" "}
                      {transaction.meta?.postBalances &&
                      transaction.meta?.preBalances
                        ? `${(
                            (transaction.meta.postBalances[0] -
                              transaction.meta.preBalances[0]) /
                            1e9
                          ).toFixed(9)} SOL`
                        : "N/A"}
                    </p>
                    <p>
                      <span className="font-semibold">Timestamp:</span>{" "}
                      {transaction.blockTime
                        ? new Date(
                            transaction.blockTime * 1000
                          ).toLocaleString()
                        : "N/A"}
                    </p>
                    <p>
                      <span className="font-semibold">Fee:</span>{" "}
                      {transaction.meta?.fee
                        ? `${transaction.meta.fee / 1e9} SOL`
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-zinc-400 text-center py-10">
            No transactions found for this address.
          </div>
        )}
      </div>
    );
  }
);

export default TransactionList;
