import { useState } from 'react';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

export function SearchBar() {
  const [searchBarValue, setSearchBarValue] = useState('');
  const selectedCategories = ['Vintage', '€', '€€', "Men's cloting", 'Shoes', "Women's cloting"];
  return (
    <div className="flex flex-col space-y-3 w-full pb-5 px-2">
      <div className="flex w-full space-x-3">
        <Input
          type="email"
          id="email"
          placeholder="Brno"
          className="w-full"
          value={searchBarValue}
          onChange={(e) => setSearchBarValue(e.target.value)}
        />
        <button className="px-2" onClick={() => setSearchBarValue('')}>
          X
        </button>
      </div>
      <div className="flex w-full justify-between px-5 items-center">
        <div className="w-4/5 dark:bg-slate-800 bg-slate-100 rounded-full flex items-center justify-between py-2 px-7">
          <div className="flex justify-evenly w-[90%] lg:w-3/4">
            {selectedCategories.map((item, i) => (
              <Badge className="py-1 min-w-[60px] flex items-center justify-center" key={`searbar_badge_${i}`}>
                {item}
              </Badge>
            ))}
          </div>
          <button className="text-2xl font-bold text-end">+</button>
        </div>
        <Button className="rounded-full px-5">Show as list</Button>
      </div>
    </div>
  );
}
