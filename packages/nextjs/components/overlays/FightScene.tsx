import { Versus } from "./FightScenes/Versus";
import { useAtom } from "jotai";
import { IMAGE_URL } from "~~/config";
import { fightStepAtom } from "~~/state/fightAtom";
import { FIGHT_STEP } from "~~/types";
import { Fighting } from "./FightScenes/Fighting";
import { Win } from "./FightScenes/Win";
import { Lose } from "./FightScenes/Lose";

interface FightSceneProps {
  data: {
    long: number;
    lat: number;
  };
  onDismiss: () => void;
}
export const FightScene = ({ data, onDismiss }: FightSceneProps) => {
  const [step, setStep] = useAtom(fightStepAtom);

  if (step === FIGHT_STEP.START) {
    return (
      <>
        <Versus />
      </>
    );
  }

  if (step === FIGHT_STEP.FIGHTING) {
    return <Fighting />;
  }

  if(step === FIGHT_STEP.WIN){
    return <Win />
  }

  if(step === FIGHT_STEP.LOSE){
    return <Lose />
  }

  return (
    <>
      <div className="w-[95%] md:w-1/2 h-[60%] rounded-xl bg-white bg-opacity-80 backdrop-blur-md transition-all">
        <div className="flex justify-center -mt-16">
          <img src={IMAGE_URL.Not_so_chill_guy} width="124" height="124" className="rounded-xl" />
        </div>

        <div className="mt-5">
          <h1 className="font-bold text-center text-3xl font-serif">Boss Fight!</h1>
          <h3 className="text-gray-400 text-sm text-center">
            {data.lat}, {data.long}
          </h3>
        </div>

        <div className="mt-10 flex justify-center space-x-2">
          <button
            className="font-bold bg-blue-700 text-white px-4 py-2 rounded-xl"
            onClick={() => setStep(FIGHT_STEP.START)}
          >
            Fight!
          </button>
          <button className="font-bold bg-gray-700 text-white px-4 py-2 rounded-xl" onClick={onDismiss}>
            Cancel
          </button>
        </div>
      </div>
    </>
  );
};
