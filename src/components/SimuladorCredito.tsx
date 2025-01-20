import React, { useState } from "react";
import { NumericFormat } from "react-number-format";
import { numeroPorExtenso } from "../utils/numeroPorExtenso";
import EditorContrato from "./EditorContrato";
import { useTaxa } from "../hook/useTaxa";

interface Taxa {
  categoria: string;
  semRestricao: number;
  comRestricao: number;
}

const SimuladorCredito: React.FC = () => {
  const taxas: Taxa[] = [
    {
      categoria: "Funcionários de condomínios",
      semRestricao: 6.68,
      comRestricao: 7.68,
    },
    {
      categoria: "Administradoras e Síndicos profissionais",
      semRestricao: 7.56,
      comRestricao: 8.56,
    },
    {
      categoria: "Empresas - antecipação de boletos",
      semRestricao: 9.86,
      comRestricao: 10.86,
    },
    {
      categoria: "Empresas de energia solar",
      semRestricao: 3.85,
      comRestricao: 3.85,
    },
  ];

  const [loanAmount, setLoanAmount] = useState<string>("");
  const [installmentValue, setInstallmentValue] = useState<string>("");
  const [payments, setPayments] = useState<number>(1);
  const [selectedCategoria, setSelectedCategoria] = useState<string>(
    taxas[0].categoria
  );
  const [restrictionType, setRestrictionType] = useState<
    "semRestricao" | "comRestricao"
  >("semRestricao");

  const [startDate, setStartDate] = useState<string>(() => {
    const today = new Date();
    const nextMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      today.getDate()
    );
    return nextMonth.toISOString().split("T")[0];
  });

  const [errorMessage, setErrorMessage] = useState<string>("");
  const [calculationDone, setCalculationDone] = useState<boolean>(false);

  const [currentView, setCurrentView] = useState<"calculadora" | "editor">(
    "calculadora"
  );
  const taxaAtual = useTaxa(taxas, selectedCategoria, restrictionType);
  

  const calculateInstallmentValue = (PV: number, i: number, n: number) => {
    if (PV > 0 && i > 0 && n > 0) {
      return (PV * i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1);
    }
    return 0;
  };

  const calculateLoanAmount = (PMT: number, i: number, n: number) => {
    if (PMT > 0 && i > 0 && n > 0) {
      return (PMT * (Math.pow(1 + i, n) - 1)) / (i * Math.pow(1 + i, n));
    }
    return 0;
  };

  const calculateGracePeriod = () => {
    const today = new Date();
    const [year, month, day] = startDate.split("-").map(Number);
    const adjustedDate = new Date(year, month - 2, day);

    const diffInMonths = Math.round(
      (adjustedDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24 * 30)
    );
    return Math.max(diffInMonths, 0);
  };

  const handleCalculate = () => {
    setErrorMessage("");

    const taxaSelecionada = taxas.find(
      (taxa) => taxa.categoria === selectedCategoria
    );
    const interestRate = taxaSelecionada
      ? taxaSelecionada[restrictionType] / 100
      : 0;

    const gracePeriod = calculateGracePeriod();

    if (loanAmount && installmentValue) {
      setErrorMessage(
        "Por favor, preencha apenas um dos campos: Valor do Empréstimo ou Valor da Prestação."
      );
      return;
    }

    let saldoDevedor = Number(loanAmount);

    if (gracePeriod > 0 && saldoDevedor > 0) {
      const jurosCarencia =
        saldoDevedor * (Math.pow(1 + interestRate, gracePeriod) - 1);
      saldoDevedor += jurosCarencia;
    }

    if (loanAmount) {
      const PV = saldoDevedor;
      const installment = calculateInstallmentValue(PV, interestRate, payments);
      setInstallmentValue(installment.toFixed(2));
    } else if (installmentValue) {
      const PMT = Number(installmentValue);
      const loan = calculateLoanAmount(PMT, interestRate, payments);
      setLoanAmount(loan.toFixed(2));
    } else {
      setErrorMessage("Por favor, preencha um dos campos para calcular.");
    }

    setCalculationDone(true);
  };

  const handleClear = () => {
    setLoanAmount("");
    setInstallmentValue("");
    setErrorMessage("");
    setPayments(1);
    setCalculationDone(false);
  };

  const generateAmortizationTable = () => {
    const taxaSelecionada = taxas.find(
      (taxa) => taxa.categoria === selectedCategoria
    );
    const interestRate = taxaSelecionada
      ? taxaSelecionada[restrictionType] / 100
      : 0;

    const gracePeriod = calculateGracePeriod();
    let saldoDevedor = Number(loanAmount);

    if (gracePeriod > 0 && saldoDevedor > 0) {
      const jurosCarencia =
        saldoDevedor * (Math.pow(1 + interestRate, gracePeriod) - 1);
      saldoDevedor += jurosCarencia;
    }

    const table = [];
    const parcelaFixa = calculateInstallmentValue(
      saldoDevedor,
      interestRate,
      payments
    );

    for (let i = 0; i < payments; i++) {
      const juros = saldoDevedor * interestRate;
      const amortizacao = parcelaFixa - juros;
      saldoDevedor -= amortizacao;

      if (saldoDevedor < 0.01) {
        saldoDevedor = 0;
      }

      table.push({
        parcela: i + 1,
        juros: juros.toFixed(2),
        amortizacao: amortizacao.toFixed(2),
        saldoDevedor: saldoDevedor.toFixed(2),
      });
    }

    return table;
  };

  const amortizationTable = generateAmortizationTable();
  const totalPaid = Number(installmentValue) * payments;
  const totalInterest = totalPaid - Number(loanAmount);

  const generateDates = () => {
    const [year, month, day] = startDate.split("-").map(Number);
    const displayDate = new Date(year, month - 1, day);

    const dates = [];
    for (let i = 0; i < payments; i++) {
      const date = new Date(
        displayDate.getFullYear(),
        displayDate.getMonth() + i,
        displayDate.getDate()
      );
      dates.push(date.toLocaleDateString("pt-BR"));
    }
    return dates;
  };

  const paymentDates = generateDates();

  const numberToWords = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const handleCalculateRemainingPayments = () => {
    setErrorMessage("");
    const taxaSelecionada = taxas.find(
      (taxa) => taxa.categoria === selectedCategoria
    );
    const interestRate = taxaSelecionada
      ? taxaSelecionada[restrictionType] / 100
      : 0;

    const saldoDevedor = Number(loanAmount);
    const PMT = Number(installmentValue);

    if (!saldoDevedor || !PMT || !interestRate) {
      setErrorMessage(
        "Por favor, preencha o Valor do Empréstimo e o Valor da Prestação para calcular."
      );
      return;
    }

    if (PMT <= saldoDevedor * interestRate) {
      setErrorMessage(
        "O valor da prestação é insuficiente para cobrir os juros. Ajuste os valores."
      );
      return;
    }

    const remainingPayments = Math.ceil(
      Math.log(PMT / (PMT - saldoDevedor * interestRate)) /
        Math.log(1 + interestRate)
    );

    setPayments(remainingPayments); // Atualiza o estado de parcelas
    setCalculationDone(true); // Marca como cálculo realizado
  };

  const parcelasCalculadas = amortizationTable.map((_, index) => ({
    data: paymentDates[index], // Pega a data de pagamento
    valor: numberToWords(Number(installmentValue)), // Pega o valor da amortização
  }));



  const sendDataToContrat = {
    emprestimo: loanAmount,
    totalApagar: numberToWords(totalPaid),
    totalApagarTexto: numeroPorExtenso(totalPaid),
    juros: `${taxaAtual}%`,
    numeroParcelas: payments,

  }

  return (
    <div
      style={{
        background: "linear-gradient(to bottom, #e6f7ff, #b3e0ff)",
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        padding: "10px",
      }}
    >
      {currentView === "calculadora" && (
        <div
          style={{
            width: "100%",
            maxWidth: "800px",
            textAlign: "center",
            background: "#fff",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            marginBottom: "100px",
            marginTop: "30px",
          }}
        >
          <h1
            style={{
              marginBottom: "20px",
              color: "#000000",
              fontSize: "1.8em",
            }}
          >
            Simulação de Crédito
          </h1>

          {/* Data da Primeira Parcela */}
          <div style={{ textAlign: "left", marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>
              <strong>Data da Primeira Parcela:</strong>
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={{ padding: "5px", width: "100%", maxWidth: "200px" }}
            />
          </div>

          {/* Valor do Empréstimo */}
          <div style={{ textAlign: "left", marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>
              <strong>Valor do Empréstimo (R$):</strong>
            </label>
            <NumericFormat
              value={loanAmount}
              onValueChange={(values) => setLoanAmount(values.value)}
              placeholder="Valor do empréstimo"
              thousandSeparator="."
              decimalSeparator=","
              prefix="R$ "
              allowNegative={false}
              valueIsNumericString
              style={{
                padding: "5px",
                width: "100%",
                maxWidth: "200px",
                fontSize: "1em",
                marginBottom: "10px",
                marginTop: "5px",
                borderRadius: "5px",
              }}
            />
          </div>

          {/* Valor da Prestação */}
          <div style={{ textAlign: "left", marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>
              <strong>Valor da Prestação (R$):</strong>
            </label>
            <NumericFormat
              value={installmentValue}
              onValueChange={(values) => setInstallmentValue(values.value)}
              placeholder="Valor da prestação"
              thousandSeparator="."
              decimalSeparator=","
              prefix="R$ "
              allowNegative={false}
              valueIsNumericString
              style={{
                padding: "5px",
                width: "100%",
                maxWidth: "200px",
                fontSize: "1em",
                marginBottom: "10px",
                marginTop: "5px",
                borderRadius: "5px",
              }}
            />
          </div>

          {/* Número de Parcelas */}
          <div style={{ textAlign: "left", marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>
              <strong>Número de Parcelas: {payments}</strong>
            </label>
            <input
              type="range"
              min="1"
              max="100"
              value={payments}
              onChange={(e) => setPayments(Number(e.target.value))}
              style={{
                width: "100%",
                height: "10px",
                background: "linear-gradient(to right, #61b3ff, #cceeff)",
                borderRadius: "5px",
                outline: "none",
              }}
            />
          </div>

          {/* Categoria */}
          <div style={{ textAlign: "left", marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>
              <strong>Categoria:</strong>
            </label>
            <select
              value={selectedCategoria}
              onChange={(e) => setSelectedCategoria(e.target.value)}
              style={{
                padding: "5px",
                width: "100%",
                marginTop: "1px",
                maxWidth: "300px",
              }}
            >
              {taxas.map((taxa) => (
                <option key={taxa.categoria} value={taxa.categoria}>
                  {taxa.categoria}
                </option>
              ))}
            </select>
          </div>

          {/* Tipo de Restrição */}
          <div style={{ textAlign: "left", marginBottom: "20px" }}>
            <strong>Tipo de Restrição:</strong>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                marginTop: "10px",
              }}
            >
              <label>
                <input
                  type="radio"
                  value="semRestricao"
                  checked={restrictionType === "semRestricao"}
                  onChange={() => setRestrictionType("semRestricao")}
                />
                Sem Restrição
              </label>
              <label>
                <input
                  type="radio"
                  value="comRestricao"
                  checked={restrictionType === "comRestricao"}
                  onChange={() => setRestrictionType("comRestricao")}
                />
                Com Restrição
              </label>
            </div>
          </div>

          {/* Taxa Atual */}
          <p
            style={{ textAlign: "left", marginBottom: "20px", fontSize: "1em" }}
          >
            <strong>Taxa de Juros:</strong>{" "}
            {taxaAtual}
            %
          </p>

          {/* Botões */}
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <button
              onClick={handleCalculate}
              style={{
                padding: "10px 20px",
                fontSize: "1em",
                backgroundColor: "#007BFF",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                marginRight: "10px",
              }}
            >
              Calcular
            </button>
            <button
              onClick={handleClear}
              style={{
                padding: "10px 27px",
                fontSize: "1em",
                backgroundColor: "#DC3545",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Limpar
            </button>
            <button
              onClick={handleCalculateRemainingPayments}
              style={{
                padding: "10px 20px",
                fontSize: "1em",
                backgroundColor: "#28a745",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                marginLeft: "10px",
              }}
            >
              Parcelas Restantes
            </button>
            {errorMessage && (
              <p style={{ color: "red", marginTop: "10px" }}>{errorMessage}</p>
            )}
          </div>

          <hr style={{ margin: "20px 0", border: "1px solid #ddd" }} />

          {/* Tabela de Amortização */}
          {Number(installmentValue) > 0 &&
            totalInterest > 0 &&
            totalPaid > 0 &&
            calculationDone && (
              <>
                <h2 style={{ margin: "20px 0" }}>Tabela de Amortização</h2>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    marginBottom: "20px",
                  }}
                >
                  <thead>
                    <tr>
                      <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                        Parcela
                      </th>
                      <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                        Data
                      </th>
                      <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                        Juros (R$)
                      </th>
                      <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                        Amortização (R$)
                      </th>
                      <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                        Saldo Devedor (R$)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {amortizationTable.map((row, index) => (
                      <tr key={index}>
                        <td
                          style={{ border: "1px solid #ddd", padding: "8px" }}
                        >
                          {row.parcela}
                        </td>
                        <td
                          style={{ border: "1px solid #ddd", padding: "8px" }}
                        >
                          {paymentDates[index]}
                        </td>
                        <td
                          style={{ border: "1px solid #ddd", padding: "8px" }}
                        >
                          {row.juros}
                        </td>
                        <td
                          style={{ border: "1px solid #ddd", padding: "8px" }}
                        >
                          {row.amortizacao}
                        </td>
                        <td
                          style={{ border: "1px solid #ddd", padding: "8px" }}
                        >
                          {row.saldoDevedor}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}

          <div
            style={{ textAlign: "left", marginTop: "20px", marginLeft: "10px" }}
          >
            {Number(installmentValue) > 0 && calculationDone && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: "5px",
                }}
              >
                <h1 style={{ fontSize: "1.2em" }}>
                  VALOR DA PARCELA:{" "}
                  <strong>{numberToWords(Number(installmentValue))}</strong>
                </h1>
                <p>({numeroPorExtenso(Number(installmentValue))}).</p>
              </div>
            )}
            {calculationDone && (
              <p>
                TOTAL DE PARCELAS: <strong>{payments}</strong>{" "}
                {payments > 1 ? "meses" : "mês"}.
              </p>
            )}
            {totalPaid > 0 && calculationDone && (
              <p>
                VALOR TOTAL: <strong>{numberToWords(totalPaid)}</strong> (
                {numeroPorExtenso(totalPaid)}).
              </p>
            )}
            {totalInterest > 0 && calculationDone && (
              <p>
                JUROS TOTAIS: <strong>{numberToWords(totalInterest)}</strong> (
                {numeroPorExtenso(totalInterest)}).
              </p>
            )}

            {calculationDone && calculationDone && (
              <p style={{ color: "green", marginTop: "10px" }}>
                * Nenhum custo adicional (IOF, TAC ou seguros) está incluído no
                cálculo.
              </p>
            )}
          </div>

          {calculationDone && (
            <button
              onClick={() => {
                setCurrentView("editor");
              }}
              style={{
                marginTop: "20px",
                padding: "10px 20px",
                fontSize: "1em",
                backgroundColor: "#28a745",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Configurar Contrato
            </button>
          )}
        </div>
      )}
      {currentView === "editor" && (
        <EditorContrato 
          voltar={() => setCurrentView("calculadora")} 
          parcelasCalculadas={parcelasCalculadas}
          dados={sendDataToContrat}
        />
      )}
    </div>
  );
};

export default SimuladorCredito;
