import { useEffect, useState } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { IMAGE_URL } from "~~/config";
import { fightStepAtom } from "~~/state/fightAtom";
import { FIGHT_STEP } from "~~/types";
import { chainAtom } from "~~/state/chainAtom";

export const Fighting = () => {
  const setStep = useSetAtom(fightStepAtom);

  const chainId = useAtomValue(chainAtom)

  const [damage0, setDamage0] = useState(0);
  const [damage1, setDamage1] = useState(0);

  const fetchFight = async () => {
    return fetch(`${process.env.NEXT_PUBLIC_API_URL}/game/createAndSimulate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        player_1_id: 4,
        player_2_id: 3,
        chainId,
      }),
    }).then(res => res.json());
  };

  const [fightData, setFightData] = useState<{ damages: number[]; result: number } | null>(null);

  const damageList = fightData?.damages || [];
  const result = fightData?.result === 1 ? FIGHT_STEP.WIN : FIGHT_STEP.LOSE;

  useEffect(() => {
    fetchFight().then(data => {
      setFightData(data);
    });
  }, []);

  useEffect(() => {
    if (!fightData) return;

    let interval = setInterval(() => {
      setDamage0(damageList[Math.floor(Math.random() * damageList.length)]);
      setDamage1(damageList[Math.floor(Math.random() * damageList.length)]);
    }, 1000);

    let timeout = setTimeout(() => {
      setStep(result);
    }, 8000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [fightData, setStep, damageList, result]);

  return (
    <>
      <div
        className="w-full h-[90%] rounded-xl relative grid place-items-center fade-in"
        style={{
          backgroundImage: `url(${IMAGE_URL.fight_background})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      >
        <div className="relative -left-1/4 top-1/3 z-10">
          <img
            src={IMAGE_URL.Chill_guy}
            alt="You"
            width="156"
            height="100%"
            className="z-10 rounded-full hit-animation-1"
          />
          {damage0 && <p className="damage-text">-{damage0}</p>}
        </div>
        <img
          src={IMAGE_URL.electricity}
          alt="Electricity"
          className="absolute w-full h-full z-1"
          style={{ mixBlendMode: "screen" }}
        />
        <div className="relative -right-1/4 bottom-2/3 z-10">
          <img
            src={IMAGE_URL.Not_so_chill_guy}
            alt="You"
            width="156"
            height="100%"
            className="z-10 rounded-full hit-animation-2"
          />

          {damage1 && <p className="damage-text">-{damage1}</p>}
        </div>
      </div>
    </>
  );
};
