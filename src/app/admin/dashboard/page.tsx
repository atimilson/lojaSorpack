'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { jwtDecode } from "jwt-decode";
import { 
  ArrowLeftIcon, 
  CalendarIcon, 
  ArrowPathIcon,
  DocumentChartBarIcon,
  ShoppingBagIcon,
  ClockIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  EyeIcon,
  EyeSlashIcon,
  TagIcon,
  TruckIcon,
  ChartBarIcon,
  ChartPieIcon,
  ArrowTrendingUpIcon,
  ViewColumnsIcon,
  CogIcon
} from '@heroicons/react/24/outline';
import { 
  ChartBarIcon as ChartBarSolidIcon,
  ArrowTrendingUpIcon as ChartLineSolidIcon,
  ChartPieIcon as ChartPieSolidIcon,
  ViewColumnsIcon as ViewColumnsSolidIcon
} from '@heroicons/react/24/solid';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths, getYear, getMonth, setMonth, setYear } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import axiosInstance from '@/api/axios-instance';
import Loading from '@/components/Loading';
import toast from 'react-hot-toast';
import { useAuth } from "@/contexts/AuthContext";
import { Switch } from "@/components/ui/switch";

// Componente de seleção de mês/ano
const MonthYearPicker = ({ 
  currentDate, 
  onMonthChange, 
  onYearChange 
}: { 
  currentDate: Date, 
  onMonthChange: (month: number) => void, 
  onYearChange: (year: number) => void 
}) => {
  const currentMonth = getMonth(currentDate);
  const currentYear = getYear(currentDate);

  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  // Gera uma lista de anos (5 anos para trás até 2 anos para frente)
  const years = Array.from({ length: 8 }, (_, i) => currentYear - 5 + i);

  return (
    <div className="flex gap-4 items-center">
      <div className="flex flex-col">
        <label className="text-sm text-gray-600 mb-1">Mês</label>
        <select 
          className="p-2 border border-gray-300 rounded-md"
          value={currentMonth}
          onChange={(e) => onMonthChange(Number(e.target.value))}
        >
          {months.map((month, index) => (
            <option key={month} value={index}>{month}</option>
          ))}
        </select>
      </div>
      <div className="flex flex-col">
        <label className="text-sm text-gray-600 mb-1">Ano</label>
        <select 
          className="p-2 border border-gray-300 rounded-md"
          value={currentYear}
          onChange={(e) => onYearChange(Number(e.target.value))}
        >
          {years.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

// Componente de Card de Estatísticas
const StatCard = ({ 
  title, 
  value, 
  icon, 
  bgColor
}: { 
  title: string, 
  value: string | number, 
  icon: React.ReactNode,
  bgColor: string 
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 flex items-center">
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center mr-4 ${bgColor}`}>
        {icon}
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
};

// Componente do gráfico
const ChartCard = ({
  title,
  data,
  color,
  icon
}: {
  title: string,
  data: any[],
  color: string,
  icon: React.ReactNode
}) => {
  // Estado para controlar o tipo de gráfico
  const [chartType, setChartType] = useState<'line' | 'bar' | 'area' | 'radar'>('line');
  
  // Mapeamento direto de cores do Tailwind para valores hexadecimais
  const colorMap: {[key: string]: string} = {
    'text-indigo-600': '#4f46e5',
    'text-green-600': '#10b981',
    'text-amber-600': '#f59e0b',
    'text-blue-600': '#3b82f6',
    'text-red-600': '#dc2626'
  };

  // Obtenha a cor correta do mapa ou use a cor padrão
  const strokeColor = colorMap[color] || '#4f46e5';
  const bgColorClass = color.replace('text-', 'bg-').replace('600', '100');

  // Função para renderizar o gráfico com base no tipo selecionado
  const renderChart = () => {
    switch(chartType) {
      case 'line':
        return (
          <LineChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="data" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="valor" 
              name={title}
              stroke={strokeColor}
              strokeWidth={2}
              activeDot={{ r: 8 }} 
            />
          </LineChart>
        );
      case 'bar':
        return (
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="data" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar 
              dataKey="valor" 
              name={title} 
              fill={strokeColor} 
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        );
      case 'area':
        return (
          <AreaChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="data" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="valor" 
              name={title} 
              stroke={strokeColor} 
              fill={`${strokeColor}40`} // Com 25% de opacidade
            />
          </AreaChart>
        );
      case 'radar':
        // Preparar dados para o gráfico de radar
        // Limitar para mostrar no máximo 8 pontos de dados para evitar sobrecarga visual
        const radarData = data.length > 8 
          ? data.filter((_, i) => i % Math.ceil(data.length / 8) === 0).slice(0, 8)
          : data;
          
        // Transformar os dados para mostrar múltiplas séries no radar
        // Para radar, precisamos de uma estrutura diferente
        const processedRadarData = radarData.map(item => ({
          subject: item.data.length > 10 ? item.data.substring(0, 10) + '...' : item.data,
          [`${title}`]: item.valor,
          fullMark: Math.max(...data.map(d => d.valor)) * 1.2 // Valor máximo com 20% de margem
        }));
        
        return (
          <RadarChart 
            outerRadius={130} 
            width={500} 
            height={300}
            data={processedRadarData}
            margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
          >
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" />
            <PolarRadiusAxis angle={30} domain={[0, 'auto']} />
            <Radar 
              name={title} 
              dataKey={`${title}`} 
              stroke={strokeColor} 
              fill={`${strokeColor}40`} 
              fillOpacity={0.6} 
            />
            <Tooltip />
            <Legend />
          </RadarChart>
        );
      default:
        // Como fallback, retornar o gráfico de linha (padrão)
        return (
          <LineChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="data" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="valor" 
              name={title}
              stroke={strokeColor}
              strokeWidth={2}
              activeDot={{ r: 8 }} 
            />
          </LineChart>
        );
    }
  };

  // Função para renderizar o botão do tipo de gráfico
  const ChartTypeButton = ({ type, label, icon, activeIcon }: { 
    type: 'line' | 'bar' | 'area' | 'radar', 
    label: string,
    icon: React.ReactNode,
    activeIcon: React.ReactNode 
  }) => {
    const isActive = chartType === type;
    
    return (
      <div className="relative group">
        <button
          onClick={() => setChartType(type)}
          className={`p-2 rounded-md transition-all duration-200 ${
            isActive 
              ? `bg-${color.split('-')[1]}-100 text-${color.split('-')[1]}-600` 
              : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
          }`}
          title={`Gráfico de ${label}`}
        >
          {isActive ? activeIcon : icon}
        </button>
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 -translate-y-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-800 text-white text-xs rounded py-1 px-2 pointer-events-none whitespace-nowrap">
          {label}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${bgColorClass}`}>
            {icon}
          </div>
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        </div>
        <div className="flex items-center">
          <div className="bg-gray-100 p-1 rounded-lg flex space-x-1">
            <ChartTypeButton 
              type="line" 
              label="Linha" 
              icon={<ArrowTrendingUpIcon className="w-5 h-5" />}
              activeIcon={<ChartLineSolidIcon className="w-5 h-5" />}
            />
            <ChartTypeButton 
              type="bar" 
              label="Barra" 
              icon={<ChartBarIcon className="w-5 h-5" />}
              activeIcon={<ChartBarSolidIcon className="w-5 h-5" />}
            />
            <ChartTypeButton 
              type="area" 
              label="Área" 
              icon={<ArrowTrendingUpIcon className="w-5 h-5" />}
              activeIcon={<ChartLineSolidIcon className="w-5 h-5" />}
            />
            <ChartTypeButton 
              type="radar" 
              label="Radar" 
              icon={<ViewColumnsIcon className="w-5 h-5" />}
              activeIcon={<ViewColumnsSolidIcon className="w-5 h-5" />}
            />
          </div>
        </div>
      </div>
      
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Componente de configuração toggle
const ConfigToggle = ({
  title,
  description,
  value,
  onChange,
  icon
}: {
  title: string,
  description: string,
  value: boolean,
  onChange: (newValue: boolean) => void,
  icon: React.ReactNode
}) => {
  return (
    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
      <div className="flex items-start gap-3">
        <div className="mt-1 bg-gray-100 p-2 rounded-lg">
          {icon}
        </div>
        <div>
          <h3 className="font-medium text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        </div>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input 
          type="checkbox" 
          className="sr-only peer"
          checked={value}
          onChange={(e) => onChange(e.target.checked)}
        />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
      </label>
    </div>
  );
};

// Funções para geração de dados mockados
const generateDailyData = (startDate: Date, endDate: Date, type: string) => {
  const days = eachDayOfInterval({ start: startDate, end: endDate });
  
  // Limitar os dados diários para evitar muitas fatias no gráfico de pizza
  const limitedDays = days.length > 10 && type === 'consultas' 
    ? days.filter((_, i) => i % 3 === 0) // Pegar apenas um a cada três dias para o gráfico de pizza
    : days;
  
  return limitedDays.map(day => {
    let value = 0;
    
    switch(type) {
      case 'pedidos_fechados':
        // Pedidos fechados tendem a ter um padrão crescente com variações de fim de semana
        value = Math.floor(Math.random() * 15) + 5 + (day.getDate() * 0.5);
        break;
      case 'pedidos_pendentes':
        // Pedidos pendentes flutuam mais aleatoriamente
        value = Math.floor(Math.random() * 10) + 1;
        break;
      case 'clientes_cadastrados':
        // Novos clientes geralmente têm picos em alguns dias
        value = Math.floor(Math.random() * 8) + (day.getDay() === 1 ? 8 : 2); // Mais cadastros na segunda
        break;
      case 'consultas':
      default:
        // Consultas seguem um padrão com mais atividade no meio da semana
        value = Math.floor(Math.random() * 30) + 10 + (day.getDay() > 1 && day.getDay() < 6 ? 15 : 5);
        break;
    }
    
    return {
      data: format(day, 'dd/MM/yyyy'),
      valor: value
    };
  });
};

const generateMonthlyData = (year: number, type: string) => {
  return Array.from({ length: 12 }, (_, i) => {
    const month = i;
    let value = 0;
    
    switch(type) {
      case 'pedidos_fechados':
        // Tendência sazonal para pedidos fechados
        value = Math.floor(Math.random() * 300) + 100 + ((month === 10 || month === 11) ? 200 : 0); // Mais no fim do ano
        break;
      case 'pedidos_pendentes':
        value = Math.floor(Math.random() * 100) + 20;
        break;
      case 'clientes_cadastrados':
        value = Math.floor(Math.random() * 200) + 50 + ((month === 0) ? 100 : 0); // Mais no início do ano
        break;
      case 'consultas':
      default:
        value = Math.floor(Math.random() * 800) + 200;
        break;
    }
    
    return {
      data: format(new Date(year, month, 1), 'MMM/yyyy', { locale: ptBR }),
      valor: value
    };
  });
};

// Interface para o token decodificado
interface DecodedToken {
  usuario: string;
  permissao: number;
  exp: number;
  [key: string]: any;
}

// Interface para as configurações do ecommerce
interface EcommerceConfig {
  exibirPrecoSomenteLogado: boolean;
  ocultarProdutoSemEstoque: boolean;
  permitirAvaliacoesProdutos: boolean;
  freteGratisPedidoMinimo: boolean;
  ocultarPrecos: boolean;
}

export default function AdminDashboard() {
  const router = useRouter();
  const { showPrices, setShowPrices } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'daily' | 'monthly'>('daily');
  const [activeSection, setActiveSection] = useState<'dashboard' | 'config'>('dashboard');
  
  // Estados para os dados dos gráficos
  const [consultasData, setConsultasData] = useState<any[]>([]);
  const [pedidosFechadosData, setPedidosFechadosData] = useState<any[]>([]);
  const [pedidosPendentesData, setPedidosPendentesData] = useState<any[]>([]);
  const [clientesCadastradosData, setClientesCadastradosData] = useState<any[]>([]);
  
  // Estados para os totais das métricas
  const [totalConsultas, setTotalConsultas] = useState(0);
  const [totalPedidosFechados, setTotalPedidosFechados] = useState(0);
  const [totalPedidosPendentes, setTotalPedidosPendentes] = useState(0);
  const [totalClientesCadastrados, setTotalClientesCadastrados] = useState(0);

  // Estado para configurações do ecommerce
  const [ecommerceConfig, setEcommerceConfig] = useState<EcommerceConfig>({
    exibirPrecoSomenteLogado: false,
    ocultarProdutoSemEstoque: true,
    permitirAvaliacoesProdutos: true,
    freteGratisPedidoMinimo: false,
    ocultarPrecos: !showPrices
  });

  // Verificar token e permissão de administrador
  useEffect(() => {
    const verificarAdmin = async () => {
      try {
        // Obter token do cookie
        const tokenCookie = document.cookie
          .split('; ')
          .find(row => row.startsWith('token='));
          
        if (!tokenCookie) {
          console.error('Token não encontrado nos cookies');
          router.push('/minha-conta/usuario');
          return;
        }
        
        // Extrair o token Bearer
        const token = tokenCookie.split('=')[1];
        if (!token || !token.startsWith('Bearer ')) {
          console.error('Token inválido no cookie');
          router.push('/minha-conta/usuario');
          return;
        }
        
        // Decodificar o JWT
        const decodedToken = jwtDecode<DecodedToken>(token.replace('Bearer ', ''));
        
        // Verificar se o token está expirado
        const currentTime = Math.floor(Date.now() / 1000);
        if (decodedToken.exp < currentTime) {
          console.error('Token expirado');
          router.push('/minha-conta/usuario');
          return;
        }
        
        // Extrair email do usuário do token
        const email = decodedToken.usuario;
        
        if (!email) {
          console.error('Email não encontrado no token');
          router.push('/minha-conta/usuario');
          return;
        }
        
        // Validar permissão de administrador
        const response = await axiosInstance.get(`/api/ecommerce/administrador?empresa=1&email=${email}`);
        
        if (response) {
          setIsAdmin(true);
          setIsLoading(false);
          
          // Carregar configurações do ecommerce (simulado)
          // Na implementação real, aqui seria feita uma requisição para obter as configurações atuais
          setEcommerceConfig({
            exibirPrecoSomenteLogado: false,
            ocultarProdutoSemEstoque: true,
            permitirAvaliacoesProdutos: true,
            freteGratisPedidoMinimo: false,
            ocultarPrecos: !showPrices
          });
        } else {
          console.error('Usuário não tem permissão de administrador');
          router.push('/minha-conta/usuario');
        }
      } catch (error) {
        console.error('Erro ao verificar permissões de administrador:', error);
        router.push('/minha-conta/usuario');
      }
    };
    
    verificarAdmin();
  }, [router, showPrices]);

  // Função para atualizar os dados quando a data ou o modo de visualização muda
  useEffect(() => {
    const refreshData = () => {
      const currentYear = getYear(selectedDate);
      const currentMonth = getMonth(selectedDate);
      
      // Gerar dados diários para o mês selecionado
      const monthStart = startOfMonth(selectedDate);
      const monthEnd = endOfMonth(selectedDate);
      
      if (viewMode === 'daily') {
        // Dados diários
        const consultasDaily = generateDailyData(monthStart, monthEnd, 'consultas');
        const pedidosFechadosDaily = generateDailyData(monthStart, monthEnd, 'pedidos_fechados');
        const pedidosPendentesDaily = generateDailyData(monthStart, monthEnd, 'pedidos_pendentes');
        const clientesCadastradosDaily = generateDailyData(monthStart, monthEnd, 'clientes_cadastrados');
        
        setConsultasData(consultasDaily);
        setPedidosFechadosData(pedidosFechadosDaily);
        setPedidosPendentesData(pedidosPendentesDaily);
        setClientesCadastradosData(clientesCadastradosDaily);
        
        // Calcular totais para os cards
        setTotalConsultas(consultasDaily.reduce((sum, item) => sum + item.valor, 0));
        setTotalPedidosFechados(pedidosFechadosDaily.reduce((sum, item) => sum + item.valor, 0));
        setTotalPedidosPendentes(pedidosPendentesDaily.reduce((sum, item) => sum + item.valor, 0));
        setTotalClientesCadastrados(clientesCadastradosDaily.reduce((sum, item) => sum + item.valor, 0));
      } else {
        // Dados mensais
        const consultasMonthly = generateMonthlyData(currentYear, 'consultas');
        const pedidosFechadosMonthly = generateMonthlyData(currentYear, 'pedidos_fechados');
        const pedidosPendentesMonthly = generateMonthlyData(currentYear, 'pedidos_pendentes');
        const clientesCadastradosMonthly = generateMonthlyData(currentYear, 'clientes_cadastrados');
        
        setConsultasData(consultasMonthly);
        setPedidosFechadosData(pedidosFechadosMonthly);
        setPedidosPendentesData(pedidosPendentesMonthly);
        setClientesCadastradosData(clientesCadastradosMonthly);
        
        // Calcular totais para os cards (soma anual)
        setTotalConsultas(consultasMonthly.reduce((sum, item) => sum + item.valor, 0));
        setTotalPedidosFechados(pedidosFechadosMonthly.reduce((sum, item) => sum + item.valor, 0));
        setTotalPedidosPendentes(pedidosPendentesMonthly.reduce((sum, item) => sum + item.valor, 0));
        setTotalClientesCadastrados(clientesCadastradosMonthly.reduce((sum, item) => sum + item.valor, 0));
      }
    };
    
    refreshData();
  }, [selectedDate, viewMode]);

  const handleMonthChange = (month: number) => {
    const newDate = setMonth(selectedDate, month);
    setSelectedDate(newDate);
  };

  const handleYearChange = (year: number) => {
    const newDate = setYear(selectedDate, year);
    setSelectedDate(newDate);
  };

  const handlePreviousMonth = () => {
    setSelectedDate(subMonths(selectedDate, 1));
  };

  const handleNextMonth = () => {
    setSelectedDate(addMonths(selectedDate, 1));
  };

  const handleRefreshData = () => {
    // Simular uma atualização de dados
    setSelectedDate(new Date(selectedDate));
    toast.success('Dados atualizados com sucesso!');
  };

  const handleConfigChange = (key: keyof EcommerceConfig, value: boolean) => {
    setEcommerceConfig(prev => ({
      ...prev,
      [key]: value
    }));
    
    // Atualizar o contexto quando a configuração de preços for alterada
    if (key === 'ocultarPrecos') {
      setShowPrices(!value);
    }
    
    // Aqui seria feita uma requisição para salvar a configuração
    toast.success(`Configuração "${key}" atualizada com sucesso!`);
  };

  if (isLoading) {
    return <Loading />;
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header/Barra de navegação */}
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/minha-conta/usuario" className="mr-4">
              <ArrowLeftIcon className="w-5 h-5 text-gray-500" />
            </Link>
            <h1 className="text-xl font-bold text-gray-900">Painel Administrativo</h1>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => setActiveSection('dashboard')}
              className={`px-4 py-2 rounded-lg ${
                activeSection === 'dashboard' 
                  ? 'bg-primary text-white' 
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Dashboard
            </button>
            <button 
              onClick={() => setActiveSection('config')}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                activeSection === 'config' 
                  ? 'bg-primary text-white' 
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Cog6ToothIcon className="w-4 h-4" />
              Configurações
            </button>
            {activeSection === 'dashboard' && (
              <button 
                onClick={handleRefreshData}
                className="flex items-center gap-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                <ArrowPathIcon className="w-4 h-4" />
                <span>Atualizar</span>
              </button>
            )}
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-6">
        {activeSection === 'dashboard' && (
          <>
            {/* Cards de estatísticas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <StatCard 
                title="Consultas" 
                value={totalConsultas} 
                icon={<DocumentChartBarIcon className="w-6 h-6 text-indigo-600" />}
                bgColor="bg-indigo-100"
              />
              <StatCard 
                title="Pedidos Finalizados" 
                value={totalPedidosFechados} 
                icon={<ShoppingBagIcon className="w-6 h-6 text-green-600" />}
                bgColor="bg-green-100"
              />
              <StatCard 
                title="Pedidos Pendentes" 
                value={totalPedidosPendentes} 
                icon={<ClockIcon className="w-6 h-6 text-amber-600" />}
                bgColor="bg-amber-100"
              />
              <StatCard 
                title="Clientes Cadastrados" 
                value={totalClientesCadastrados} 
                icon={<UserGroupIcon className="w-6 h-6 text-blue-600" />}
                bgColor="bg-blue-100"
              />
            </div>
            
            {/* Controles de filtro e seleção */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex gap-4 items-center">
                  <div className="flex">
                    <button 
                      onClick={() => setViewMode('daily')}
                      className={`px-4 py-2 rounded-l-lg ${viewMode === 'daily' 
                        ? 'bg-gray-800 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                      Diário
                    </button>
                    <button 
                      onClick={() => setViewMode('monthly')}
                      className={`px-4 py-2 rounded-r-lg ${viewMode === 'monthly' 
                        ? 'bg-gray-800 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                      Mensal
                    </button>
                  </div>
                  
                  <div className="flex">
                    <button
                      onClick={handlePreviousMonth}
                      className="p-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-l-lg"
                    >
                      &lt;
                    </button>
                    <button
                      onClick={handleNextMonth}
                      className="p-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-r-lg"
                    >
                      &gt;
                    </button>
                  </div>
                </div>
                
                <MonthYearPicker 
                  currentDate={selectedDate}
                  onMonthChange={handleMonthChange}
                  onYearChange={handleYearChange}
                />
              </div>
            </div>
            
            {/* Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartCard 
                title="Consultas" 
                data={consultasData} 
                color="text-indigo-600" 
                icon={<DocumentChartBarIcon className="w-5 h-5 text-indigo-600" />} 
              />
              <ChartCard 
                title="Pedidos Finalizados" 
                data={pedidosFechadosData} 
                color="text-green-600" 
                icon={<ShoppingBagIcon className="w-5 h-5 text-green-600" />} 
              />
              <ChartCard 
                title="Pedidos Pendentes" 
                data={pedidosPendentesData} 
                color="text-amber-600" 
                icon={<ClockIcon className="w-5 h-5 text-amber-600" />} 
              />
              <ChartCard 
                title="Clientes Cadastrados" 
                data={clientesCadastradosData} 
                color="text-blue-600" 
                icon={<UserGroupIcon className="w-5 h-5 text-blue-600" />} 
              />
            </div>
          </>
        )}

        {activeSection === 'config' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Cog6ToothIcon className="w-6 h-6 text-gray-700" />
              Configurações do E-commerce
            </h2>
            
            <div className="space-y-4">
              <ConfigToggle 
                title="Exibir preço somente para usuários logados" 
                description="Quando ativado, os preços dos produtos só serão visíveis para usuários que fizeram login"
                value={ecommerceConfig.exibirPrecoSomenteLogado}
                onChange={(value) => handleConfigChange('exibirPrecoSomenteLogado', value)}
                icon={<EyeSlashIcon className="w-5 h-5 text-gray-600" />}
              />
              
              <ConfigToggle 
                title="Ocultar produtos sem estoque" 
                description="Quando ativado, produtos com estoque zero não serão exibidos na loja"
                value={ecommerceConfig.ocultarProdutoSemEstoque}
                onChange={(value) => handleConfigChange('ocultarProdutoSemEstoque', value)}
                icon={<TagIcon className="w-5 h-5 text-gray-600" />}
              />
              
              <ConfigToggle 
                title="Permitir avaliações de produtos" 
                description="Quando ativado, os clientes poderão avaliar e comentar sobre os produtos"
                value={ecommerceConfig.permitirAvaliacoesProdutos}
                onChange={(value) => handleConfigChange('permitirAvaliacoesProdutos', value)}
                icon={<UserGroupIcon className="w-5 h-5 text-gray-600" />}
              />
              
              <ConfigToggle 
                title="Frete grátis para pedido mínimo" 
                description="Quando ativado, pedidos acima de um valor mínimo terão frete grátis"
                value={ecommerceConfig.freteGratisPedidoMinimo}
                onChange={(value) => handleConfigChange('freteGratisPedidoMinimo', value)}
                icon={<TruckIcon className="w-5 h-5 text-gray-600" />}
              />

              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <h4 className="font-medium text-gray-900">Ocultar preços de produtos</h4>
                  <p className="text-sm text-gray-500">
                    Quando ativado, os preços serão substituídos por "Preço sob consulta"
                  </p>
                </div>
                <Switch
                  checked={ecommerceConfig.ocultarPrecos}
                  onChange={(checked) => handleConfigChange('ocultarPrecos', checked)}
                  className={`${
                    ecommerceConfig.ocultarPrecos ? 'bg-primary' : 'bg-gray-300'
                  } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none`}
                >
                  <span
                    className={`${
                      ecommerceConfig.ocultarPrecos ? 'translate-x-6' : 'translate-x-1'
                    } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                  />
                </Switch>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 