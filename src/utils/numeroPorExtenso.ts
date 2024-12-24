const unidades = [
  '', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove',
];
const dezenas = [
  '', '', 'vinte', 'trinta', 'quarenta', 'cinquenta', 'sessenta', 'setenta', 'oitenta', 'noventa',
];
const especiais = [
  'dez', 'onze', 'doze', 'treze', 'quatorze', 'quinze', 'dezesseis', 'dezessete', 'dezoito', 'dezenove',
];
const centenas = [
  '', 'cento', 'duzentos', 'trezentos', 'quatrocentos', 'quinhentos', 'seiscentos', 'setecentos', 'oitocentos', 'novecentos',
];

const numeroPorExtensoHelper = (num: number): string => {
  if (num === 100) return 'cem';
  if (num < 10) return unidades[num];
  if (num < 20) return especiais[num - 10];
  if (num < 100) {
    const dezena = Math.floor(num / 10);
    const unidade = num % 10;
    return `${dezenas[dezena]}${unidade ? ' e ' + unidades[unidade] : ''}`;
  }
  if (num < 1000) {
    const centena = Math.floor(num / 100);
    const resto = num % 100;
    return `${centenas[centena]}${resto ? ' e ' + numeroPorExtensoHelper(resto) : ''}`;
  }
  if (num < 1000000) {
    const milhar = Math.floor(num / 1000);
    const resto = num % 1000;
    return `${milhar === 1 ? 'mil' : numeroPorExtensoHelper(milhar) + ' mil'}${
      resto ? ' e ' + numeroPorExtensoHelper(resto) : ''
    }`;
  }
  return '';
};

export const numeroPorExtenso = (valor: number): string => {
  const partes = valor.toFixed(2).split('.');
  const inteiro = parseInt(partes[0], 10);
  const centavos = parseInt(partes[1], 10);

  const parteInteira = numeroPorExtensoHelper(inteiro) + (inteiro === 1 ? ' real' : ' reais');
  const parteCentavos =
    centavos > 0
      ? numeroPorExtensoHelper(centavos) + (centavos === 1 ? ' centavo' : ' centavos')
      : '';

  return centavos > 0 ? `${parteInteira} e ${parteCentavos}` : parteInteira;
};
