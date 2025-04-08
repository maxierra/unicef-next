import * as XLSX from 'xlsx';
import { formatCurrency, formatNumber } from './currency';

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

export const exportToCSV = (data: DataItem[], country: string, period: string): void => {
  // Fecha actual para el reporte
  const currentDate = new Date().toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  // Definir las cabeceras
  const headers = [
    'PROCESO',
    'PRESENTACION',
    'CANTIDAD APROBADA',
    'MONTO APROBADO'
  ];

  // Preparar los datos para Excel
  // Preparar los datos y calcular totales
  const rows = data.map(row => [
    row.process,
    row.code,
    formatNumber(row.approvedQty, country),
    formatCurrency(row.approvedAmount, country)
  ]);

  // Calcular totales
  const totalApprovedQty = data.reduce((sum, row) => sum + row.approvedQty, 0);
  const totalApprovedAmount = data.reduce((sum, row) => sum + row.approvedAmount, 0);

  // Agregar fila de totales
  const totalRow = [
    'TOTAL',
    '',
    formatNumber(totalApprovedQty, country),
    formatCurrency(totalApprovedAmount, country)
  ];

  const excelData = [
    headers,
    ...rows,
    totalRow
  ];

  // Crear un nuevo libro de trabajo
  const wb = XLSX.utils.book_new();
  
  // Añadir información de título y fecha antes de los datos
  const titleData = [
    [`REPORTE DE DATOS APROBADOS - ${country.toUpperCase()}`],
    [`Período: ${period}`],
    [`Fecha de generación: ${currentDate}`],
    [] // Fila vacía como separador
  ];
  
  // Combinar los datos del título con los datos de la tabla
  const allData = [...titleData, ...excelData];
  
  const ws = XLSX.utils.aoa_to_sheet(allData);
  
  // Obtener el rango de celdas
  const range = XLSX.utils.decode_range(ws['!ref'] || 'A1:D1');
  const headerRowIndex = titleData.length; // Índice donde comienzan las cabeceras de la tabla

  // Definir estilos mejorados
  const titleStyle = {
    font: { bold: true, size: 14, color: { rgb: '2F5597' } },
    alignment: { horizontal: 'center', vertical: 'center' },
    fill: { fgColor: { rgb: 'E9EFF7' } }
  };

  const subtitleStyle = {
    font: { bold: true, size: 12, color: { rgb: '2F5597' } },
    alignment: { horizontal: 'left' }
  };

  const headerStyle = {
    font: { bold: true, color: { rgb: 'FFFFFF' } },
    alignment: { horizontal: 'center', vertical: 'center' },
    fill: { fgColor: { rgb: '2F5597' } }, // Azul UNICEF
    border: {
      top: { style: 'medium', color: { rgb: '000000' } },
      bottom: { style: 'medium', color: { rgb: '000000' } },
      left: { style: 'medium', color: { rgb: '000000' } },
      right: { style: 'medium', color: { rgb: '000000' } }
    }
  };

  const cellStyle = {
    alignment: { vertical: 'center' },
    border: {
      top: { style: 'thin', color: { rgb: 'CCCCCC' } },
      bottom: { style: 'thin', color: { rgb: 'CCCCCC' } },
      left: { style: 'thin', color: { rgb: 'CCCCCC' } },
      right: { style: 'thin', color: { rgb: 'CCCCCC' } }
    }
  };

  const numericCellStyle = {
    ...cellStyle,
    alignment: { horizontal: 'right', vertical: 'center' }
  };

  const totalRowStyle = {
    font: { bold: true },
    alignment: { horizontal: 'right', vertical: 'center' },
    fill: { fgColor: { rgb: 'E9EFF7' } },
    border: {
      top: { style: 'medium', color: { rgb: '000000' } },
      bottom: { style: 'medium', color: { rgb: '000000' } },
      left: { style: 'thin', color: { rgb: 'CCCCCC' } },
      right: { style: 'thin', color: { rgb: 'CCCCCC' } }
    }
  };

  const totalValueStyle = {
    ...totalRowStyle,
    font: { bold: true, color: { rgb: '2F5597' } },
    alignment: { horizontal: 'right', vertical: 'center' }
  };

  // Función auxiliar para aplicar estilos de manera segura
  const applyStyle = (cellRef: string, style: any) => {
    if (!ws[cellRef]) {
      ws[cellRef] = { v: '', t: 's' };
    }
    ws[cellRef].s = style;
  };

  // Aplicar estilos a todas las celdas
  for (let row = range.s.r; row <= range.e.r; row++) {
    for (let col = range.s.c; col <= range.e.c; col++) {
      const cellRef = XLSX.utils.encode_cell({ r: row, c: col });
      
      // Aplicar estilos según el tipo de fila
      if (row === 0) {
        // Título principal
        applyStyle(cellRef, titleStyle);
      } else if (row > 0 && row < 3) {
        // Subtítulos (período y fecha)
        applyStyle(cellRef, subtitleStyle);
      } else if (row === headerRowIndex) {
        // Cabeceras de la tabla
        applyStyle(cellRef, headerStyle);
      } else if (row === range.e.r) {
        // Fila de totales
        if (col <= 1) {
          applyStyle(cellRef, totalRowStyle);
        } else {
          applyStyle(cellRef, totalValueStyle);
        }
      } else if (row > headerRowIndex) {
        // Celdas de datos
        if (col >= 2) { // Columnas numéricas
          applyStyle(cellRef, numericCellStyle);
        } else {
          applyStyle(cellRef, cellStyle);
        }
      }
    }
  }
  
  // Combinar celdas para el título
  ws['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 3 } }, // Título principal
    { s: { r: 1, c: 0 }, e: { r: 1, c: 3 } }, // Período
    { s: { r: 2, c: 0 }, e: { r: 2, c: 3 } }  // Fecha
  ];

  // Ajustar el ancho de las columnas
  ws['!cols'] = [
    { wch: 30 }, // PROCESO
    { wch: 25 }, // PRESENTACION
    { wch: 20 }, // CANTIDAD APROBADA
    { wch: 20 }  // MONTO APROBADO
  ];
  
  // Ajustar altura de filas
  ws['!rows'] = [
    { hpt: 30 }, // Título
    { hpt: 25 }, // Período
    { hpt: 25 }, // Fecha
    { hpt: 5 },  // Separador
    { hpt: 25 }  // Cabeceras
  ];

  // Agregar la hoja al libro
  XLSX.utils.book_append_sheet(wb, ws, `Datos ${country} - ${period}`);

  // Generar y descargar el archivo con un nombre más profesional
  const formattedDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  XLSX.writeFile(wb, `Reporte_Aprobados_${country.toUpperCase()}_${period}_${formattedDate}.xlsx`);
};