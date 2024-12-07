import { atom } from "jotai";
import { FIGHT_STEP } from "~~/types";

export const fightStepAtom = atom<FIGHT_STEP>(FIGHT_STEP.LOBBY);
