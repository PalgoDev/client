import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { fetchTokens } from "~~/actions/fetchTokens";

interface UseMarkerProps {
  map: ReturnType<typeof useRef<mapboxgl.Map | null>>;
  itemCoords: {
    long: number;
    lat: number;
  }[];
}
export const useMarkers = ({ map, itemCoords }: UseMarkerProps) => {
  useEffect(() => {
    itemCoords.forEach(item => {
      // Create a custom marker element
      const markerDiv = document.createElement("div");
      markerDiv.innerHTML = `
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="red"
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="10" />
        </svg>
      `;
      markerDiv.style.cursor = "pointer";

      // Add a click event listener to the marker element
      markerDiv.addEventListener("click", () => {
        console.log(`Marker clicked for item: ${item.long} ${item.lat}`);
        alert(`Marker clicked for item: ${item.long} ${item.lat}`);
      });

      // Create and add the marker to the map
      new mapboxgl.Marker({
        element: markerDiv,
      })
        .setLngLat([item.long, item.lat])
        .addTo(map.current!);
    });
  }, [itemCoords]);

  return null;
};
