import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { fetchTokens } from "~~/actions/fetchTokens";

const MapWithGeolocation = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const lastPositionRef = useRef<{ lat: number; lng: number } | null>(null);
  const [distanceTraveled, setDistanceTraveled] = useState(0);
  const [simulatedPosition, setSimulatedPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [joystickOffset, setJoystickOffset] = useState({ x: 0, y: 0 }); // For joystick animation
  const [zoomLevel, setZoomLevel] = useState(15.5); // Map zoom level

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

  const calculateNewPosition = (lat: number, lng: number, distance: number, angle: number) => {
    const R = 6378137; // Earth's radius in meters
    const dLat = (distance * Math.cos(angle)) / R;
    const dLng = (distance * Math.sin(angle)) / (R * Math.cos((lat * Math.PI) / 180));

    const newLat = lat + (dLat * 180) / Math.PI;
    const newLng = lng + (dLng * 180) / Math.PI;

    return { lat: newLat, lng: newLng };
  };

  const handleJoystickMove = (distance: number, angle: number) => {
    if (lastPositionRef.current) {
      const { lat, lng } = lastPositionRef.current;
      const newPosition = calculateNewPosition(lat, lng, distance, angle);
      setSimulatedPosition(newPosition);

      const traveled = calculateDistance(lat, lng, newPosition.lat, newPosition.lng);
      setDistanceTraveled(prev => prev + traveled);
    }
  };

  useEffect(() => {
    if (mapRef.current) {
      mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!;
      map.current = new mapboxgl.Map({
        container: mapRef.current!,
        style: "mapbox://styles/mapbox/light-v11",
        zoom: zoomLevel,
      });

      map.current?.on("style.load", () => {
        const layers = map.current?.getStyle()?.layers;
        if (!layers) return;
        const labelLayerId = layers.find(layer => layer.type === "symbol" && layer.layout?.["text-field"])?.id;

        map.current?.addLayer(
          {
            id: "add-3d-buildings-" + Math.random(),
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
                "#FFD700", // Gold for smaller buildings
                50,
                "#FF8C00", // Dark orange for medium buildings
                100,
                "#FF4500", // Red for taller buildings
              ],
              "fill-extrusion-height": ["interpolate", ["linear"], ["zoom"], 15, 0, 15.05, ["get", "height"]],
              "fill-extrusion-base": ["interpolate", ["linear"], ["zoom"], 15, 0, 15.05, ["get", "min_height"]],
              "fill-extrusion-opacity": 0.8,
            },
          },
          labelLayerId,
        );
      });

      map.current.on("load", () => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            position => {
              const { latitude, longitude } = position.coords;

              map.current?.setCenter([longitude, latitude]);

              const marker = new mapboxgl.Marker().setLngLat([longitude, latitude]).addTo(map.current!);
              markerRef.current = marker;

              lastPositionRef.current = { lat: latitude, lng: longitude };
              handleFetchTokens();
            },
            error => {
              console.error("Error obtaining geolocation:", error);
            },
          );
        }
      });
    }

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (simulatedPosition && lastPositionRef.current && map.current) {
      const { lat, lng } = simulatedPosition;

      // Update marker position
      if (markerRef.current) {
        markerRef.current.setLngLat([lng, lat]);
      }

      // Update Mapbox's blue location pointer
      map.current.setCenter([lng, lat]);

      // Update last known position reference
      lastPositionRef.current = { lat, lng };
    }
  }, [simulatedPosition]);

  useEffect(() => {
    if (map.current) {
      map.current.setZoom(zoomLevel);
    }
  }, [zoomLevel]);

  const [itemCoords, setItemCoords] = useState<{ long: number; lat: number }[]>([]);

  const handleFetchTokens = async () => {
    console.log("fetching tokens");
    if (lastPositionRef.current) {
      console.log("fetching tokens - 2");
      const res = await fetchTokens({
        long: lastPositionRef.current.lng,
        lat: lastPositionRef.current.lat,
      });
      const itemCoordsToPush: { long: number; lat: number }[] = [];
      res.map((item: any) => {
        itemCoordsToPush.push({ long: item.longitude, lat: item.latitude });
      });
      setItemCoords(itemCoordsToPush);
      console.log(res, "res from fetch tokens");
    }
  };

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

  const ZoomControls = () => {
    const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 1)); // Max zoom level is 22
    const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 1)); // Min zoom level is 0

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <button
          style={{
            width: "40px",
            height: "40px",
            background: "rgba(0, 0, 0, 0.7)",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
          onClick={handleZoomIn}
        >
          +
        </button>
        <button
          style={{
            width: "40px",
            height: "40px",
            background: "rgba(0, 0, 0, 0.7)",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
          onClick={handleZoomOut}
        >
          -
        </button>
      </div>
    );
  };

  const Joystick = () => {
    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      const joystick = e.currentTarget.getBoundingClientRect();
      const centerX = joystick.left + joystick.width / 2;
      const centerY = joystick.top + joystick.height / 2;

      const onMouseMove = (event: MouseEvent) => {
        const dx = event.clientX - centerX;
        const dy = event.clientY - centerY;

        const distance = Math.min(0.1, Math.sqrt(dx * dx + dy * dy));
        const angle = Math.atan2(dy, dx);

        // Update joystick offset for animation
        setJoystickOffset({
          x: Math.min(40, Math.max(-40, dx)),
          y: Math.min(40, Math.max(-40, dy)),
        });

        handleJoystickMove(distance, angle);
      };

      const onMouseUp = () => {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);

        // Reset joystick offset
        setJoystickOffset({ x: 0, y: 0 });
      };

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    };

    return (
      <div
        style={{
          width: "100px",
          height: "100px",
          background: "rgba(0, 0, 0, 0.1)",
          borderRadius: "50%",

          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10,
          cursor: "grab",
        }}
        onMouseDown={handleMouseDown}
      >
        <div
          style={{
            width: "50px",
            height: "50px",
            background: "rgba(0, 0, 0, 0.3)",
            borderRadius: "50%",
            transform: `translate(${joystickOffset.x}px, ${joystickOffset.y}px)`,
            transition: joystickOffset.x === 0 && joystickOffset.y === 0 ? "transform 0.2s ease" : "none",
          }}
        ></div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-90vh justify-start items-center">
      <div ref={mapRef} style={{ width: "90%", height: "70vh", borderRadius: "10px", marginBottom: "10px" }} />
      <div className="flex justify-around items-center gap-4 w-full h-[20vh]">
        <Joystick />
        <ZoomControls />
      </div>
    </div>
  );
};

export default MapWithGeolocation;
