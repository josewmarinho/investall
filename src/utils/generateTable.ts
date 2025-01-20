interface Parcela {
    data: string;
    valor: string;
  }
  
  /**
   * Gera a tabela HTML para as condições de pagamento
   * @param {Parcela[]} parcelasCalculadas - Array de parcelas com data e valor
   * @returns {string} - Tabela HTML formatada
   */
  export const generateTable = (
    parcelasCalculadas: Parcela[],
  ): string => {
    return `${parcelasCalculadas.map((parcela, index) => `${index + 1}ª Parcela: ${parcela.data} -> R$ ${parcela.valor} \n`).join('')}`;
  };
  
  