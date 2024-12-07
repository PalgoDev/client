import React, { useState } from "react";

export type StoreModalProps = {};

const STORE_ITEMS = [
  {
    label: "Health Potion",
    price: 0.00001, // Price in native ETH per unit
  },
  {
    label: "Super Potion",
    price: 0.00003,
  },
  {
    label: "CASH",
    price: 0.0001,
  },
];

type StoreItem = (typeof STORE_ITEMS)[number];

export const StoreModal: React.FC<StoreModalProps> = () => {
  const [activeItem, setActiveItem] = useState<StoreItem | null>(STORE_ITEMS[0]);

  const handleItemClick = (item: StoreItem) => {
    setActiveItem(item);
  };

  return (
    <>
      {/* Dialog */}
      <dialog id="store_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-2xl">Store</h3>

          <div className="mt-3 flex gap-3">
            {STORE_ITEMS.map((item, index) => (
              <div
                key={index}
                onClick={() => handleItemClick(item)}
                className={
                  "flex flex-col w-full text-center border border-black rounded-xl select-none " +
                  (activeItem === item ? "bg-teal-100" : "")
                }
              >
                <span className="bg-teal-900 text-white w-full py-3 rounded-t-xl">{item.label}</span>
                <span className="py-2">{item.price} ETH</span>
              </div>
            ))}
          </div>

          {/* Close Button */}
          <div className="modal-action">
            <button
              className="bg-transparent hover:bg-gray-300 text-black border rounded-md border-blue-500 px-4 py-2 transition-colors w-full"
              onClick={() => (document.getElementById("store_modal") as HTMLDialogElement).close()}
            >
              Buy
            </button>
            <button
              className="bg-transparent hover:bg-gray-300 text-black border rounded-md border-red-500 px-4 py-2 transition-colors w-full"
              onClick={() => (document.getElementById("store_modal") as HTMLDialogElement).close()}
            >
              Close
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
};
