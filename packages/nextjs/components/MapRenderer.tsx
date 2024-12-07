import { useCallback } from "react";
import { ClaimOrb } from "./overlays/ClaimOrb";
import { useAtom, useAtomValue } from "jotai";
import { overlayAtom } from "~~/state/overlayAtom";
import { OVERLAY } from "~~/types";

interface MapRendererProps {
  mapRef: React.MutableRefObject<HTMLDivElement | null>;
}
export const MapRenderer = ({ mapRef }: MapRendererProps) => {
  const [overlay, setOverlay] = useAtom(overlayAtom);

  const isOverlayOpen = overlay.type !== OVERLAY.NONE;

  const renderOverlay = useCallback(() => {
    switch (overlay.type) {
      case OVERLAY.CLAIM_ORB:
        return <ClaimOrb data={overlay.data} />;
      default:
        return null;
    }
  }, []);

  return (
    <>
      {JSON.stringify(overlay)}
      <div
        style={{
          width: "90%",
          height: "70vh",
          borderRadius: "10px",
          marginBottom: "10px",

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
            zIndex: 1,
            transition: "all 0.25s"
          }}
        />

        {isOverlayOpen && (
          <div
            className="absolute top-0 left-0 w-full h-full z-10"
            onClick={() => setOverlay({ type: OVERLAY.NONE, data: null })}
          >
            {renderOverlay()}
          </div>
        )}
      </div>
    </>
  );
};
