import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const MapWithGeolocation = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const lastPositionRef = useRef<{ lat: number; lng: number } | null>(null); // Store last position
  const [distanceTraveled, setDistanceTraveled] = useState(0);

  useEffect(() => {
    // Function to calculate the distance between two points (Haversine formula)
    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
      const R = 6371; // Radius of the Earth in km
      const dLat = (lat2 - lat1) * (Math.PI / 180);
      const dLon = (lon2 - lon1) * (Math.PI / 180);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c; // Distance in km
      return distance * 1000; // Convert to meters
    };

    // Initialize the map when the component is mounted
    if (mapRef.current) {
      mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!;
      map.current = new mapboxgl.Map({
        container: mapRef.current!,
        style: "mapbox://styles/mapbox/light-v11",
        zoom: 15.5,
      });

      map.current.on("load", () => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            position => {
              const { latitude, longitude } = position.coords;

              // Log initial position when map is loaded
              console.log("Initial Position:", { lat: latitude, lng: longitude });

              // Set the initial map center to the user's position
              map.current?.setCenter([longitude, latitude]);

              // Add GeolocateControl to track user location
              const geolocateControl = new mapboxgl.GeolocateControl({
                positionOptions: {
                  enableHighAccuracy: true,
                },
                trackUserLocation: true,
                showUserHeading: true,
              });

              // Add the control to the map
              map.current?.addControl(geolocateControl);

              // Set the last position reference
              lastPositionRef.current = { lat: latitude, lng: longitude };
            },
            error => {
              console.error("Error obtaining geolocation:", error);
            },
          );
        }
      });

      // Event listener for user location updates
      map.current.on("geolocate", (event: any) => {
        // toast.info("Getting Location...", { duration: 1000 });
        const { latitude, longitude } = event.target.getCenter();
        if (lastPositionRef.current) {
          const distance = calculateDistance(
            lastPositionRef.current.lat,
            lastPositionRef.current.lng,
            latitude,
            longitude,
          );

          // Log the location every 25 meters the user moves
          if (distance >= 25) {
            // toast.info(`New Location: ${latitude}, ${longitude}`, { duration: 1000 });
            console.log("New Location:", { lat: latitude, lng: longitude });

            // Update the distance traveled and the last position
            setDistanceTraveled(prev => prev + distance);
            lastPositionRef.current = { lat: latitude, lng: longitude };

            // Add a new marker or custom item on the map at the new location
            const marker = new mapboxgl.Marker().setLngLat([longitude, latitude]).addTo(map.current!); // Add the marker to the map

            // Optionally, add a popup to the marker
            marker.setPopup(new mapboxgl.Popup().setText(`Location: ${latitude}, ${longitude}`));
          }
        }
      });
    }

    map.current?.on("style.load", () => {
      const layers = map.current?.getStyle()?.layers;
      if (!layers) return;
      const labelLayerId = layers.find(layer => layer.type === "symbol" && layer.layout?.["text-field"])?.id;

      map.current?.addLayer(
        {
          id: "add-3d-buildings",
          source: "composite",
          "source-layer": "building",
          filter: ["==", "extrude", "true"],
          type: "fill-extrusion",
          minzoom: 15,
          paint: {
            "fill-extrusion-color": [
              "interpolate",
              ["linear"],
              ["get", "height"],
              0,
              "#FFD700",
              50,
              "#FF8C00",
              100,
              "#FF4500",
            ],
            "fill-extrusion-height": ["interpolate", ["linear"], ["zoom"], 15, 0, 15.05, ["get", "height"]],
            "fill-extrusion-base": ["interpolate", ["linear"], ["zoom"], 15, 0, 15.05, ["get", "min_height"]],
            "fill-extrusion-opacity": 0.8,
          },
        },
        labelLayerId,
      );
    });

    return () => {
      // Cleanup when the component is unmounted
      if (map.current) {
        map.current.remove();
      }
    };
  }, []); // Empty dependency array to prevent infinite loop

  useEffect(() => {
    // toast.info(`Distance Traveled: ${distanceTraveled.toFixed(2)} meters`, { duration: 1000 });
  }, [distanceTraveled]);

  return (
    <div>
      <div ref={mapRef} style={{ width: "100%", height: "500px", position: "relative" }} />
      <p>Distance Traveled: {distanceTraveled.toFixed(2)} meters</p>
    </div>
  );
};

export default MapWithGeolocation;
