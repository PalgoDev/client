import React from "react";
import { StoreModal } from "./StoreModal";

export type PlayerStats = {
  wallet_address: string;
  attack: number;
  defense: number;
  health: number;
};

export const PlayerChip: React.FC<PlayerStats> = ({ wallet_address, attack, defense, health }) => {
  const truncatedAddress = `${wallet_address.slice(0, 6)}...${wallet_address.slice(-4)}`;

  return (
    <>
      {/* Player Chip */}
      <div
        className="flex items-center gap-4 bg-gray-100 px-4 py-2 rounded-md shadow-NONE flex-row-reverse cursor-pointer"
        onClick={() => (document.getElementById("my_modal_1") as HTMLDialogElement).showModal()}
      >
        {/* Show full stats on larger screens */}
        <div className="hidden sm:flex items-center gap-2 text-sm">
          <div className="flex items-center gap-1">
            <span className="font-bold text-red-500">Attack:</span> {attack}
          </div>
          <div className="flex items-center gap-1">
            <span className="font-bold text-blue-500">Defense:</span> {defense}
          </div>
          <div className="flex items-center gap-1">
            <span className="font-bold text-green-500">Health:</span> {health}
          </div>
        </div>
        {/* Always show wallet address */}
        <div className="text-sm font-medium">
          <span className="block">{truncatedAddress}</span>
        </div>
      </div>

      {/* Dialog */}
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box">
          {/* Player Stats */}
          <h3 className="font-bold text-lg">Player Stats</h3>
          <p className="py-2 text-sm">
            <strong>Wallet Address:</strong> {wallet_address}
          </p>
          <p className="py-2">
            <strong>Attack:</strong> {attack}
          </p>
          <p className="py-2">
            <strong>Defense:</strong> {defense}
          </p>
          <p className="py-2">
            <strong>Health:</strong> {health}
          </p>

          {/* Action Buttons */}
          <div className="flex justify-between items-center mt-4 w-full">
            <button
              className="bg-transparent border border-gray-700 text-black px-4 py-2 rounded-md hover:bg-gray-300 transition-colors min-w-[40%] w-full"
              onClick={() => (document.getElementById("store_modal") as HTMLDialogElement).showModal()}
            >
              Store
            </button>
          </div>

          {/* Close Button */}
          <div className="modal-action">
            <button
              className="bg-transparent hover:bg-gray-300 text-black border rounded-md border-red-500 px-4 py-2 transition-colors w-full"
              onClick={() => (document.getElementById("my_modal_1") as HTMLDialogElement).close()}
            >
              Close
            </button>
          </div>
        </div>
      </dialog>

      <StoreModal />
    </>
  );
};
