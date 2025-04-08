'use client';

import { useMemo } from 'react';
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

interface SummaryCardsProps {
  data: DataItem[];
  country: string;
}

export default function SummaryCards({ data, country }: SummaryCardsProps) {
  const totals = useMemo(() => {
    return data.reduce(
      (acc, item) => ({
        totalQty: acc.totalQty + item.totalQty,
        totalAmount: acc.totalAmount + item.totalAmount,
        approvedQty: acc.approvedQty + item.approvedQty,
        approvedAmount: acc.approvedAmount + item.approvedAmount,
        rejectedQty: acc.rejectedQty + item.rejectedQty,
        rejectedAmount: acc.rejectedAmount + item.rejectedAmount,
      }),
      {
        totalQty: 0,
        totalAmount: 0,
        approvedQty: 0,
        approvedAmount: 0,
        rejectedQty: 0,
        rejectedAmount: 0,
      }
    );
  }, [data]);



  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      <div className="bg-white rounded-lg shadow-md p-6 transform hover:scale-105 transition-transform duration-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Total General</h3>
          <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-gray-600">Cantidad: <span className="font-semibold text-gray-800">{formatNumber(totals.totalQty, country)}</span></p>
          <p className="text-sm text-gray-600">Monto: <span className="font-semibold text-gray-800">{formatCurrency(totals.totalAmount, country)}</span></p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 transform hover:scale-105 transition-transform duration-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-green-700">Total Aprobado</h3>
          <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-gray-600">Cantidad: <span className="font-semibold text-gray-800">{formatNumber(totals.approvedQty, country)}</span></p>
          <p className="text-sm text-gray-600">Monto: <span className="font-semibold text-gray-800">{formatCurrency(totals.approvedAmount, country)}</span></p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 transform hover:scale-105 transition-transform duration-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-red-700">Total Rechazado</h3>
          <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-gray-600">Cantidad: <span className="font-semibold text-gray-800">{formatNumber(totals.rejectedQty, country)}</span></p>
          <p className="text-sm text-gray-600">Monto: <span className="font-semibold text-gray-800">{formatCurrency(totals.rejectedAmount, country)}</span></p>
        </div>
      </div>
    </div>
  );
}