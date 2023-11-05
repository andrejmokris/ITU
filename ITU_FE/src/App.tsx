import axios from "axios";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { useQuery } from "react-query";
import { Shop } from "./types/shop";
import { useEffect, useState } from "react";
import ShopListComponent from "./components/shop-list-component";
import { MapController } from "./components/map-controller";

function App() {
  const { data, isLoading, isError } = useQuery({
    queryFn: async () => {
      const apiURL = "http://localhost:3000/api/shops";
      const { data } = await axios.get(apiURL);
      return data as Array<Shop>;
    },
  });

  const [position, setPosition] = useState({ latitude: 0, longitude: 0 });
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function (position) {
        setPosition({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      });
    } else {
      console.log("Geolocation is not available in your browser.");
    }
  }, []);

  if (isLoading) {
    return <div className="font-bold text-center text-2xl">Loading...</div>;
  } else if (isError) {
    return <div className="font-bold text-center text-2xl">Error occured</div>;
  }

  return (
    <div className="flex w-full items-center justify-center h-screen bg-[#18181B]">
      <div className="flex flex-col w-[min(1400px,95%)]">
        <div className="w-full flex">
          <div className="w-1/2 px-3">
            <div className="space-y-2">
              {data?.map((shop) => (
                <ShopListComponent
                  shop={shop}
                  position={position}
                  setSelectedShop={setSelectedShop}
                  selectedShop={selectedShop}
                />
              ))}
            </div>
          </div>
          <div className="w-1/2">
            <MapContainer
              center={[49.19469087608702, 16.61131840963104]}
              zoom={14}
              scrollWheelZoom={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MapController
                // @ts-expect-error test
                selectedShop={selectedShop}
              />
              {data?.map((shop) => (
                <Marker
                  position={[shop.longitude, shop.latitude]}
                  key={`market-${shop.id}`}
                >
                  <Popup>{shop.title}</Popup>
                </Marker>
              ))}
              <Marker
                position={[position.latitude, position.longitude]}
                key={`market-your_location`}
              >
                <Popup>
                  <div className="text-red-500">Your location</div>
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
