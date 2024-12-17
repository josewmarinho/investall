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

  const [loanAmount, setLoanAmount] = useState<string>('1000');
  const [payments, setPayments] = useState<number>(12);
  const [selectedCategoria, setSelectedCategoria] = useState<string>(taxas[0].categoria);
  const [restrictionType, setRestrictionType] = useState<'semRestricao' | 'comRestricao'>('semRestricao');

  const taxaSelecionada = taxas.find((taxa) => taxa.categoria === selectedCategoria);
  const interestRate = taxaSelecionada ? taxaSelecionada[restrictionType] : 0;

  const monthlyPayment = ((Number(loanAmount) / payments) * (1 + interestRate / 100)).toFixed(2);

  const graphData = {
    labels: Array.from({ length: payments }, (_, i) => `Mês ${i + 1}`),
    datasets: [
      {
        label: 'Juros (R$)',
        data: Array(payments).fill((Number(loanAmount) / payments) * (interestRate / 100)),
        backgroundColor: 'green',
      },
      {
        label: 'Valor Total (R$)',
        data: Array(payments).fill((Number(loanAmount) / payments) * (1 + interestRate / 100)),
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

        {/* Valor do Empréstimo */}
        <div style={{ textAlign: 'left', marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>
            <strong>Valor do Empréstimo (R$):</strong>
          </label>
          <NumericFormat
            value={loanAmount}
            onValueChange={(values) => setLoanAmount(values.value)}
            placeholder='Digite o valor do empréstimo'
            thousandSeparator="."
            decimalSeparator=","
            prefix="R$ "
            allowNegative={false}
            valueIsNumericString
            style={{
              padding: '5px',
              width: '100%',
              maxWidth: '170px',
              fontSize: '1em',
              marginBottom: '10px',
            }}
          />
            <style>
                {`
                    input::placeholder {
                    font-size: 12px;
                    color: #888;
                    font-weight: 500;
                    }
                `}
            </style>
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
          <strong>Taxa de Juros:</strong> {interestRate}%
        </p>

        {/* Gráfico */}
        <div style={{ overflowX: 'auto', marginBottom: '20px', height: '250px', }}>
          <Bar data={graphData} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>

        {/* Pagamento Mensal */}
        <div style={{ marginTop: '20px' }}>
          <h2 style={{ fontSize: '1.5em' }}>
            Pagamento Mensal: <strong>R$ {monthlyPayment}</strong>
          </h2>
          <p style={{ fontSize: '1em' }}>
            Tempo Total: <strong>{payments} meses</strong>
          </p>
        </div>

        {/* Botão para WhatsApp */}
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <a
            href={`https://wa.me/+5586998337893?text=${encodeURIComponent(
              `Olá! Gostaria de saber mais sobre o empréstimo:\n\n` +
              `- Valor do Empréstimo: R$ ${Number(loanAmount).toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
              })}\n` +
              `- Número de Parcelas: ${payments}\n` +
              `- Categoria: ${selectedCategoria}\n` +
              `- Tipo de Restrição: ${restrictionType === 'semRestricao' ? 'Sem Restrição' : 'Com Restrição'}\n` +
              `- Taxa de Juros: ${interestRate}%\n` +
              `- Pagamento Mensal: R$ ${monthlyPayment}`
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
