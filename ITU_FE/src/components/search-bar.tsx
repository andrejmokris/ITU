import { useEffect, useState } from 'react';
import { Input } from './ui/input';
import { useQuery } from 'react-query';
import { api_client } from '@/utils/api-client';
import { MultiSelect } from './ui/multi-select';
import { useSearchParams } from 'react-router-dom';
import { Checkbox } from '@/components/ui/checkbox';

export function SearchBar() {
  const [selected, setSelected] = useState<string[]>([]);
  const [searchParams, setSearchParams] = useSearchParams({ q: '', tags: [], followed: 'false' });

  const { data: tagData } = useQuery({
    queryKey: 'tagsQuery',
    queryFn: async () => {
      const { data } = await api_client.get('tags', {
        withCredentials: true
      });
      return data as Array<{ id: number; title: string }>;
    }
  });

  const q = searchParams.get('q');
  const followed = searchParams.get('followed');

  useEffect(() => {
    const transferID: number[] = [];

    selected.forEach((element) => {
      const found_item = tagData?.find((tag) => tag.title === element);
      if (found_item) {
        transferID.push(found_item.id);
      }
    });

    setSearchParams((prev) => {
      prev.set('tags', String(transferID));
      return prev;
    });
  }, [selected, setSearchParams, tagData]);

  return (
    <div className="flex flex-col space-y-3 w-full pb-5 px-2">
      <div className="flex w-full space-x-3">
        <Input
          type="email"
          id="email"
          placeholder="Brno"
          className="w-1/2"
          // @ts-expect-error param will be found
          value={q}
          onChange={(e) =>
            setSearchParams((prev) => {
              prev.set('q', e.target.value);
              return prev;
            })
          }
        />
        {tagData && (
          <div className="w-1/2">
            <MultiSelect
              options={tagData?.map((item) => {
                return {
                  value: item.title,
                  label: item.title
                };
              })}
              selected={selected}
              onChange={setSelected}
            />
          </div>
        )}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="terms"
            onCheckedChange={() => {
              setSearchParams((prev) => {
                prev.set('followed', prev.get('followed') === 'true' ? 'false' : 'true');
                return prev;
              });
            }}
            checked={followed === 'true'}
          />
          <label
            htmlFor="terms"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Show followed
          </label>
        </div>
      </div>
    </div>
  );
}
