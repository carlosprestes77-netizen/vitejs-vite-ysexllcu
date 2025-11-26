import React, { useState, useEffect, useMemo } from 'react';
import {
  LayoutDashboard,
  CalendarDays,
  CreditCard,
  Moon,
  Sun,
  Plus,
  Trash2,
  Edit3,
  Download,
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  Wallet,
  ArrowUpCircle,
  ArrowDownCircle,
  Menu,
  X,
  Building2,
  Calendar,
} from 'lucide-react';

// --- TIPOS E INTERFACES ---

type Status = 'pendente' | 'pago' | 'parcial';
type Categoria = 'evento' | 'divida';

interface Parcelamento {
  atual: number;
  total: number;
  idGrupo: string; // ID único para identificar o grupo de parcelas
}

interface Transacao {
  id: string;
  nome: string;
  empresa: string; // Cliente (Evento) ou Credor (Dívida)
  valorTotal: number; // Valor deste lançamento específico
  valorMensal: number; // Mantido para compatibilidade
  mes: string; // Formato YYYY-MM (usado para filtros)
  dataEspecifica: string; // Formato YYYY-MM-DD (para calendário)
  status: Status;
  observacoes: string;
  tipo: Categoria;
  parcelamento?: Parcelamento;
  criadoEm: string;
}

interface ResumoFinanceiro {
  receitaBruta: number;
  recebido: number;
  aReceber: number;
  dividaTotal: number;
  dividaPaga: number;
  dividaPendente: number;
  saldoGeral: number;
}

// --- UTILITÁRIOS ---

const formatarMoeda = (valor: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valor);
};

const formatarDataBr = (dataIso: string) => {
  if (!dataIso) return '';
  const [ano, mes, dia] = dataIso.split('-');
  return `${dia}/${mes}/${ano}`;
};

const gerarId = () => Math.random().toString(36).substr(2, 9);

const mesAtual = () => new Date().toISOString().slice(0, 7); // YYYY-MM
const dataAtual = () => new Date().toISOString().slice(0, 10); // YYYY-MM-DD

const mesesAno = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

const obterNomeMes = (anoMes: string) => {
  if (!anoMes) return '';
  const [ano, mes] = anoMes.split('-');
  return `${mesesAno[parseInt(mes) - 1]} de ${ano}`;
};

// Adiciona meses a uma data YYYY-MM
const adicionarMeses = (anoMes: string, mesesParaAdicionar: number) => {
  const [anoStr, mesStr] = anoMes.split('-');
  let ano = parseInt(anoStr);
  let mes = parseInt(mesStr) - 1; // 0-11

  const data = new Date(ano, mes + mesesParaAdicionar, 1);
  return data.toISOString().slice(0, 7); // Retorna YYYY-MM
};

// --- COMPONENTES UI ---

