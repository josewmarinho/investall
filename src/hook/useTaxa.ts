import { useMemo } from "react";

interface Taxa {
  categoria: string;
  semRestricao: number;
  comRestricao: number;
}

export const useTaxa = (taxas: Taxa[], selectedCategoria: string, restrictionType: "semRestricao" | "comRestricao") => {
  const taxa = useMemo(() => {
    const taxaSelecionada = taxas.find((t) => t.categoria === selectedCategoria);
    const value = taxaSelecionada?.[restrictionType] ?? 0;

    return typeof value === "number" ? parseFloat(value.toFixed(2)) : 0;
  }, [taxas, selectedCategoria, restrictionType]);

  return taxa;
};
