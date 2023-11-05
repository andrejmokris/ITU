import { LatLngTuple } from "leaflet";
import { FC, useEffect } from "react";
import { useMap } from "react-leaflet";
import { Shop } from "../types/shop";

const MapController: FC<{ selectedShop: Shop }> = ({ selectedShop }) => {
  const map = useMap();
  const flyToDuration = 1.2;

  const flyTo = (location: LatLngTuple) => {
    map.flyTo(location, 17, {
      animate: true,
      duration: flyToDuration,
    });
  };

  const flyToCenter = () => {
    map.flyTo([49.19189685372957, 16.61185116412235], 13, {
      animate: true,
      duration: flyToDuration,
    });
  };

  useEffect(() => {
    if (selectedShop) {
      flyTo([selectedShop.longitude, selectedShop.latitude]);
    } else {
      flyToCenter();
    }
  }, [selectedShop]);

  return null;
};

export { MapController };