const Card = ({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 ${className}`}
  >
    {children}
  </div>
);

const Badge = ({ status }: { status: Status }) => {
  const styles = {
    pendente:
      'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800',
    pago: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
    parcial:
      'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800',
  };

  const labels = {
    pendente: 'Pendente',
    pago: 'Pago',
    parcial: 'Parcial',
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
};

// --- MODAL DE FORMULÁRIO ---

const ModalForm = ({
  isOpen,
  onClose,
  onSave,
  tipo,
  itemEditando,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (itens: Transacao[]) => void;
  tipo: Categoria;
  itemEditando: Transacao | null;
}) => {
  const [nome, setNome] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [valor, setValor] = useState(0);
  const [dataEspecifica, setDataEspecifica] = useState(dataAtual());
  const [status, setStatus] = useState<Status>('pendente');
  const [observacoes, setObservacoes] = useState('');

  const [isParcelado, setIsParcelado] = useState(false);
  const [qtdParcelas, setQtdParcelas] = useState(2);

  useEffect(() => {
    if (itemEditando) {
      setNome(itemEditando.nome);
      setEmpresa(itemEditando.empresa || '');
      setValor(itemEditando.valorTotal);
      setDataEspecifica(itemEditando.dataEspecifica || dataAtual());
      setStatus(itemEditando.status);
      setObservacoes(itemEditando.observacoes);
      setIsParcelado(false);
    } else {
      setNome('');
      setEmpresa('');
      setValor(0);
      setDataEspecifica(dataAtual());
      setStatus('pendente');
      setObservacoes('');
      setIsParcelado(false);
      setQtdParcelas(2);
    }
  }, [itemEditando, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!nome) return alert('Preencha o nome/descrição');
    if (valor <= 0) return alert('O valor deve ser maior que zero');

    const mesReferencia = dataEspecifica.slice(0, 7);

    if (tipo === 'divida' && isParcelado && !itemEditando) {
      const novasTransacoes: Transacao[] = [];
      const idGrupo = gerarId();

      for (let i = 0; i < qtdParcelas; i++) {
        const mesDaParcela = adicionarMeses(mesReferencia, i);
        novasTransacoes.push({
          id: gerarId(),
          nome: `${nome}`,
          empresa: empresa,
          valorTotal: valor,
          valorMensal: valor,
          mes: mesDaParcela,
          dataEspecifica: i === 0 ? dataEspecifica : `${mesDaParcela}-10`,
          status: 'pendente',
          observacoes: observacoes,
          tipo: tipo,
          parcelamento: {
            atual: i + 1,
            total: qtdParcelas,
            idGrupo: idGrupo,
          },
          criadoEm: new Date().toISOString(),
        });
      }
      onSave(novasTransacoes);
    } else {
      const transacao: Transacao = {
        id: itemEditando?.id || gerarId(),
        nome,
        empresa,
        valorTotal: valor,
        valorMensal: valor,
        mes: mesReferencia,
        dataEspecifica,
        status,
        observacoes,
        tipo,
        parcelamento: itemEditando?.parcelamento,
        criadoEm: itemEditando?.criadoEm || new Date().toISOString(),
      };
      onSave([transacao]);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-violet-50 dark:bg-slate-900/50">
          <h2 className="text-xl font-bold text-violet-900 dark:text-violet-100">
            {itemEditando ? 'Editar' : 'Novo'}{' '}
            {tipo === 'evento' ? 'Evento' : 'Dívida'}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-red-500"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              {tipo === 'evento' ? 'Nome do Evento' : 'Descrição da Dívida'}
            </label>
            <input
              type="text"
              className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-violet-500 outline-none transition"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder={
                tipo === 'evento'
                  ? 'Ex: Audiência Trabalhista'
                  : 'Ex: Compra Material Escritório'
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              <span className="flex items-center gap-2">
                <Building2 size={14} />
                {tipo === 'evento'
                  ? 'Cliente / Empresa'
                  : 'Credor (Quem devo pagar)'}
              </span>
            </label>
            <input
              type="text"
              className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-violet-500 outline-none transition"
              value={empresa}
              onChange={(e) => setEmpresa(e.target.value)}
              placeholder={
                tipo === 'evento'
                  ? 'Ex: Construtora XYZ Ltda'
                  : 'Ex: Banco, Papelaria, Fulano...'
              }
            />
          </div>

          <div className="bg-slate-50 dark:bg-slate-700/30 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  {isParcelado ? 'Valor da Parcela' : 'Valor Total'}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-slate-400">
                    R$
                  </span>
                  <input
                    type="number"
                    className="w-full p-3 pl-10 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-violet-500 outline-none transition font-bold"
                    value={valor}
                    onChange={(e) => setValor(parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  <span className="flex items-center gap-2">
                    <Calendar size={14} />
                    Data {tipo === 'evento' ? 'do Evento' : 'Vencimento'}
                  </span>
                </label>
                <input
                  type="date"
                  className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-violet-500 outline-none transition"
                  value={dataEspecifica}
                  onChange={(e) => setDataEspecifica(e.target.value)}
                />
              </div>
            </div>

            {tipo === 'divida' && !itemEditando && (
              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-600">
                <label className="flex items-center gap-2 cursor-pointer mb-2">
                  <input
                    type="checkbox"
                    checked={isParcelado}
                    onChange={(e) => setIsParcelado(e.target.checked)}
                    className="w-4 h-4 text-violet-600 rounded focus:ring-violet-500"
                  />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    É uma compra parcelada?
                  </span>
                </label>

                {isParcelado && (
                  <div className="animate-in slide-in-from-top-2">
                    <label className="block text-xs font-medium text-slate-500 mb-1">
                      Quantidade de Parcelas
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="2"
                        max="60"
                        className="w-20 p-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700"
                        value={qtdParcelas}
                        onChange={(e) =>
                          setQtdParcelas(parseInt(e.target.value) || 2)
                        }
                      />
                      <span className="text-sm text-slate-500">
                        vezes de {formatarMoeda(valor)}
                      </span>
                    </div>
                    <p className="text-xs text-blue-500 mt-2">
                      * Serão criados {qtdParcelas} lançamentos automaticamente.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Situação Atual
              </label>
              <select
                className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-violet-500 outline-none transition"
                value={status}
                onChange={(e) => setStatus(e.target.value as Status)}
              >
                <option value="pendente">Pendente (A Receber / A Pagar)</option>
                <option value="pago">Pago / Recebido</option>
                <option value="parcial">Pago Parcialmente</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Observações
            </label>
            <textarea
              rows={2}
              className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-violet-500 outline-none transition resize-none"
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Detalhes adicionais..."
            />
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 dark:border-slate-700 flex justify-end gap-3 bg-gray-50 dark:bg-slate-900/50">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-medium transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 rounded-lg bg-violet-600 text-white hover:bg-violet-700 font-medium shadow-lg shadow-violet-200 dark:shadow-none transition"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
};

// --- APLICAÇÃO PRINCIPAL ---

export default function App() {
  // ESTADOS COM INICIALIZAÇÃO LAZY (CORREÇÃO DE PERSISTÊNCIA)
  // Agora ele lê o localStorage ANTES de iniciar o estado, evitando sobrescrever com vazio.
  const [transacoes, setTransacoes] = useState<Transacao[]>(() => {
    try {
      const saved = localStorage.getItem('juridico_app_data');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Erro ao carregar dados', e);
      return [];
    }
  });

  const [temaEscuro, setTemaEscuro] = useState(() => {
    return localStorage.getItem('juridico_app_theme') === 'dark';
  });

  const [filtroMes, setFiltroMes] = useState<string>(mesAtual());
  const [abaAtiva, setAbaAtiva] = useState<'dashboard' | 'eventos' | 'dividas'>(
    'dashboard'
  );
  const [modalAberto, setModalAberto] = useState(false);
  const [itemEditando, setItemEditando] = useState<Transacao | null>(null);
  const [menuMobileAberto, setMenuMobileAberto] = useState(false);

  // EFEITOS DE SALVAMENTO (Só salva quando muda)
  useEffect(() => {
    localStorage.setItem('juridico_app_data', JSON.stringify(transacoes));
  }, [transacoes]);

  useEffect(() => {
    if (temaEscuro) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('juridico_app_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('juridico_app_theme', 'light');
    }
  }, [temaEscuro]);

  // Cálculos
  const dadosFiltrados = useMemo(() => {
    if (abaAtiva === 'dashboard') return transacoes;
    return transacoes
      .filter((t) => t.mes === filtroMes)
      .sort((a, b) => {
        return (
          new Date(a.dataEspecifica || a.mes).getTime() -
          new Date(b.dataEspecifica || b.mes).getTime()
        );
      });
  }, [transacoes, filtroMes, abaAtiva]);

  const resumo = useMemo((): ResumoFinanceiro => {
    const dados = transacoes.filter((t) => t.mes === filtroMes);

    const eventos = dados.filter((t) => t.tipo === 'evento');
    const dividas = dados.filter((t) => t.tipo === 'divida');

    const receitaBruta = eventos.reduce(
      (acc, curr) => acc + curr.valorTotal,
      0
    );
    const recebido = eventos
      .filter((t) => t.status === 'pago')
      .reduce((acc, curr) => acc + curr.valorTotal, 0);
    const aReceber = eventos
      .filter((t) => t.status !== 'pago')
      .reduce((acc, curr) => acc + curr.valorTotal, 0);

    const dividaTotal = dividas.reduce((acc, curr) => acc + curr.valorTotal, 0);
    const dividaPaga = dividas
      .filter((t) => t.status === 'pago')
      .reduce((acc, curr) => acc + curr.valorTotal, 0);
    const dividaPendente = dividas
      .filter((t) => t.status !== 'pago')
      .reduce((acc, curr) => acc + curr.valorTotal, 0);

    return {
      receitaBruta,
      recebido,
      aReceber,
      dividaTotal,
      dividaPaga,
      dividaPendente,
      saldoGeral: recebido - dividaPaga,
    };
  }, [transacoes, filtroMes]);

  // Ações
  const salvarTransacoes = (novosItens: Transacao[]) => {
    if (itemEditando) {
      setTransacoes((prev) =>
        prev.map((t) => (t.id === novosItens[0].id ? novosItens[0] : t))
      );
    } else {
      setTransacoes((prev) => [...prev, ...novosItens]);
    }
    setItemEditando(null);
  };

  const excluirTransacao = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este item?')) {
      setTransacoes((prev) => prev.filter((t) => t.id !== id));
    }
  };

  const alternarStatus = (id: string) => {
    setTransacoes((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const novoStatus = t.status === 'pendente' ? 'pago' : 'pendente';
          return { ...t, status: novoStatus };
        }
        return t;
      })
    );
  };

  const exportarJSON = () => {
    const dataStr = JSON.stringify(transacoes, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `backup_juridico_${
      new Date().toISOString().split('T')[0]
    }.json`;
    link.click();
  };

  const importarJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (Array.isArray(json)) {
          setTransacoes(json);
          alert('Backup restaurado com sucesso!');
        }
      } catch (err) {
        alert('Erro ao ler arquivo de backup.');
      }
    };
    reader.readAsText(file);
  };

  const exportarPDF = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 font-sans text-slate-800 dark:text-slate-100 transition-colors duration-300">
      <style>{`
        @media print {
          @page { margin: 1cm; size: A4 portrait; }
          body { background: white; color: black; -webkit-print-color-adjust: exact; }
          .no-print, nav, header button, .fab-button { display: none !important; }
          .print-only { display: block !important; }
          .card-resumo { border: 1px solid #ddd; break-inside: avoid; page-break-inside: avoid; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 12px; }
          th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
          th { background-color: #f3f4f6; font-weight: bold; }
        }
        .print-only { display: none; }
      `}</style>

      <div className="print-only p-8">
        <h1 className="text-2xl font-bold mb-2">Relatório Financeiro</h1>
        <p className="text-sm text-gray-600 mb-8">
          Gerado em: {new Date().toLocaleDateString()} - Referência:{' '}
          {obterNomeMes(filtroMes)}
        </p>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="border p-4 rounded">
            <h3 className="font-bold border-b pb-2 mb-2">Resumo Eventos</h3>
            <p>Receita Bruta: {formatarMoeda(resumo.receitaBruta)}</p>
            <p>Recebido: {formatarMoeda(resumo.recebido)}</p>
            <p>A Receber: {formatarMoeda(resumo.aReceber)}</p>
          </div>
          <div className="border p-4 rounded">
            <h3 className="font-bold border-b pb-2 mb-2">Resumo Dívidas</h3>
            <p>Total Dívidas: {formatarMoeda(resumo.dividaTotal)}</p>
            <p>Pagas: {formatarMoeda(resumo.dividaPaga)}</p>
            <p>Pendentes: {formatarMoeda(resumo.dividaPendente)}</p>
          </div>
        </div>

        <div className="mb-4 p-2 bg-gray-100 font-bold text-xl border border-gray-300">
          Saldo Líquido (Recebido - Pago): {formatarMoeda(resumo.saldoGeral)}
        </div>

        <h2 className="text-lg font-bold mt-6 mb-2">Detalhamento de Eventos</h2>
        <table>
          <thead>
            <tr>
              <th>Data</th>
              <th>Cliente</th>
              <th>Evento</th>
              <th>Status</th>
              <th>Valor</th>
            </tr>
          </thead>
          <tbody>
            {dadosFiltrados
              .filter((t) => t.tipo === 'evento' && t.mes === filtroMes)
              .map((t) => (
                <tr key={t.id}>
                  <td>{formatarDataBr(t.dataEspecifica)}</td>
                  <td>{t.empresa || '-'}</td>
                  <td>{t.nome}</td>
                  <td>{t.status.toUpperCase()}</td>
                  <td>{formatarMoeda(t.valorTotal)}</td>
                </tr>
              ))}
          </tbody>
        </table>

        <h2 className="text-lg font-bold mt-6 mb-2">Detalhamento de Dívidas</h2>
        <table>
          <thead>
            <tr>
              <th>Data</th>
              <th>Credor</th>
              <th>Descrição</th>
              <th>Parcela</th>
              <th>Status</th>
              <th>Valor</th>
            </tr>
          </thead>
          <tbody>
            {dadosFiltrados
              .filter((t) => t.tipo === 'divida' && t.mes === filtroMes)
              .map((t) => (
                <tr key={t.id}>
                  <td>{formatarDataBr(t.dataEspecifica)}</td>
                  <td>{t.empresa || '-'}</td>
                  <td>{t.nome}</td>
                  <td>
                    {t.parcelamento
                      ? `${t.parcelamento.atual}/${t.parcelamento.total}`
                      : 'Única'}
                  </td>
                  <td>{t.status.toUpperCase()}</td>
                  <td>{formatarMoeda(t.valorTotal)}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <div className="lg:hidden fixed top-0 w-full z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 p-4 flex justify-between items-center no-print">
        <h1 className="font-bold text-violet-600 text-lg">FinJurídico</h1>
        <button
          onClick={() => setMenuMobileAberto(!menuMobileAberto)}
          className="p-2"
        >
          {menuMobileAberto ? <X /> : <Menu />}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row min-h-screen">
        <nav
          className={`${
            menuMobileAberto ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col transition-transform duration-300 ease-in-out no-print`}
        >
          <div className="p-8 hidden lg:block">
            <h1 className="text-2xl font-extrabold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
              FinJurídico
            </h1>
            <p className="text-xs text-slate-500 mt-1 font-medium tracking-wide">
              PAINEL DE GESTÃO
            </p>
          </div>

          <div className="flex-1 px-4 py-4 lg:py-0 space-y-2 mt-16 lg:mt-0">
            <button
              onClick={() => {
                setAbaAtiva('dashboard');
                setMenuMobileAberto(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                abaAtiva === 'dashboard'
                  ? 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300'
                  : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <LayoutDashboard size={20} /> Visão Geral
            </button>
            <button
              onClick={() => {
                setAbaAtiva('eventos');
                setMenuMobileAberto(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                abaAtiva === 'eventos'
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                  : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <CalendarDays size={20} /> Eventos & Receita
            </button>
            <button
              onClick={() => {
                setAbaAtiva('dividas');
                setMenuMobileAberto(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                abaAtiva === 'dividas'
                  ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300'
                  : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <CreditCard size={20} /> Dívidas & Despesas
            </button>
          </div>

          <div className="p-4 border-t border-slate-200 dark:border-slate-700 space-y-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase px-2 mb-2">
              Dados & Config
            </h3>
            <button
              onClick={exportarPDF}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
            >
              <FileText size={16} /> Exportar Relatório PDF
            </button>
            <button
              onClick={exportarJSON}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
            >
              <Download size={16} /> Backup (Salvar)
            </button>
            <label className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg cursor-pointer">
              <Upload size={16} />
              <span>Restaurar Backup</span>
              <input
                type="file"
                accept=".json"
                onChange={importarJSON}
                className="hidden"
              />
            </label>

            <div className="pt-4 mt-2 flex justify-between items-center px-2">
              <span className="text-xs text-slate-500">Modo Escuro</span>
              <button
                onClick={() => setTemaEscuro(!temaEscuro)}
                className="p-2 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-yellow-400 transition"
              >
                {temaEscuro ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            </div>
          </div>
        </nav>

        <main className="flex-1 p-6 lg:p-10 pt-20 lg:pt-10 overflow-y-auto no-print">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h2 className="text-3xl font-bold text-slate-800 dark:text-white">
                {abaAtiva === 'dashboard'
                  ? 'Dashboard'
                  : abaAtiva === 'eventos'
                  ? 'Meus Eventos'
                  : 'Minhas Dívidas'}
              </h2>
              <p className="text-slate-500 dark:text-slate-400">
                Gerencie suas finanças jurídicas e pessoais.
              </p>
            </div>

            <div className="flex items-center gap-3 bg-white dark:bg-slate-800 p-1.5 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
              <input
                type="month"
                value={filtroMes}
                onChange={(e) => setFiltroMes(e.target.value)}
                className="bg-transparent border-none text-slate-700 dark:text-white font-medium focus:ring-0 cursor-pointer"
              />
            </div>
          </div>

          {abaAtiva === 'dashboard' && (
            <div className="space-y-6 animate-in fade-in zoom-in duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="border-l-4 border-l-violet-500">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-violet-100 dark:bg-violet-900/30 rounded-lg text-violet-600 dark:text-violet-400">
                      <Wallet size={24} />
                    </div>
                    <span
                      className={`text-xs font-bold px-2 py-1 rounded-full ${
                        resumo.saldoGeral >= 0
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      Líquido
                    </span>
                  </div>
                  <p className="text-slate-500 text-sm font-medium">
                    Saldo do Mês
                  </p>
                  <h3 className="text-2xl font-bold text-slate-800 dark:text-white mt-1">
                    {formatarMoeda(resumo.saldoGeral)}
                  </h3>
                </Card>

                <Card className="border-l-4 border-l-emerald-500">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg text-emerald-600 dark:text-emerald-400">
                      <ArrowUpCircle size={24} />
                    </div>
                    <span className="text-xs text-slate-400">Bruto</span>
                  </div>
                  <p className="text-slate-500 text-sm font-medium">
                    Receita de Eventos
                  </p>
                  <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                    {formatarMoeda(resumo.receitaBruta)}
                  </h3>
                  <div className="mt-2 text-xs flex gap-2 text-slate-400">
                    <span className="text-emerald-600 font-bold">
                      Rec: {formatarMoeda(resumo.recebido)}
                    </span>
                    <span>•</span>
                    <span>Pend: {formatarMoeda(resumo.aReceber)}</span>
                  </div>
                </Card>

                <Card className="border-l-4 border-l-rose-500">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-rose-100 dark:bg-rose-900/30 rounded-lg text-rose-600 dark:text-rose-400">
                      <ArrowDownCircle size={24} />
                    </div>
                  </div>
                  <p className="text-slate-500 text-sm font-medium">
                    Dívidas Totais
                  </p>
                  <h3 className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-1">
                    {formatarMoeda(resumo.dividaTotal)}
                  </h3>
                  <div className="mt-2 text-xs flex gap-2 text-slate-400">
                    <span className="text-rose-600 font-bold">
                      Pend: {formatarMoeda(resumo.dividaPendente)}
                    </span>
                    <span>•</span>
                    <span>Pago: {formatarMoeda(resumo.dividaPaga)}</span>
                  </div>
                </Card>

                <Card className="border-l-4 border-l-blue-500 flex flex-col justify-center items-center text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition">
                  <button
                    onClick={exportarPDF}
                    className="flex flex-col items-center"
                  >
                    <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400 mb-2">
                      <FileText size={28} />
                    </div>
                    <span className="text-blue-600 dark:text-blue-400 font-bold">
                      Gerar Relatório
                    </span>
                    <span className="text-xs text-slate-400">PDF Completo</span>
                  </button>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                <Card className="h-full">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <AlertCircle size={20} className="text-yellow-500" />
                    Eventos Pendentes
                  </h3>
                  <div className="space-y-3">
                    {dadosFiltrados.filter(
                      (t) => t.tipo === 'evento' && t.status !== 'pago'
                    ).length === 0 && (
                      <p className="text-slate-400 text-sm italic py-4">
                        Nenhum evento pendente neste mês.
                      </p>
                    )}
                    {dadosFiltrados
                      .filter((t) => t.tipo === 'evento' && t.status !== 'pago')
                      .slice(0, 5)
                      .map((t) => (
                        <div
                          key={t.id}
                          className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 border border-slate-100 dark:border-slate-700/50"
                        >
                          <div>
                            <p className="font-medium flex items-center gap-2">
                              {t.nome}
                              {t.empresa && (
                                <span className="text-xs bg-slate-100 dark:bg-slate-600 px-2 py-0.5 rounded text-slate-500 dark:text-slate-300">
                                  {t.empresa}
                                </span>
                              )}
                            </p>
                            <p className="text-xs text-slate-500">
                              {formatarDataBr(t.dataEspecifica)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-slate-700 dark:text-slate-200">
                              {formatarMoeda(t.valorTotal)}
                            </p>
                            <Badge status={t.status} />
                          </div>
                        </div>
                      ))}
                  </div>
                </Card>

                <Card className="h-full">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <AlertCircle size={20} className="text-rose-500" />
                    Dívidas Pendentes
                  </h3>
                  <div className="space-y-3">
                    {dadosFiltrados.filter(
                      (t) => t.tipo === 'divida' && t.status !== 'pago'
                    ).length === 0 && (
                      <p className="text-slate-400 text-sm italic py-4">
                        Nenhuma dívida pendente neste mês.
                      </p>
                    )}
                    {dadosFiltrados
                      .filter((t) => t.tipo === 'divida' && t.status !== 'pago')
                      .slice(0, 5)
                      .map((t) => (
                        <div
                          key={t.id}
                          className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 border border-slate-100 dark:border-slate-700/50"
                        >
                          <div>
                            <p className="font-medium flex items-center gap-2">
                              {t.nome}
                              {t.parcelamento && (
                                <span className="text-xs bg-rose-100 dark:bg-rose-900/40 text-rose-600 px-2 py-0.5 rounded">
                                  {t.parcelamento.atual}x
                                </span>
                              )}
                            </p>
                            <p className="text-xs text-slate-500">
                              {t.empresa
                                ? `Credor: ${t.empresa}`
                                : formatarDataBr(t.dataEspecifica)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-rose-600 dark:text-rose-400">
                              {formatarMoeda(t.valorTotal)}
                            </p>
                            <Badge status={t.status} />
                          </div>
                        </div>
                      ))}
                  </div>
                </Card>
              </div>
            </div>
          )}

          {(abaAtiva === 'eventos' || abaAtiva === 'dividas') && (
            <div className="animate-in slide-in-from-bottom-4 duration-300">
              <div className="flex justify-end mb-6">
                <button
                  onClick={() => {
                    setItemEditando(null);
                    setModalAberto(true);
                  }}
                  className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-5 py-3 rounded-xl font-bold shadow-lg shadow-violet-200 dark:shadow-none transition transform hover:scale-105"
                >
                  <Plus size={20} />
                  Adicionar {abaAtiva === 'eventos' ? 'Evento' : 'Dívida'}
                </button>
              </div>

              <Card className="overflow-hidden p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-700 text-slate-500 font-medium">
                        <th className="p-4">Status</th>
                        <th className="p-4">Dia</th>
                        <th className="p-4">Descrição</th>
                        <th className="p-4">
                          {abaAtiva === 'eventos' ? 'Cliente' : 'Credor'}
                        </th>
                        <th className="p-4 text-right">Valor</th>
                        <th className="p-4 text-center">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                      {dadosFiltrados.filter(
                        (t) =>
                          t.tipo ===
                          (abaAtiva === 'eventos' ? 'evento' : 'divida')
                      ).length === 0 ? (
                        <tr>
                          <td
                            colSpan={6}
                            className="p-8 text-center text-slate-400"
                          >
                            Nenhum registro encontrado para{' '}
                            {obterNomeMes(filtroMes)}.
                          </td>
                        </tr>
                      ) : (
                        dadosFiltrados
                          .filter(
                            (t) =>
                              t.tipo ===
                              (abaAtiva === 'eventos' ? 'evento' : 'divida')
                          )
                          .map((item) => (
                            <tr
                              key={item.id}
                              className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition group"
                            >
                              <td className="p-4">
                                <Badge status={item.status} />
                              </td>
                              <td className="p-4 text-slate-500 font-mono">
                                {item.dataEspecifica
                                  ? item.dataEspecifica.split('-')[2]
                                  : '01'}
                              </td>
                              <td className="p-4 font-medium text-slate-800 dark:text-slate-200">
                                <div className="flex items-center gap-2">
                                  {item.nome}
                                  {item.parcelamento && (
                                    <span className="text-[10px] uppercase font-bold bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300 px-1.5 rounded">
                                      {item.parcelamento.atual}/
                                      {item.parcelamento.total}
                                    </span>
                                  )}
                                </div>
                                {item.observacoes && (
                                  <p className="text-xs text-slate-400 mt-1 truncate max-w-[150px]">
                                    {item.observacoes}
                                  </p>
                                )}
                              </td>
                              <td className="p-4 text-slate-500">
                                {item.empresa || '-'}
                              </td>
                              <td className="p-4 text-right font-bold text-slate-700 dark:text-slate-300">
                                {formatarMoeda(item.valorTotal)}
                              </td>
                              <td className="p-4">
                                <div className="flex justify-center gap-2">
                                  <button
                                    onClick={() => alternarStatus(item.id)}
                                    title={
                                      item.status === 'pendente'
                                        ? 'Marcar como Pago'
                                        : 'Marcar como Pendente'
                                    }
                                    className={`p-2 rounded-lg transition ${
                                      item.status === 'pago'
                                        ? 'text-emerald-500 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/20'
                                        : 'text-slate-400 hover:text-emerald-500 hover:bg-slate-100 dark:hover:bg-slate-700'
                                    }`}
                                  >
                                    <CheckCircle2 size={18} />
                                  </button>
                                  <button
                                    onClick={() => {
                                      setItemEditando(item);
                                      setModalAberto(true);
                                    }}
                                    className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition"
                                  >
                                    <Edit3 size={18} />
                                  </button>
                                  <button
                                    onClick={() => excluirTransacao(item.id)}
                                    className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition"
                                  >
                                    <Trash2 size={18} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}
        </main>
      </div>

      <ModalForm
        isOpen={modalAberto}
        onClose={() => setModalAberto(false)}
        onSave={salvarTransacoes}
        tipo={
          abaAtiva === 'dashboard'
            ? 'evento'
            : abaAtiva === 'eventos'
            ? 'evento'
            : 'divida'
        }
        itemEditando={itemEditando}
      />
    </div>
  );
}
