import { Shop } from "../types/shop";
import { calculateDistance } from "../utils/geo";

const ShopListComponent = ({
  shop,
  position,
}: {
  shop: Shop;
  position: { latitude: number; longitude: number };
}) => {
  return (
    <div className="bg-[#E6F5F0] px-4 py-3 rounded-lg flex justify-between min-h-[150px]">
      <div className="w-2/3">
        <h1 className="font-semibold text-xl">{shop.title}</h1>
        <p className="text-xs">{shop.description}</p>
        <div className="flex items-center space-x-2 mt-2">
          <p className="text-[#ABABAB] text-xs">
            {calculateDistance(
              shop.longitude,
              shop.latitude,
              position.latitude,
              position.longitude
            )}{" "}
            km
          </p>
          <div className="w-1 h-1 rounded-full bg-[#ABABAB]"></div>
          <p className="text-[#ABABAB] text-xs">Opened until 17:00</p>
        </div>
      </div>
      <div className="w-1/3 items-center justify-end flex flex-col">
        <img src={shop.imageURL} className="rounded-md" />
        <p className="text-[#ABABAB] text-xs">{shop.address}</p>
      </div>
    </div>
  );
};

export default ShopListComponent;
