import React, { useState } from "react";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { saveAs } from "file-saver";
import { IoArrowBackOutline } from "react-icons/io5";
import { generateTable } from "../utils/generateTable";

// Dados do condomínio
interface DadosCondominio {
  condominio: string;
  cnpj: string;
  rua: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
}

// Dados do contratante-devedor
interface DadosContratante {
  contratante: string;
  nacionalidade: string;
  profissao: string;
  admissao: string;
  cpf: string;
  rg: string;
  orgao: string;
  rua: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
}

// Dados do contratante-devedor
interface DadosBMPGrafeno {
  contratante: string;
  cpf: string;
  rua: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  uf: string;
  cep: string;
  banco: string;
  agencia: string;
  conta: string;
}

interface Parcela {
  data: string;
  valor: string;
  amortizacao: string;
  saldo_devedor: string;
  juros: string;
}

interface EditorContratoProps {
  voltar: () => void;
  parcelasCalculadas: Parcela[];
  dados: {
    emprestimo: string;
    totalApagar: string;
    juros: string;
    numeroParcelas: number;
    totalApagarTexto: string;
    iof: string;
    valorCredito: string;
  }
}

const EditorContrato: React.FC<EditorContratoProps> = ({
  voltar,
  parcelasCalculadas,
  dados,
}) => {
  const [tipoContrato, setTipoContrato] = useState<"principal" | "aditivo" | "BMP GRAFENO">(
    "principal"
  );
  // Estado para dados do condomínio
  const [dadosCondominio, setDadosCondominio] = useState<DadosCondominio>({
    condominio: "",
    cnpj: "",
    rua: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
    cep: "",
  });

  // Estado para dados do contratante-devedor
  const [dadosContratante, setDadosContratante] = useState<DadosContratante>({
    contratante: "",
    nacionalidade: "",
    profissao: "",
    admissao: "",
    cpf: "",
    rg: "",
    orgao: "",
    rua: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
    cep: "",
  });

  // Estado para dados do contratante-devedor
  const [dadosContratanteBMPGRAFENO, setDadosContratanteBMPGRAFENO] = useState<DadosBMPGrafeno>({
    contratante: "",
    cpf: "",
    rua: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    uf: "",
    cep: "",
    banco: "",
    agencia: "",
    conta: ""
  });

  const tabelaCondicoes = generateTable(parcelasCalculadas);

  // Função para atualizar os dados do condomínio
  const handleChangeCondominio = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDadosCondominio({ ...dadosCondominio, [name]: value });
  };

  // Função para atualizar os dados do contratante-devedor
  const handleChangeContratante = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDadosContratante({ ...dadosContratante, [name]: value });
  };

  // Função para atualizar os dados do contratante BMP GRAFENO
const handleChangeContratanteBMPGRAFENO = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  setDadosContratanteBMPGRAFENO({ ...dadosContratanteBMPGRAFENO, [name]: value });
};


 // Function to generate the contract
