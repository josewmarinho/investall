import React, { useState } from "react";
import { IoArrowBackOutline } from "react-icons/io5";

const contratos: { principal: string; aditivo: string } = {
  principal: `CONTRATO PRINCIPAL – N. 02:

O presente instrumento corresponde ao Contrato-Principal...`,
  aditivo: `CONTRATO SECUNDÁRIO – TERMO ADITIVO N.03, AO CONTRATO PRINCIPAL N. 01:

O presente Contrato Secundário, doravante denominado de TERMO ADITIVO...`,
};

interface EditorContratoProps {
  voltar: () => void;
}

const EditorContrato: React.FC<EditorContratoProps> = ({ voltar }) => {
  const [tipoContrato, setTipoContrato] =
    useState<keyof typeof contratos>("principal");
  const [dadosContrato, setDadosContrato] = useState({
    contratante: "",
    cnpj: "",
    endereco: "",
    cidade: "",
    estado: "",
    cep: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDadosContrato({ ...dadosContrato, [name]: value });
  };

  const gerarContrato = (): string => {
    let textoContrato = contratos[tipoContrato];

    textoContrato = textoContrato
      .replace(/CONTRATANTE:.*/i, `CONTRATANTE: ${dadosContrato.contratante}`)
      .replace(/C.N.P.J. n.*/i, `C.N.P.J. n° ${dadosContrato.cnpj}`)
      .replace(/com sede na .*,/i, `com sede na ${dadosContrato.endereco},`)
      .replace(
        /Teresina PI,/i,
        `${dadosContrato.cidade} ${dadosContrato.estado},`
      )
      .replace(/Cep \\d{5}-\\d{3}/i, `Cep ${dadosContrato.cep}`);

    return textoContrato;
  };

  const downloadContrato = () => {
    const textoContrato = gerarContrato();
    const blob = new Blob([textoContrato], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Contrato-${tipoContrato}.txt`;
    link.click();
  };

  return (
    <main
      style={{
        width: "100%",
        maxWidth: "800px",
        textAlign: "center",
        background: "#fff",
        padding: "20px",
        borderRadius: "10px",
        marginBottom: "100px",
        marginTop: "30px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        <button
          onClick={voltar}
          style={{
            padding: "10px 20px",
            fontSize: "2em",
            border: "none",
            cursor: "pointer",
            background: "transparent",
          }}
        >
          <IoArrowBackOutline />
        </button>
        <div style={{ flex: 1, marginRight: "50px" }}>
          <h2>Configurar Contrato</h2>
        </div>
      </div>

      {/* Seleção de tipo de contrato */}
      <div style={{ textAlign: "left", marginBottom: "20px" }}>
        <label>
          <strong>Tipo de Contrato:</strong>
        </label>
        <select
          value={tipoContrato}
          onChange={(e) =>
            setTipoContrato(e.target.value as keyof typeof contratos)
          }
          style={{ padding: "10px", width: "100%", maxWidth: "300px" }}
        >
          <option value="principal">Contrato Principal</option>
          <option value="aditivo">Contrato Aditivo</option>
        </select>
      </div>

      {/* Inputs para dados do contrato */}
      <div style={{ textAlign: "left", marginBottom: "20px" }}>
        <label>
          <strong>Dados da Parte Contratante:</strong>
        </label>
        <div>
          <input
            type="text"
            name="contratante"
            value={dadosContrato.contratante}
            onChange={handleChange}
            placeholder="Nome do Contratante"
            style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
          />
          <input
            type="text"
            name="cnpj"
            value={dadosContrato.cnpj}
            onChange={handleChange}
            placeholder="CNPJ"
            style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
          />
          <input
            type="text"
            name="endereco"
            value={dadosContrato.endereco}
            onChange={handleChange}
            placeholder="Endereço"
            style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
          />
          <input
            type="text"
            name="cidade"
            value={dadosContrato.cidade}
            onChange={handleChange}
            placeholder="Cidade"
            style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
          />
          <input
            type="text"
            name="estado"
            value={dadosContrato.estado}
            onChange={handleChange}
            placeholder="Estado"
            style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
          />
          <input
            type="text"
            name="cep"
            value={dadosContrato.cep}
            onChange={handleChange}
            placeholder="CEP"
            style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
          />
        </div>
      </div>

      <button
        onClick={downloadContrato}
        style={{
          padding: "10px 20px",
          fontSize: "1em",
          backgroundColor: "#007BFF",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Baixar Contrato
      </button>
    </main>
  );
};

export default EditorContrato;
