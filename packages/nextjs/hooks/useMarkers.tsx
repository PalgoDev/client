import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

const getDefaultMarker = () => {
  const imageUrl = "https://i.giphy.com/qJzZ4APiDZQuJDY7vh.webp";
  const img = document.createElement("img");
  img.src = imageUrl;
  img.width = 36;
  img.height = 36;
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
  useEffect(() => {
    itemCoords.forEach(item => {
      // Create a custom marker element
      const markerElement = getDefaultMarker();

      markerElement.style.cursor = "pointer";

      // Add a click event listener to the marker element
      markerElement.addEventListener("click", () => {
        console.log(`Marker clicked for item: ${item.long} ${item.lat}`);
        alert(`Marker clicked for item: ${item.long} ${item.lat}`);
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
