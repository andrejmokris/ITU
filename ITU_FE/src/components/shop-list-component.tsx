/**
 * Author: Veronika Simkova xsimko14
 */

import { useNavigate } from 'react-router-dom';
import { Shop } from '../types/shop';
import { calculateDistance } from '../utils/geo';

const ShopListComponent = ({
  shop,
  position,
  setSelectedShop,
  selectedShop
}: {
  shop: Shop;
  position: {
    latitude: number;
    longitude: number;
  };
  setSelectedShop: (shop: Shop) => void;
  selectedShop: Shop | null;
}) => {
  const navigate = useNavigate();
  return (
    <div
      className={`bg-gray-100 dark:bg-slate-600 px-4 py-3 rounded-lg flex justify-between box-border ${
        selectedShop?.id === shop.id && 'bg-gray-200'
      }`}
      onClick={() => setSelectedShop(shop)}
    >
      <div className="flex w-full">
        <div className="w-2/3 flex flex-col items-start p-3 justify-between">
          <div className="flex flex-col items-start">
            <h1 className="font-semibold text-xl text-center">{shop.title}</h1>
            <p className="text-xs text-left mt-1">{shop.description}</p>
            <div className="flex items-center space-x-2 mt-2">
              <p className="text-[#ABABAB] text-xs">
                {calculateDistance(shop.longitude, shop.latitude, position.latitude, position.longitude)} km
              </p>
              <div className="w-1 h-1 rounded-full bg-[#ABABAB]"></div>
              <p className="text-[#ABABAB] text-xs">Opened until 17:00</p>
            </div>
          </div>
          <div className="flex text-sm space-x-3">
            <p>Like</p>
            <p>Navigate</p>
            <button onClick={() => navigate(`/shop/${shop.id}`)}>Detail</button>
          </div>
        </div>
        <div className="w-1/3 flex flex-col">
          <img src={shop.imageURL} className="rounded-md max-w-[220px]" />
          <p className="text-[#ABABAB] text-xs mt-2">{shop.address}</p>
        </div>
      </div>
    </div>
  );
};

export default ShopListComponent;
