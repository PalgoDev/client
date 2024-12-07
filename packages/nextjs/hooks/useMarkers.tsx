import { useEffect, useRef } from "react";
import { useSetAtom } from "jotai";
import mapboxgl from "mapbox-gl";
import { overlayAtom } from "~~/state/overlayAtom";
import { OVERLAY } from "~~/types";

const getDefaultMarker = () => {
  const imageUrl =
    "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHNhcHNkaXU0bThkenptcTIyMHc4bWc3NzlvYWg2ZHB0ZDd5a210aSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/ODaa2WYdTZ3sTrXNAT/giphy.webp";
  const img = document.createElement("img");
  img.src = imageUrl;
  img.width = 46;
  img.height = 46;
  img.style.borderRadius = "50%";
  return img;
};

interface UseMarkerProps {
  map: ReturnType<typeof useRef<mapboxgl.Map | null>>;
  itemCoords: {
    long: number;
    lat: number;
  }[];
}
export const useMarkers = ({ map, itemCoords }: UseMarkerProps) => {
  const setOverlayType = useSetAtom(overlayAtom);

  useEffect(() => {
    itemCoords.forEach(item => {
      // Create a custom marker element
      const markerElement = getDefaultMarker();

      markerElement.style.cursor = "pointer";

      // Add a click event listener to the marker element
      markerElement.addEventListener("click", () => {
        setOverlayType({
          type: OVERLAY.CLAIM_ORB, // LATER replace when new types of items are added
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