const gerarContrato = async () => {
  try {

    // Define o modelo com base no tipo de contrato
    const modelo =
      tipoContrato === "aditivo"
        ? "/modelos/contrato_aditivo.docx"
        : tipoContrato === "BMP GRAFENO"
        ? "/modelos/contrato_bmpgrafeno.docx"
        : "/modelos/contrato_principal.docx";

    // Fetch the .docx template
    const response = await fetch(modelo);
    const arrayBuffer = await response.arrayBuffer();
    const zip = new PizZip(arrayBuffer);

    // Initialize Docxtemplater with options
    const doc = new Docxtemplater(zip, {
      linebreaks: true, // Support line breaks
      paragraphLoop: true,
      
    });

    // Prepare the data to be rendered
    const data = {
      // Dados do condomínio
      nomeCondominio: dadosCondominio.condominio,
      cnpjCondominio: dadosCondominio.cnpj,
      ruaCondominio: dadosCondominio.rua,
      numeroCondominio: dadosCondominio.numero,
      complementoCondominio: dadosCondominio.complemento || "",
      bairroCondominio: dadosCondominio.bairro,
      cidadeCondominio: dadosCondominio.cidade,
      estadoCondominio: dadosCondominio.estado,
      cepCondominio: dadosCondominio.cep,

      // Dados do contratante
      nomeContratante: dadosContratante.contratante,
      nacionalidadeContratante: dadosContratante.nacionalidade,
      profissaoContratante: dadosContratante.profissao,
      admissaoContratante: dadosContratante.admissao,
      cpfContratante: dadosContratante.cpf,
      rgContratante: dadosContratante.rg,
      orgaoContratante: dadosContratante.orgao,
      ruaContratante: dadosContratante.rua,
      numeroContratante: dadosContratante.numero,
      complementoContratante: dadosContratante.complemento || "",
      bairroContratante: dadosContratante.bairro,
      cidadeContratante: dadosContratante.cidade,
      estadoContratante: dadosContratante.estado,
      cepContratante: dadosContratante.cep,

      //Contrato BMPGRAFENO
      nomeCG: dadosContratanteBMPGRAFENO.contratante.toUpperCase(),
      cpfCG: dadosContratanteBMPGRAFENO.cpf,
      ruaCG: dadosContratanteBMPGRAFENO.rua,
      numeroCG: dadosContratanteBMPGRAFENO.numero,
      compCG: dadosContratanteBMPGRAFENO.complemento || "",
      bairroCG: dadosContratanteBMPGRAFENO.bairro,
      cidadeCG: dadosContratanteBMPGRAFENO.cidade,
      ufCG: dadosContratanteBMPGRAFENO.uf,
      cepCG: dadosContratanteBMPGRAFENO.cep,
      bancoCG: dadosContratanteBMPGRAFENO.banco.toUpperCase(),
      agenciaCG: dadosContratanteBMPGRAFENO.agencia,
      contaCG: dadosContratanteBMPGRAFENO.conta,

      // Tabela de condições
      tabelaCondicoes: tabelaCondicoes,

      credito: dados.emprestimo,
      valorCredito: dados.valorCredito,
      totalOperacao: dados.totalApagar,
      totalOperacaoTexto: dados.totalApagarTexto,
      totalParcelas: dados.numeroParcelas,
      taxaJuros: dados.juros,
      totalIOF: dados.iof,
    };

    // Render the document with the data
    await doc.renderAsync(data);

    // Generate the final document
    const blob = doc.getZip().generate({
      type: "blob",
      mimeType:
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });

  
    saveAs(
      blob,
      `Contrato_${tipoContrato}_${tipoContrato === "BMP GRAFENO" ? dadosContratanteBMPGRAFENO.contratante : dadosContratante.contratante}.docx`
    );
    console.log("Arquivo gerado com sucesso!");
  } catch (error) {
    console.error("Erro ao gerar contrato:", error);
  }
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
        marginBottom: "20px",
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
      <h2 style={{ textAlign: "center", marginLeft: 10, fontSize: 36 }}>
        Configurar Contrato
      </h2>
    </div>

    {/* Seleção do tipo de contrato */}
    <div style={{ textAlign: "left", marginBottom: "20px", padding: "10px" }}>
      <label>
        <strong style={{ fontSize: 24, textAlign: "left" }}>
          Tipo de Contrato:
        </strong>
      </label>
      <select
        value={tipoContrato}
        onChange={(e) =>
          setTipoContrato(e.target.value as "principal" | "aditivo" | "BMP GRAFENO")
        }
        style={{
          width: "100%",
          padding: "10px",
          margin: "10px 0",
          borderRadius: 10,
        }}
      >
        <option value="principal">Principal</option>
        <option value="aditivo">Aditivo</option>
        <option value="BMP GRAFENO">BMP GRAFENO</option>
      </select>
    </div>

    {/* Formulário para dados do condomínio */}
    {(tipoContrato === "principal" || tipoContrato === "aditivo") && (
      <div
        style={{ textAlign: "left", marginBottom: "20px", padding: "10px" }}
      >
        <label>
          <strong>Dados do Condomínio:</strong>
        </label>
        <div style={{ marginTop: 12, marginRight: 16 }}>
          {Object.keys(dadosCondominio).map((campo) => (
            <input
              key={campo}
              type="text"
              name={campo}
              value={dadosCondominio[campo as keyof DadosCondominio] || ""}
              onChange={handleChangeCondominio}
              placeholder={campo.charAt(0).toUpperCase() + campo.slice(1)}
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "10px",
                border: "0.5px solid #ccc",
                borderRadius: 10,
              }}
            />
          ))}
        </div>
      </div>
    )}

    {/* Formulário para dados do contratante-devedor */}
    {tipoContrato === "aditivo" && (
      <div
        style={{ textAlign: "left", marginBottom: "20px", padding: "10px" }}
      >
        <label>
          <strong>Dados do Contratante Devedor:</strong>
        </label>
        <div style={{ marginTop: 12, marginRight: 16 }}>
          {Object.keys(dadosContratante).map((campo) => (
            <input
              key={campo}
              type="text"
              name={campo}
              value={dadosContratante[campo as keyof DadosContratante] || ""}
              onChange={handleChangeContratante}
              placeholder={campo.charAt(0).toUpperCase() + campo.slice(1)}
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "10px",
                border: "0.5px solid #ccc",
                borderRadius: 10,
              }}
            />
          ))}
        </div>
      </div>
    )}

    {/* Formulário para BMP GRAFENO */}
    {tipoContrato === "BMP GRAFENO" && (
      <div
        style={{ textAlign: "left", marginBottom: "20px", padding: "10px" }}
      >
        <label>
          <strong>Dados BMP GRAFENO:</strong>
        </label>
        <div style={{ marginTop: 12, marginRight: 16 }}>
          {Object.keys(dadosContratanteBMPGRAFENO).map((campo) => (
            <input
              key={campo}
              type="text"
              name={campo}
              value={dadosContratanteBMPGRAFENO[campo as keyof DadosBMPGrafeno] || ""}
              onChange={handleChangeContratanteBMPGRAFENO}
              placeholder={campo.charAt(0).toUpperCase() + campo.slice(1)}
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "10px",
                border: "0.5px solid #ccc",
                borderRadius: 10,
              }}
            />
          ))}
        </div>
      </div>
    )}

    {/* Botão para gerar o contrato */}
    <button
      onClick={gerarContrato}
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
