import DatosForm from './components/DatosForm';

export default function Home() {
  return (
    <div className="px-8">
      <div className="bg-white rounded-lg shadow-xl p-8 mb-8">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-4">Panel de Control UNICEF</h1>
        <p className="text-center text-gray-600 text-lg mb-8">Acceda a la información detallada de las operaciones por país y período</p>
        <div className="w-full bg-blue-50 rounded-lg p-6 border border-blue-100">
          <DatosForm />
        </div>
      </div>
    </div>
  );
}