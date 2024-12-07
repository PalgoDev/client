import { useAtom } from "jotai";
import { IMAGE_URL } from "~~/config";
import { fightStepAtom } from "~~/state/fightAtom";
import { FIGHT_STEP } from "~~/types";

export const Versus = () => {
  const [, setStep] = useAtom(fightStepAtom);

  return (
    <>
      <div
        className="w-full h-[90%] bg-gray-50 rounded-xl grid place-items-center scale-up"
        style={{
          backgroundImage: `url(${IMAGE_URL.arena_background})`,
        }}
      >
        <img
          src={IMAGE_URL.Chill_guy}
          alt="You"
          width="156"
          height="100%"
          className="absolute left-0 md:left-1/4 slide-from-left z-10"
        />
        <h1 className="text-9xl italic font-bold text-center scale-down-in text-white z-20 relative">V/S</h1>
        <img
          src={IMAGE_URL.Not_so_chill_guy}
          alt="You"
          width="156"
          height="100%"
          className="absolute right-0 md:right-1/4 slide-from-right z-10"
        />
      </div>
      <button onClick={() => setStep(FIGHT_STEP.LOBBY)} className="absolute z-30">
        Back
      </button>
    </>
  );
};
