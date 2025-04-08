'use client';

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
} from '@tanstack/react-table';
import { useState } from 'react';
import SummaryCards from './SummaryCards';
import { formatCurrency, formatNumber } from '../utils/currency';

interface DataItem {
  code: string;
  process: string;
  month: string;
  totalQty: number;
  totalAmount: number;
  approvedQty: number;
  approvedAmount: number;
  rejectedQty: number;
  rejectedAmount: number;
  status: string;
}

interface TableProps {
  data: DataItem[];
  country: string;
}

export default function Table({ data, country }: TableProps) {

  const [sorting, setSorting] = useState<SortingState>([]);
  const columnHelper = createColumnHelper<DataItem>();

  const columns = [
    columnHelper.accessor('status', {
      header: 'Estado',
      cell: (info) => {
        const statusValue = info.getValue();
        // Convertir a minúsculas para la comparación
        const status = typeof statusValue === 'string' ? statusValue.toLowerCase() : '';
        let statusClass = '';
        let displayText = statusValue || '';
        
        // Añadir clases de color según el estado
        if (status === 'open' || status === 'abierto') {
          statusClass = 'bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-medium';
        } else if (status === 'presented' || status === 'presentado') {
          statusClass = 'bg-red-100 text-red-800 px-2 py-1 rounded-full font-medium';
        } else if (status === 'finished' || status === 'finalizado') {
          statusClass = 'bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium';
        }
        
        return <span className={statusClass}>{displayText}</span>;
      },
    }),
    columnHelper.accessor('code', {
      header: 'Código',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('process', {
      header: 'Proceso',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('month', {
      header: 'Mes',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('totalQty', {
      header: 'Cantidad Total',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('totalAmount', {
      header: 'Monto Total',
      cell: (info) => formatCurrency(info.getValue(), country),
    }),
    columnHelper.accessor('approvedQty', {
      header: 'Cantidad Aprobada',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('approvedAmount', {
      header: 'Monto Aprobado',
      cell: (info) => formatCurrency(info.getValue(), country),
    }),
    columnHelper.accessor('rejectedQty', {
      header: 'Cantidad Rechazada',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('rejectedAmount', {
      header: 'Monto Rechazado',
      cell: (info) => formatCurrency(info.getValue(), country),
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="w-full">
      <SummaryCards data={data} country={country} />
      <table className="w-full bg-white">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-8 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-200 whitespace-nowrap border-b"
                  onClick={header.column.getToggleSortingHandler()}
                >
                  <div className="flex items-center space-x-1">
                    <span>{flexRender(header.column.columnDef.header, header.getContext())}</span>
                    <span className="text-gray-400">
                      {header.column.getIsSorted() ? (
                        header.column.getIsSorted() === 'desc' ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                        )
                      ) : (
                        <svg className="w-4 h-4 opacity-0 group-hover:opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                        </svg>
                      )}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y divide-gray-200">
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="hover:bg-blue-50 transition-colors duration-200">
              {row.getVisibleCells().map((cell) => {
                const value = cell.getValue();
                const isNumeric = typeof value === 'number';
                return (
                  <td
                    key={cell.id}
                    className={`px-8 py-4 text-sm ${isNumeric ? 'text-right font-medium text-gray-900' : 'text-gray-600'} whitespace-nowrap border-b`}
                  >
                    {isNumeric ? (
                      cell.column.id.toLowerCase().includes('amount') ?
                        formatCurrency(value as number, country) :
                        formatNumber(value as number, country)
                    ) : (
                      flexRender(cell.column.columnDef.cell, cell.getContext())
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}