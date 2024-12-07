import { atom } from "jotai";
import { OVERLAY } from "~~/types";

export const overlayAtom = atom<{ type: OVERLAY; data: any }>({
  type: OVERLAY.NONE,
  data: null,
});
