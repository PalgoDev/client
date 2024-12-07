import { useEffect, useState } from "react";
import { useSetAtom } from "jotai";
import { IMAGE_URL } from "~~/config";
import { fightStepAtom } from "~~/state/fightAtom";
import { FIGHT_STEP } from "~~/types";

export const Fighting = () => {
  const setStep = useSetAtom(fightStepAtom);

  const [damage0, setDamage0] = useState(0);
  const [damage1, setDamage1] = useState(0);

  const sampleDamageList = [18, 24, 22, 16, 12, 14, 34, 56, 32, 45, 12, 12, 2, 5, 5, 8, 18, 30, 46, 48, 50];
  const result = FIGHT_STEP.LOSE;

  useEffect(() => {
    let interval = setInterval(() => {
      setDamage0(sampleDamageList[Math.floor(Math.random() * sampleDamageList.length)]);
      setDamage1(sampleDamageList[Math.floor(Math.random() * sampleDamageList.length)]);
    }, 1000);

    let timeout = setTimeout(() => {
      setStep(result);
    }, 8000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

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
          <p className="damage-text">-{damage0}</p>
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
          <p className="damage-text">-{damage1}</p>
        </div>
      </div>
    </>
  );
};
