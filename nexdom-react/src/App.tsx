import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Header } from './components/Header';
import { EntradaSaida } from './components/EntradaSaida';
import { ConsultaTipo } from './components/ConsultaTipo';
import { ConsultaLucro } from './components/ConsultaLucro';

export function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="w-full px-8 py-8">

        <Tabs defaultValue="stock-movement" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="stock-movement">Efetuar Entrada/Saída</TabsTrigger>
            <TabsTrigger value="products-by-type">Consulta de Produtos por Tipo</TabsTrigger>
            <TabsTrigger value="profit-by-product">Consulta de Lucro por Produto</TabsTrigger>
          </TabsList>
          <TabsContent value="stock-movement" className="mt-4 border rounded-md bg-white shadow-sm">
            <EntradaSaida />
          </TabsContent>
          <TabsContent value="products-by-type" className="mt-4 border rounded-md bg-white shadow-sm">
            <ConsultaTipo />
          </TabsContent>
          <TabsContent value="profit-by-product" className="mt-4 border rounded-md bg-white shadow-sm">
            <ConsultaLucro />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

