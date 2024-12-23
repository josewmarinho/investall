import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { NumericFormat } from 'react-number-format';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Taxa {
  categoria: string;
  semRestricao: number;
  comRestricao: number;
}

const SimuladorCredito: React.FC = () => {
  const taxas: Taxa[] = [
    { categoria: 'Funcionários de condomínios', semRestricao: 6.68, comRestricao: 7.68 },
    { categoria: 'Administradoras e Síndicos profissionais', semRestricao: 7.56, comRestricao: 8.56 },
    { categoria: 'Empresas - antecipação de boletos', semRestricao: 9.86, comRestricao: 10.86 },
    { categoria: 'Empresas de energia solar', semRestricao: 3.85, comRestricao: 3.85 },
  ];

  const [loanAmount, setLoanAmount] = useState<string>('');
  const [installmentValue, setInstallmentValue] = useState<string>('');
  const [payments, setPayments] = useState<number>(16);
  const [selectedCategoria, setSelectedCategoria] = useState<string>(taxas[0].categoria);
  const [restrictionType, setRestrictionType] = useState<'semRestricao' | 'comRestricao'>('semRestricao');
  const [startDate, setStartDate] = useState<string>('');
  const [viewType, setViewType] = useState<'grafico' | 'tabela'>('grafico');

  const taxaSelecionada = taxas.find((taxa) => taxa.categoria === selectedCategoria);
  const interestRate = taxaSelecionada ? taxaSelecionada[restrictionType] / 100 : 0;

  const calculateInstallmentValue = () => {
    const PV = Number(loanAmount);
    const i = interestRate;
    const n = payments;
    if (PV > 0 && i > 0 && n > 0) {
      return (PV * i) / (1 - Math.pow(1 + i, -n));
    }
    return 0;
  };

  const monthlyPayment = installmentValue
    ? Number(installmentValue)
    : calculateInstallmentValue();

  const totalPaid = monthlyPayment * payments;
  const totalInterest = totalPaid - Number(loanAmount);

  const generateDates = () => {
    const start = startDate ? new Date(startDate) : new Date();
    if (!startDate) {
      start.setDate(start.getDate() + 30);
    }
    const dates = [];
    for (let i = 0; i < payments; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i * 30);
      dates.push(date.toLocaleDateString('pt-BR'));
    }
    return dates;
  };

  const paymentDates = generateDates();

  const graphData = {
    labels: paymentDates,
    datasets: [
      {
        label: 'Juros (R$)',
        data: Array(payments).fill(totalInterest / payments),
        backgroundColor: 'green',
      },
      {
        label: 'Valor Total (R$)',
        data: Array(payments).fill(monthlyPayment),
        backgroundColor: 'orange',
      },
    ],
  };

  return (
    <div
      style={{
        background: 'linear-gradient(to bottom, #e6f7ff, #b3e0ff)',
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '10px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '800px',
          textAlign: 'center',
          background: '#fff',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          boxSizing: 'border-box',
        }}
      >
        <h1 style={{ marginBottom: '20px', color: '#000000', fontSize: '1.8em' }}>Simulação de Crédito</h1>

        {/* Data da Primeira Parcela */}
        <div style={{ textAlign: 'left', marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>
            <strong>Data da Primeira Parcela:</strong>
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            style={{ padding: '5px', width: '100%', maxWidth: '200px' }}
          />
        </div>

        {/* Valor do Empréstimo */}
        <div style={{ textAlign: 'left', marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>
            <strong>Valor do Empréstimo (R$):</strong>
          </label>
          <NumericFormat
            value={loanAmount}
            onValueChange={(values) => setLoanAmount(values.value)}
            placeholder="Digite o valor do empréstimo"
            thousandSeparator="."
            decimalSeparator=","
            prefix="R$ "
            allowNegative={false}
            valueIsNumericString
            style={{
              padding: '5px',
              width: '100%',
              maxWidth: '200px',
              fontSize: '1em',
              marginBottom: '10px',
              marginTop: '5px',
              borderRadius: '5px',
            }}
          />
        </div>

        {/* Valor da Prestação */}
        <div style={{ textAlign: 'left', marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>
            <strong>Valor da Prestação (R$):</strong>
          </label>
          <NumericFormat
            value={installmentValue}
            onValueChange={(values) => setInstallmentValue(values.value)}
            placeholder="Digite o valor da prestação"
            thousandSeparator="."
            decimalSeparator=","
            prefix="R$ "
            allowNegative={false}
            valueIsNumericString
            style={{
              padding: '5px',
              width: '100%',
              maxWidth: '200px',
              fontSize: '1em',
              marginBottom: '10px',
              marginTop: '5px',
              borderRadius: '5px',
            }}
          />
        </div>

        {/* Número de Parcelas */}
        <div style={{ textAlign: 'left', marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>
            <strong>Número de Parcelas: {payments}</strong>
          </label>
          <input
            type="range"
            min="1"
            max="60"
            value={payments}
            onChange={(e) => setPayments(Number(e.target.value))}
            style={{
              width: '100%',
              height: '10px',
              background: 'linear-gradient(to right, #61b3ff, #cceeff)',
              borderRadius: '5px',
              outline: 'none',
            }}
          />
        </div>

        {/* Categoria */}
        <div style={{ textAlign: 'left', marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>
            <strong>Categoria:</strong>
          </label>
          <select
            value={selectedCategoria}
            onChange={(e) => setSelectedCategoria(e.target.value)}
            style={{ padding: '5px', width: '100%', marginTop: '1px', maxWidth: '300px' }}
          >
            {taxas.map((taxa) => (
              <option key={taxa.categoria} value={taxa.categoria}>
                {taxa.categoria}
              </option>
            ))}
          </select>
        </div>

        {/* Tipo de Restrição */}
        <div style={{ textAlign: 'left', marginBottom: '20px' }}>
          <strong>Tipo de Restrição:</strong>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              marginTop: '10px',
            }}
          >
            <label>
              <input
                type="radio"
                value="semRestricao"
                checked={restrictionType === 'semRestricao'}
                onChange={() => setRestrictionType('semRestricao')}
              />
              Sem Restrição
            </label>
            <label>
              <input
                type="radio"
                value="comRestricao"
                checked={restrictionType === 'comRestricao'}
                onChange={() => setRestrictionType('comRestricao')}
              />
              Com Restrição
            </label>
          </div>
        </div>

        {/* Taxa Atual */}
        <p style={{ textAlign: 'left', marginBottom: '20px', fontSize: '1em' }}>
          <strong>Taxa de Juros:</strong> {(interestRate * 100).toFixed(2)}%
        </p>

        {/* Gráfico ou Tabela */}
        <div style={{ marginBottom: '15px', textAlign: 'left' }}>
          <strong>Visualização:</strong>
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <label>
              <input
                type="radio"
                value="grafico"
                checked={viewType === 'grafico'}
                onChange={() => setViewType('grafico')}
              />
              Gráfico
            </label>
            <label>
              <input
                type="radio"
                value="tabela"
                checked={viewType === 'tabela'}
                onChange={() => setViewType('tabela')}
              />
              Tabela
            </label>
          </div>
        </div>

        {viewType === 'grafico' ? (
          <div style={{ overflowX: 'auto', marginBottom: '20px', height: '250px' }}>
            <Bar data={graphData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Data</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Juros (R$)</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Valor Total (R$)</th>
              </tr>
            </thead>
            <tbody>
              {paymentDates.map((date, i) => (
                <tr key={i}>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{date}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                    {(totalInterest / payments).toFixed(2)}
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                    {monthlyPayment.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div style={{ marginTop: '20px' }}>
          <h2 style={{ fontSize: '1.5em' }}>
            Pagamento Mensal: <strong>R$ {monthlyPayment.toFixed(2)}</strong>
          </h2>
          <p style={{ fontSize: '1em' }}>
            Tempo Total: <strong>{payments} meses</strong>
          </p>
          <p style={{ fontSize: '1em' }}>
            Valor Total: <strong>R$ {totalPaid.toFixed(2)}</strong>
          </p>
          <p style={{ fontSize: '1em', color: 'green' }}>
            Juros Totais: <strong>R$ {totalInterest.toFixed(2)}</strong>
          </p>
        </div>

        {/* Botão do WhatsApp */}
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <a
            href={`https://wa.me/+5586995601916?text=${encodeURIComponent(
              `Olá! Gostaria de saber mais sobre o empréstimo:\n\n` +
                `- Valor do Empréstimo: R$ ${Number(loanAmount).toLocaleString('pt-BR', {
                  minimumFractionDigits: 2,
                })}\n` +
                `- Número de Parcelas: ${payments}\n` +
                `- Categoria: ${selectedCategoria}\n` +
                `- Tipo de Restrição: ${restrictionType === 'semRestricao' ? 'Sem Restrição' : 'Com Restrição'}\n` +
                `- Taxa de Juros: ${(interestRate * 100).toFixed(2)}%\n` +
                `- Pagamento Mensal: R$ ${monthlyPayment.toFixed(2)}\n` +
                `- Juros Totais: R$ ${totalInterest.toFixed(2)}`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              padding: '10px 20px',
              backgroundColor: '#25D366',
              color: '#fff',
              textDecoration: 'none',
              borderRadius: '5px',
              fontSize: '1.2em',
              fontWeight: 'bold',
            }}
          >
            Chamar no WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
};

export default SimuladorCredito;
