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

  export const dataTable2 = [
    ["Name", "Salary", "Full time employee","Name", "Salary", "Full time employee"],
    ["Mike", { v: 10000, f: "$10,000" }, true,"Mike", { v: 10000, f: "$10,000" }, true],
    ["Mike", { v: 10000, f: "$10,000" }, true,"Mike", { v: 10000, f: "$10,000" }, true],
    ["Mike", { v: 10000, f: "$10,000" }, true,"Mike", { v: 10000, f: "$10,000" }, true],
    ["Mike", { v: 10000, f: "$10,000" }, true,"Mike", { v: 10000, f: "$10,000" }, true],
    ["Mike", { v: 10000, f: "$10,000" }, true,"Mike", { v: 10000, f: "$10,000" }, true],
    ["Mike", { v: 10000, f: "$10,000" }, true,"Mike", { v: 10000, f: "$10,000" }, true],
    ["Mike", { v: 10000, f: "$10,000" }, true,"Mike", { v: 10000, f: "$10,000" }, true],
  ];
  
  
export const tableChartOptions = {
    title: "Faturamento x Custo x Resultados - Mensal",
    curveType: "function",
    legend: { position: "bottom" },
    pageSize: 15,
  };

  export const dataBar = [
    ["Mês", "Sales"],
    ["Jan", 1000],
    ["Fev", 1170],
    ["Mar", 660], 
    ["Abr", 1030],
    ["Mai", 1170],
    ["Jun", 660], 
    ["Ago", 1030],
    ["Set", 660], 
    ["Out", 1030],
    ["Nov", 660], 
    ["Dez", 1030],
    ];

    export const dataBar2 = [
        ["Ano", ""],
        ["2022", 1000],
        ];
  export const barChartOptions2 = {
    chartArea: { width: "100%", height: "70%" },
    hAxis: { title: "", titleTextStyle: { color: "#333"} },
    vAxis: { title:"", minValue: 0 },
  };    

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

  export const dataArea2 = [
    ["Hora", "Venda"],
    ["16:00", 1000],
    ["16:30", 1170],
    ["17:00", 660],
    ["18:00", 1030]
  ];
  
  export const areaChartOptions = {
    title: "Custos (Energia, Água e Gás (Mensal))",
    hAxis: { title: "Mês", titleTextStyle: { color: "#333"} },
    vAxis: { minValue: 0 },
    chartArea: { width: "80%", height: "70%" },
  };

  export const dataCandle = [
    ["Mês", "a", "b", "c", "d"],
    ["Jan", 20, 28, 38, 45],
    ["Fev", 31, 38, 55, 66],
    ["Mar", 50, 55, 77, 80],
    ["Abr", 50, 77, 66, 77],
    ["Mai", 15, 66, 22, 68],
    ["Jun", 31, 38, 55, 66],
    ["Jul", 50, 55, 77, 80],
    ["Ago", 50, 77, 66, 77],
    ["Set", 15, 66, 22, 68],
    ["Out", 50, 77, 66, 77],
    ["Nov", 15, 66, 22, 68],
    ["Dez", 50, 77, 66, 77],
  ];

  export const candleChartOptions = {
    legend: "none",
  };


  export const dataLine = [
    [
      "Day",
      "Guardians of the Galaxy",
      "The Avengers",
      "Transformers: Age of Extinction",
    ],
    [1, 37.8, 80.8, 41.8],
    [2, 30.9, 69.5, 32.4],
    [3, 25.4, 57, 25.7],
    [4, 11.7, 18.8, 10.5],
    [5, 11.9, 17.6, 10.4],
    [6, 8.8, 13.6, 7.7],
    [7, 7.6, 12.3, 9.6],
    [8, 12.3, 29.2, 10.6],
    [9, 16.9, 42.9, 14.8],
    [10, 12.8, 30.9, 11.6],
    [11, 5.3, 7.9, 4.7],
    [12, 6.6, 8.4, 5.2],
    [13, 4.8, 6.3, 3.6],
    [14, 4.2, 6.2, 3.4],
  ];
  
  export const LineChartOptions = {
    chart: {
      title: "Box Office Earnings in First Two Weeks of Opening",
      subtitle: "in millions of dollars (USD)",
    },
  };