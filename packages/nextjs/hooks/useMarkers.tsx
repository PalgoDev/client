import { useEffect, useRef } from "react";
import { useSetAtom } from "jotai";
import mapboxgl from "mapbox-gl";
import { IMAGE_URL } from "~~/config";
import { overlayAtom } from "~~/state/overlayAtom";
import { OVERLAY } from "~~/types";

const getDefaultMarker = () => {
  const imageUrl = IMAGE_URL.orb;
  const img = document.createElement("img");
  img.src = imageUrl;
  img.width = 46;
  img.height = 46;
  img.style.borderRadius = "50%";
  return img;
};

const getFightMarker = () => {
  const imageUrl = IMAGE_URL.Not_so_chill_guy;
  const img = document.createElement("img");
  img.src = imageUrl;
  img.width = 46;
  img.height = 46;
  img.style.borderRadius = "50%";
  return img;
};

const getHealMarker = () => {
  const imageUrl = IMAGE_URL.Chill_guy;
  const img = document.createElement("img");
  img.src = imageUrl;
  img.width = 46;
  img.height = 46;
  img.style.borderRadius = "50%";
  return img;
};

const getMarkerByType = (type: OVERLAY) => {
  switch (type) {
    case OVERLAY.FIGHT:
      return getFightMarker();
    case OVERLAY.HEAL:
      return getHealMarker();
    case OVERLAY.CLAIM_ORB:
      return getDefaultMarker();
    default:
      return getDefaultMarker();
  }
};

interface UseMarkerProps {
  map: ReturnType<typeof useRef<mapboxgl.Map | null>>;
  itemCoords: {
    type: OVERLAY;
    long: number;
    lat: number;
  }[];
}
export const useMarkers = ({ map, itemCoords }: UseMarkerProps) => {
  const setOverlayType = useSetAtom(overlayAtom);

  useEffect(() => {
    itemCoords.forEach(item => {
      // Create a custom marker element
      console.log("ITEM TYPE HERE", item.type);
      const markerElement = getMarkerByType(item.type);

      markerElement.style.cursor = "pointer";

      // Add a click event listener to the marker element
      markerElement.addEventListener("click", () => {
        setOverlayType({
          type: item.type,
          data: { long: item.long, lat: item.lat },
        });
      });

      // Create and add the marker to the map
      new mapboxgl.Marker({
        element: markerElement,
      })
        .setLngLat([item.long, item.lat])
        .addTo(map.current!);
    });
  }, [itemCoords]);

  return null;
};
