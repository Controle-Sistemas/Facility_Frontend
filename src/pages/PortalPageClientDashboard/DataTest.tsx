import axios from 'axios';

class DataTest{
    getData(){
            return axios.get('http://192.95.42.179:9000/socket/VWSALESPERMONTH',{
                headers:{
                    "socket_client":'@20033038'
                },       
            }).then(response => {
                return {res:response, error: false}
            }).catch(err => {
                return {res:err, error: true}
            })
    }

    getDataJSON(){
        return {
            "QtdeRegistros":20,
            "DataConsulta":"20-06-2022",
            "TotalVendasDia":2000.00,
            "TicketMedio": 145.00,
            "VendasFormaPagamento":[
                                    {"Forma":"Dinheiro",
                                    "Valor":500.00
                                    },
                                    {"Forma":"Cartao Credito",
                                    "Valor":150.00
                                    },
                                    {"Forma":"Cartao Debito",
                                    "Valor":220.00
                                    },
                                    {"Forma":"PIX",
                                    "Valor":320.00
                                    }],
            "TotalDiaCancelamentos": 500.00,
            "TotalDiaDescontos": 300.00,
            "TotalDiaTaxaServico": 150.00,
            "TotalDiaCortesias": 10.00,
            "RankingProdutos":[
                            {"Produto":'COCA COLA',
                                "Qtde": 10,
                                "ValorTotal": 100.00
                            },
                            {"Produto":'FANTA',
                                "Qtde": 10,
                                "ValorTotal": 100.00
                            },
                            {"Produto":'RODIZIO',
                                "Qtde": 10,
                                "ValorTotal": 100.00
                            },
                            {"Produto":'CERVEJA BRAHMA',
                                "Qtde": 10,
                                "ValorTotal": 100.00
                            },
                            {"Produto":'PETIT GATEAU',
                                "Qtde": 10,
                                "ValorTotal": 100.00
                            },
                            {"Produto":'X-TUDO',
                                "Qtde": 10,
                                "ValorTotal": 100.00
                            },
                            {"Produto":'X-SALADA',
                                "Qtde": 10,
                                "ValorTotal": 100.00
                            }],
            "VendasPorHora":[
                            {"Hora": '16:00',
                            "Valor": 100.00
                            },
                            {"Hora": '16:30',
                            "Valor": 150.00
                            },
                            {"Hora": '17:00',
                            "Valor": 300.00
                            },
                            {"Hora": '17:30',
                            "Valor": 200.00
                            },
                            {"Hora": '18:00',
                            "Valor": 50.00
                            }],
            "VendasPorTipo":[
                            {"Tipo":"Balcao",
                            "Valor":3000.00
                            },
                            {"Tipo":"Delivery",
                            "Valor":3000.00
                            },
                            {"Tipo":"Mesa/Comanda",
                            "Valor":3000.00
                            }],
            "ConsumosEmAbertoQtde": 3,
            "ConsumosEmAbertoValor": 300.00,            
            "EvolucaoVendasMes":[
                {"Mes":"01/2022",
                "Valor": 3000.00
                },
                {"Mes":"02/2022",
                "Valor": 3050.00
                },
                {"Mes":"03/2022",
                "Valor": 4500.00
                },
                {"Mes":"04/2022",
                "Valor": 6000.00
                },
                {"Mes":"05/2022",
                "Valor": 5500.00
                }],
        }
    }
};

export default DataTest