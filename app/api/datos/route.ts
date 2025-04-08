import { NextResponse } from 'next/server';
import axios from 'axios';
import https from 'https';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const pais = searchParams.get('pais');
    const periodo = searchParams.get('periodo');

    if (!pais || !periodo) {
        return NextResponse.json(
            { error: 'Se requieren los parámetros pais y periodo' },
            { status: 400 }
        );
    }

    const apiUrl = `https://debitosautomaticos.bizland.tech/api/v2/presentation/periodo/${periodo}`;
    
    const headers: { Authorization?: string } = {};
    if (pais === 'ecuador') {
        headers['Authorization'] = 'ApiKey a73a0217-6334-4231-a788-c05b6819bc84';
    } else if (pais === 'argentina') {
        headers['Authorization'] = 'ApiKey beb7a2207fa54dcaa8d29d4ca6b5476a';
    } else if (pais === 'uruguay') {
        headers['Authorization'] = 'ApiKey 83f850c3-dae2-4c5f-8b5f-96a81675cd69';
    } else if (pais === 'mexico') {
        headers['Authorization'] = 'ApiKey b653690e-e6da-4494-b7d5-34e11881bcd4';
    } else {
        return NextResponse.json(
            { error: 'País no válido. Debe ser ecuador, argentina, uruguay o méxico' },
            { status: 400 }
        );
    }

    const agent = new https.Agent({
        rejectUnauthorized: false
    });

    try {
        const response = await axios.get(apiUrl, {
            headers: headers,
            params: {
                pais: pais
            },
            httpsAgent: agent
        });
        
        return NextResponse.json(response.data);
    } catch (error) {
        console.error('Error al hacer la llamada a la API:', error);
        return NextResponse.json(
            { error: 'Error al obtener datos de la API' },
            { status: 500 }
        );
    }
}