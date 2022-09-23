export const dataTable = [
    ["Name", "Salary", "Full time employee","Name", "Salary", "Full time employee","Name", "Salary", "Full time employee","Name", "Salary", "Full time employee"],
    ["Mike", { v: 10000, f: "$10,000" }, true,"Mike", { v: 10000, f: "$10,000" }, true,"Mike", { v: 10000, f: "$10,000" }, true,"Mike", { v: 10000, f: "$10,000" }, true],
    ["Mike", { v: 10000, f: "$10,000" }, true,"Mike", { v: 10000, f: "$10,000" }, true,"Mike", { v: 10000, f: "$10,000" }, true,"Mike", { v: 10000, f: "$10,000" }, true],
    ["Mike", { v: 10000, f: "$10,000" }, true,"Mike", { v: 10000, f: "$10,000" }, true,"Mike", { v: 10000, f: "$10,000" }, true,"Mike", { v: 10000, f: "$10,000" }, true],
    ["Mike", { v: 10000, f: "$10,000" }, true,"Mike", { v: 10000, f: "$10,000" }, true,"Mike", { v: 10000, f: "$10,000" }, true,"Mike", { v: 10000, f: "$10,000" }, true],
    ["Mike", { v: 10000, f: "$10,000" }, true,"Mike", { v: 10000, f: "$10,000" }, true,"Mike", { v: 10000, f: "$10,000" }, true,"Mike", { v: 10000, f: "$10,000" }, true],
    ["Mike", { v: 10000, f: "$10,000" }, true,"Mike", { v: 10000, f: "$10,000" }, true,"Mike", { v: 10000, f: "$10,000" }, true,"Mike", { v: 10000, f: "$10,000" }, true],
    ["Mike", { v: 10000, f: "$10,000" }, true,"Mike", { v: 10000, f: "$10,000" }, true,"Mike", { v: 10000, f: "$10,000" }, true,"Mike", { v: 10000, f: "$10,000" }, true],
  ];
  
export const tableChartOptions = {
    title: "Company Performance",
    curveType: "function",
    legend: { position: "bottom" },
    pageSize: 15,
  };

  export const dataBar = [
    ["Year", "Sales"],
    ["2014", 1000],
  ];
  
  export const barChartOptions = {
    chart: {
      title: "Faturamento por Período",
    },
  };

  export const dataArea = [
    ["Mês", "Energia", "Água", "Gás"],
    ["Jan", 1000, 400, 250],
    ["Fev", 1170, 460, 250],
    ["Mar", 660, 1120, 550],
    ["Abr", 1030, 540, 1650],
    ["Mai", 660, 1120, 450],
    ["Jun", 1030, 540, 350],
    ["Jul", 660, 1120, 850],
    ["Ago", 1030, 540, 150],
    ["Set", 660, 1120, 50],
    ["Out", 1030, 540, 1250],
    ["Nov", 1030, 540, 250],
    ["Dez", 1030, 540, 1250],
  ];
  
  export const areaChartOptions = {
    title: "Custos (Energia, Água e Gás (Mensal))",
    hAxis: { title: "Mês", titleTextStyle: { color: "#333" } },
    vAxis: { minValue: 0 },
    chartArea: { width: "100%", height: "70%" },
  };
