import React, { useRef } from 'react';
import { Chart } from 'react-google-charts';

// Bibliotecas instaladas:
// npm install react-google-charts xlsx jspdf html2canvas

export default function ChartDashboard() {
  // Dados simulados
  const pieData = [
    ['Categoria', 'Quantidade'],
    ['Manutenção', 45],
    ['Troca de óleo', 26],
    ['Pneus', 12],
    ['Elétrica', 17],
  ];

  const barData = [
    ['Mês', 'Receita'],
    ['Jan', 4000],
    ['Fev', 3000],
    ['Mar', 5000],
    ['Abr', 4500],
    ['Mai', 6000],
  ];

  const lineData = [
    ['Dia', 'Check-ins'],
    ['01', 5],
    ['02', 9],
    ['03', 7],
    ['04', 10],
    ['05', 6],
    ['06', 12],
  ];

  // Referências para capturar o gráfico para PDF
  const pieRef = useRef(null);
  const barRef = useRef(null);
  const lineRef = useRef(null);

  // Export XLSX
  const exportToXLSX = async (name, data) => {
    const XLSX = await import('xlsx');
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Relatorio');
    XLSX.writeFile(wb, `${name}.xlsx`);
  };

  // Export PDF
  const exportToPDF = async (name, containerRef, data) => {
    const html2canvas = (await import('html2canvas')).default;
    const jsPDF = (await import('jspdf')).default;

    const element = containerRef.current;
    if (!element) return alert("Erro ao capturar gráfico!");

    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "pt", "a4");
    const pageWidth = pdf.internal.pageSize.width;

    pdf.text(name, 40, 30);

    const imgProps = pdf.getImageProperties(imgData);
    const imgWidth = pageWidth - 40;
    const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

    pdf.addImage(imgData, 'PNG', 20, 50, imgWidth, imgHeight);

    let y = 60 + imgHeight;

    pdf.setFontSize(10);
    pdf.text("Dados:", 40, y + 20);

    data.forEach((row, i) => {
      pdf.text(row.join("  |  "), 40, y + 40 + i * 14);
    });

    pdf.save(`${name}.pdf`);
  };

  return (
    <div style={{ padding: 20 }}>

      {/* PIZZA */}
      <h2>Gráfico de Pizza</h2>
      <button onClick={() => exportToXLSX("relatorio_pizza", pieData)}>Exportar XLSX</button>
      <button onClick={() => exportToPDF("relatorio_pizza", pieRef, pieData)}>Exportar PDF</button>

      <div ref={pieRef}>
        <Chart chartType="PieChart" data={pieData} width="100%" height="300px" />
      </div>

      <hr />

      {/* BARRA */}
      <h2>Gráfico de Barras</h2>
      <button onClick={() => exportToXLSX("relatorio_barra", barData)}>Exportar XLSX</button>
      <button onClick={() => exportToPDF("relatorio_barra", barRef, barData)}>Exportar PDF</button>

      <div ref={barRef}>
        <Chart chartType="ColumnChart" data={barData} width="100%" height="300px" />
      </div>

      <hr />

      {/* LINHAS */}
      <h2>Gráfico de Linhas</h2>
      <button onClick={() => exportToXLSX("relatorio_linha", lineData)}>Exportar XLSX</button>
      <button onClick={() => exportToPDF("relatorio_linha", lineRef, lineData)}>Exportar PDF</button>

      <div ref={lineRef}>
        <Chart chartType="LineChart" data={lineData} width="100%" height="300px" />
      </div>
    </div>
  );
}
