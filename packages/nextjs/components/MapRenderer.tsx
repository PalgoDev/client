import { useCallback } from "react";
import { ClaimOrb } from "./overlays/ClaimOrb";
import { FightScene } from "./overlays/FightScene";
import { useAtom, useAtomValue } from "jotai";
import { overlayAtom } from "~~/state/overlayAtom";
import { OVERLAY } from "~~/types";
import { Heal } from "./overlays/Heal";

interface MapRendererProps {
  mapRef: React.MutableRefObject<HTMLDivElement | null>;
}
export const MapRenderer = ({ mapRef }: MapRendererProps) => {
  const [overlay, setOverlay] = useAtom(overlayAtom);

  const isOverlayOpen = overlay.type !== OVERLAY.NONE;

  const onDismissOverlay = useCallback(() => {
    setOverlay({ type: OVERLAY.NONE, data: null });
  }, [setOverlay]);

  const renderOverlay = useCallback(() => {
    switch (overlay.type) {
      case OVERLAY.FIGHT:
        return <FightScene data={overlay.data} onDismiss={onDismissOverlay} />;
      case OVERLAY.HEAL:
        return <Heal data={overlay.data} onDismiss={onDismissOverlay} />;
      case OVERLAY.CLAIM_ORB:
        return <ClaimOrb data={overlay.data} onDismiss={onDismissOverlay} />;
      default:
        return null;
    }
  }, [overlay]);

  return (
    <>
      <div
        style={{
          width: "90%",
          height: "65vh",
          borderRadius: "10px",
          margin: "5px 0",
          border: "2px solid white",
          position: "relative",
        }}
      >
        <div
          ref={mapRef}
          style={{
            height: "100%",
            width: "100%",
            borderRadius: "10px",
            filter: isOverlayOpen ? "blur(5px)" : "none",
            pointerEvents: isOverlayOpen ? "none" : "auto",
            userSelect: isOverlayOpen ? "none" : "auto",

            position: "relative",
            // zIndex: 1,
            transition: "all 0.25s ease-in-out",
          }}
        />

        {isOverlayOpen && (
          <div className="absolute top-0 left-0 w-full h-full z-10 grid place-items-center">
            <div className="w-full h-full xl:w-3/4 grid place-items-center fade-in transition-all">
              {renderOverlay()}
            </div>
          </div>
        )}
      </div>
    </>
  );
};
