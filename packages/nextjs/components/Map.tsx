import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const MapboxExample = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    mapboxgl.accessToken = "pk.eyJ1IjoiamF5bWFsdmUiLCJhIjoiY200ZDM2bjk5MGdzNzJxcHdqajZrenFqYSJ9.KPPMenZ_kMcRaF3lnV2F3Q";

    const map = (mapRef.current = new mapboxgl.Map({
      style: "mapbox://styles/mapbox/light-v11",
      center: [-74.0066, 40.7135],
      zoom: 15.5,
      pitch: 45,
      bearing: -17.6,
      container: "map",
      antialias: true,
    }));

    map.on("style.load", () => {
      const layers = map.getStyle()?.layers;
      if (!layers) return;
      const labelLayerId = layers.find(layer => layer.type === "symbol" && layer.layout?.["text-field"])?.id;

      map.addLayer(
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

    // return () => mapRef.current?.remove();
  }, []);

  return <div id="map" ref={mapContainerRef} style={{ height: "500px", width: "100%" }}></div>;
};

export default MapboxExample;
