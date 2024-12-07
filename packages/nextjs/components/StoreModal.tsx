import React, { useCallback, useState } from "react";

export type StoreModalProps = {};

const STORE_ITEMS = [
  {
    label: "Health Potion",
    price: 1, // Price in USDC per unit
  },
  {
    label: "Super Potion",
    price: 5,
  },
  {
    label: "1000 CASH",
    price: 10,
  },
];

type StoreItem = (typeof STORE_ITEMS)[number];

export const StoreModal: React.FC<StoreModalProps> = () => {
  const [activeItem, setActiveItem] = useState<StoreItem | null>(STORE_ITEMS[0]);

  const handleItemClick = useCallback(
    (item: StoreItem) => {
      setActiveItem(item);
    },
    [setActiveItem],
  );

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
                  "flex flex-col w-full text-center border border-black rounded-xl select-none transition-all " +
                  (activeItem === item ? "border-2 border-teal-700 shadow-lg" : "")
                }
              >
                <span className="bg-teal-900 text-white w-full py-3 rounded-t-lg">{item.label}</span>
                <span className="py-2">{item.price} USDC</span>
              </div>
            ))}
          </div>

          <button
            className="mt-5 bg-transparent hover:bg-gray-300 text-black border rounded-md border-blue-500 px-4 py-2 transition-colors w-full"
            onClick={() => (document.getElementById("store_modal") as HTMLDialogElement).close()}
          >
            Approve
          </button>

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
