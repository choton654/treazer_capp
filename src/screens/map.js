import mapboxgl from "mapbox-gl/dist/mapbox-gl-csp";
import React, { useEffect, useRef, useState, useContext } from "react";
import { View } from "react-native";
import { LocationContext } from "../context/locationcontext";
// eslint-disable-next-line import/no-webpack-loader-syntax
import MapboxWorker from "worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker";
import "./site.css";

mapboxgl.workerClass = MapboxWorker;
mapboxgl.accessToken =
  "pk.eyJ1IjoidHJlYXplciIsImEiOiJja2xxYXJsZmgwMmJwMnBtaXR0M25leTY5In0.Iaj3HteMWU5ZQWCniy4KRA";

export default function Map() {
  const { state: locationState } = useContext(LocationContext);

  const mapContainer = useRef();
  const [lng, setLng] = useState(locationState.longitude);
  const [lat, setLat] = useState(locationState.latitude);
  const [zoom, setZoom] = useState(9);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng, lat],
      zoom: zoom,
    });

    const nav = new mapboxgl.NavigationControl();
    map.addControl(nav);

    map.on("move", () => {
      setLng(map.getCenter().lng.toFixed(4));
      setLat(map.getCenter().lat.toFixed(4));
      setZoom(map.getZoom().toFixed(2));
    });

    map.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
      })
    );
    return () => map.remove();
  }, []);

  return (
    // eslint-disable-next-line react-native/no-inline-styles
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <div className='sidebar'>
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div>
      <div className='map-container' ref={mapContainer} />
    </View>
  );
}
