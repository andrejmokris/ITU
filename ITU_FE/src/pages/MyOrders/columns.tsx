/**
 * Author: Andrej Mokris xmokri01
 */

import { Button } from '@/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { Order } from './my-orders';

const getTitleAccessorFn = (row: Order) => {
  return row.marketItem.title;
};

const getPriceAccessorFn = (row: Order) => {
  return row.marketItem.price;
};

const getSizeAccessorFn = (row: Order) => {
  return row.marketItem.size;
};

export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: 'title',
    accessorFn: getTitleAccessorFn,
    header: 'Title',
    cell: ({ row }) => <div>{row.getValue('title')}</div>
  },
  {
    accessorKey: 'price',
    accessorFn: getPriceAccessorFn,
    header: 'Price',
    cell: ({ row }) => <div>${row.getValue('price')}</div>
  },
  {
    accessorKey: 'size',
    accessorFn: getSizeAccessorFn,
    header: 'Size',
    cell: ({ row }) => <div>{row.getValue('size')}</div>
  },
  {
    accessorKey: 'purchaseDate',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Purchase date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue('purchaseDate'));
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
      return <div>{formattedDate}</div>;
    }
  }
];
