interface Parcela {
    data: string;
    valor: string;
    amortizacao: string;
    saldo_devedor: string;
    juros: string;

  }
  
  /**
   * Gera a tabela HTML para as condições de pagamento
   * @param {Parcela[]} parcelasCalculadas - Array de parcelas com data e valor
   * @returns {string} - Tabela HTML formatada
   */
  export const generateTable = (
    parcelasCalculadas: Parcela[],
  ): string => {
    return `${parcelasCalculadas.map((parcela, index) => `${index + 1}ª : ${parcela.data} - ${parcela.saldo_devedor} - ${parcela.amortizacao} - ${parcela.juros} - ${parcela.valor} \n`).join('')}`;
  };
  
  