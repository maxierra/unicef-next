'use client';

import { useState } from 'react';
import { exportToCSV } from '../utils/csvExport';
import Table from './Table';

interface DatosResponse {
  // Define la estructura de la respuesta según tu API
  [key: string]: any;
}

// Interfaz compatible con la función exportToCSV
interface DataItem {
  process: string;
  code: string;
  totalQty: number;
  totalAmount: number;
  approvedQty: number;
  approvedAmount: number;
  rejectedQty?: number;
  rejectedAmount?: number;
  month?: string;
  status?: string;
}

export default function DatosForm() {
  const [pais, setPais] = useState('');
  const [periodo, setPeriodo] = useState('');
  const [datos, setDatos] = useState<DatosResponse | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setDatos(null);

    try {
      const response = await fetch(`/api/datos?pais=${pais}&periodo=${periodo}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al obtener los datos');
      }

      setDatos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener los datos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative">
            <label htmlFor="pais" className="block text-sm font-semibold text-gray-700 mb-2">
              País
            </label>
            <div className="relative">
              <select
                id="pais"
                value={pais}
                onChange={(e) => setPais(e.target.value)}
                className="w-full p-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 appearance-none"
                required
              >
                <option value="">Seleccione un país</option>
                <option value="mexico">México</option>
                <option value="ecuador">Ecuador</option>
                <option value="argentina">Argentina</option>
                <option value="uruguay">Uruguay</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          <div className="relative">
            <label htmlFor="periodo" className="block text-sm font-semibold text-gray-700 mb-2">
              Período
            </label>
            <input
              type="text"
              id="periodo"
              value={periodo}
              onChange={(e) => setPeriodo(e.target.value)}
              className="w-full p-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
              placeholder="Ej: 202301"
              required
            />
          </div>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="px-8 py-3 bg-[#00aeef] text-white font-semibold rounded-lg shadow-md hover:bg-[#0095cc] transform hover:scale-105 transition-all duration-200 disabled:bg-gray-400 disabled:transform-none flex items-center space-x-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Procesando...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span>Consultar Datos</span>
              </>
            )}
          </button>
        </div>
      </form>

      {error && (
        <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
          <div className="flex items-center">
            <svg className="h-6 w-6 text-red-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {datos && (
        <div className="mt-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <svg className="w-6 h-6 mr-2 text-[#00aeef]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Resultados del Análisis
            </h2>
            <button
              onClick={() => {
                // Convertir datos a formato DataItem[] antes de exportar
                if (datos) {
                  const formattedData = Array.isArray(datos) ? datos : Object.values(datos);
                  // Asegurarse de que los datos tienen la estructura correcta
                  const validData = formattedData.filter(item => 
                    item && typeof item === 'object' && 'process' in item && 'code' in item
                  );
                  exportToCSV(validData as DataItem[], pais, periodo);
                }
              }}
              className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Descargar CSV</span>
            </button>
          </div>
          <div className="overflow-x-auto">
            {datos && (
              <Table 
                data={Array.isArray(datos) ? datos : Object.values(datos).filter(item => 
                  item && typeof item === 'object' && 'process' in item && 'code' in item
                ) as DataItem[]} 
                country={pais} 
              />
            )}
          </div>
        </div>
      )}

    </div>
  );
}