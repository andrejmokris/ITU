import { Avatar, AvatarFallback } from '../ui/avatar';
import { Icons } from '../ui/icons';

export function ReviewCard() {
  return (
    <div className="bg-[#ABABAB] w-full rounded-xl px-4 py-3">
      <div className="flex justify-between">
        <div className="flex items-center space-x-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback>A</AvatarFallback>
          </Avatar>
          <div className="text-xs">
            <p className="font-semibold text-black">Andrej Mokris</p>
            <p className="text-gray-200">Nov 5, 2023</p>
          </div>
        </div>
        <div className=" bg-white rounded-full flex text-black px-2 items-center">
          <Icons.star className="h-[15px]" />
          <Icons.star className="h-[15px]" />
          <Icons.star className="h-[15px]" />
          <Icons.star className="h-[15px]" />
          <Icons.uncheckedStar className="h-[17px]" />
        </div>
      </div>
      <p className="mt-3 text-[15px] text-black">
        I appreciate the wide selection of menswear in this store. The clothes were in great condition and the personnel
        was friendly. I will definitely visit again.
      </p>
    </div>
  );
}
