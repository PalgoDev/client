import { useCallback } from "react";
import { useSetAtom } from "jotai";
import { IMAGE_URL } from "~~/config";
import { fightStepAtom } from "~~/state/fightAtom";
import { overlayAtom } from "~~/state/overlayAtom";
import { FIGHT_STEP, OVERLAY } from "~~/types";

export const Win = () => {
  const setStep = useSetAtom(fightStepAtom);
  const setOverlay = useSetAtom(overlayAtom);

  const closeFight = useCallback(() => {
    setStep(FIGHT_STEP.LOBBY);
    setOverlay({
      type: OVERLAY.NONE,
      data: null,
    });
  }, [setStep, setOverlay]);

  return (
    <>
      <div
        className="w-full h-[90%] bg-gray-50 rounded-xl grid place-items-center scale-up"
        style={{
          backgroundImage: "linear-gradient(90deg, #a8e6cf , #dcedc1 )",
        }}
      >
        <img
          src={IMAGE_URL.Chill_guy}
          alt="You"
          width="156"
          height="100%"
          className="absolute left-0 md:left-1/4 slide-from-left z-10 rounded-full border-2 border-green-500"
        />
        <h1 className="text-9xl italic font-bold text-center scale-down-in text-white z-20 relative">WIN</h1>
        <img
          src={IMAGE_URL.Not_so_chill_guy}
          alt="You"
          width="156"
          height="100%"
          className="absolute right-0 md:right-1/4 slide-from-right z-10 rounded-full border-2 border-red-500"
        />

        <button
          className="absolute bottom-1/4 bg-green-300 hover:bg-green-400 px-4 py-3 rounded-full transition"
          onClick={closeFight}
        >
          Awesome!
        </button>
      </div>
    </>
  );
};
