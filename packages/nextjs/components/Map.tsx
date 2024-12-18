import React, { useEffect, useRef, useState } from "react";
import { MapRenderer } from "./MapRenderer";
import { useAtomValue, useSetAtom } from "jotai";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { fetchTokens } from "~~/actions/fetchTokens";
import { useMarkers } from "~~/hooks/useMarkers";
import { overlayAtom } from "~~/state/overlayAtom";
import { OVERLAY } from "~~/types";

const MapWithGeolocation = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const lastPositionRef = useRef<{ lat: number; lng: number } | null>(null);
  const [distanceTraveled, setDistanceTraveled] = useState(0);
  const [simulatedPosition, setSimulatedPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [joystickOffset, setJoystickOffset] = useState({ x: 0, y: 0 }); // For joystick animation
  const [zoomLevel, setZoomLevel] = useState(17.5); // Map zoom level

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
        zoom: zoomLevel,
        pitch: 75,
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

  const [itemCoords, setItemCoords] = useState<{ type: OVERLAY; long: number; lat: number }[]>([]);

  const handleFetchTokens = async () => {
    console.log("fetching tokens");
    if (lastPositionRef.current) {
      console.log("fetching tokens - 2");
      const res = await fetchTokens({
        long: lastPositionRef.current.lng,
        lat: lastPositionRef.current.lat,
      });
      const itemCoordsToPush: { type: OVERLAY; long: number; lat: number }[] = [];
      res.map((item: any) => {
        itemCoordsToPush.push({ type: item.type, long: item.longitude, lat: item.latitude });
      });
      setItemCoords(itemCoordsToPush);
      console.log(res, "res from fetch tokens");
    }
  };

  useMarkers({ map, itemCoords });

  const ZoomControls = () => {
    const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 1)); // Max zoom level is 22
    const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 1)); // Min zoom level is 0

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "row-reverse",
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
    const handlePointerDown = (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      const isTouch = e.type === "touchstart";
      const event = isTouch ? (e as React.TouchEvent).touches[0] : (e as React.MouseEvent);
      const joystick = e.currentTarget.getBoundingClientRect();
      const centerX = joystick.left + joystick.width / 2;
      const centerY = joystick.top + joystick.height / 2;

      const handlePointerMove = (moveEvent: MouseEvent | TouchEvent) => {
        const isTouchMove = moveEvent.type === "touchmove";
        const pointer = isTouchMove ? (moveEvent as TouchEvent).touches[0] : (moveEvent as MouseEvent);
        const dx = pointer.clientX - centerX;
        const dy = pointer.clientY - centerY;

        const distance = Math.min(0.1, Math.sqrt(dx * dx + dy * dy));
        const angle = Math.atan2(dy, dx);

        setJoystickOffset({
          x: Math.min(40, Math.max(-40, dx)),
          y: Math.min(40, Math.max(-40, dy)),
        });

        handleJoystickMove(distance, angle);
      };

      const handlePointerUp = () => {
        document.removeEventListener(isTouch ? "touchmove" : "mousemove", handlePointerMove);
        document.removeEventListener(isTouch ? "touchend" : "mouseup", handlePointerUp);
        setJoystickOffset({ x: 0, y: 0 });
      };

      document.addEventListener(isTouch ? "touchmove" : "mousemove", handlePointerMove);
      document.addEventListener(isTouch ? "touchend" : "mouseup", handlePointerUp);
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
          zIndex: 1,
          cursor: "grab",
        }}
        onMouseDown={handlePointerDown}
        onTouchStart={handlePointerDown}
      >
        <div
          style={{
            width: "50px",
            height: "50px",
            background: "rgba(0, 0, 0, 0.3)",
            borderRadius: "50%",
            transform: `translate(${joystickOffset.x}px, ${joystickOffset.y}px)`,
            transition: joystickOffset.x === 0 && joystickOffset.y === 0 ? "transform 0.2s ease" : "none",
            overflow: "visible",
            zIndex: 100,
          }}
        ></div>
      </div>
    );
  };

  // Testing button
  // const setOverlay = useSetAtom(overlayAtom);

  return (
    <div className="flex flex-col h-90vh justify-start items-center">
      <MapRenderer mapRef={mapRef} />

      {/* <button
        onClick={() =>
          setOverlay({
            type: OVERLAY.FIGHT,
            data: { long: lastPositionRef.current?.lng!, lat: lastPositionRef.current?.lat! },
          })
        }
      >
        Start a Fight (Simulated)
      </button> */}

      <div className="flex justify-around items-center gap-2 w-full h-[20vh] pb-5">
        <Joystick />
        <ZoomControls />
      </div>
    </div>
  );
};

export default MapWithGeolocation;
