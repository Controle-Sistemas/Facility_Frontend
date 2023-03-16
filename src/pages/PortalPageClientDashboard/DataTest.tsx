import axios from 'axios';
import _ from 'lodash'

interface DashboardDataType {
    QtdeRegistros?: number,
    DataConsulta?: string,
    TotalVendasDia?: number,
    TicketMedio?: number,
    VendasFormaPagamento?: Array<{ Forma?: string, Valor?: number }>,
    TotalDiaCancelamentos?: number,
    TotalDiaDescontos?: number,
    TotalDiaTaxaServico?: number,
    TotalDiaCortesias?: number,
    RankingProdutos?: Array<{ Produto?: string, Qtde?: number, ValorTotal?: number }>,
    VendasPorHora?: Array<{ Hora?: string, Valor?: number }>,
    VendasPorTipo?: Array<{ Tipo?: string, Valor?: number }>,
    ConsumosEmAbertoQtde?: number,
    ConsumosEmAbertoValor?: number,
    EvolucaoVendasMes?: Array<{ Mes?: string, Valor?: number }>
}

class DataTest {
    getCleanJSON() {
        return {
            "qtdeRegistros": 20,
            "dataConsulta": "20-06-2022",
            "totalVendasDia": 2000.00,
            "ticketMedio": 145.00,
            "vendasFormaPagamento": [
                {
                    "Forma": "dinheiro",
                    "valor": 500.00
                },
                {
                    "Forma": "Cartao Credito",
                    "valor": 150.00
                },
                {
                    "Forma": "Cartao Debito",
                    "valor": 220.00
                },
                {
                    "Forma": "pIX",
                    "valor": 320.00
                }],
            "totalDiaCancelamentos": 500.00,
            "totalDiaDescontos": 300.00,
            "totalDiaTaxaServico": 150.00,
            "totalDiaCortesias": 10.00,
            "rankingProdutos": [
                {
                    "produto": 'COCA COLA',
                    "qtde": 10,
                    "valorTotal": 100.00
                },
                {
                    "produto": 'FANTA',
                    "qtde": 10,
                    "valorTotal": 100.00
                },
                {
                    "produto": 'RODIZIO',
                    "qtde": 10,
                    "valorTotal": 100.00
                },
                {
                    "produto": 'CERVEJA BRAHMA',
                    "qtde": 10,
                    "valorTotal": 100.00
                },
                {
                    "produto": 'PETIT GATEAU',
                    "qtde": 10,
                    "valorTotal": 100.00
                },
                {
                    "produto": 'X-TUDO',
                    "qtde": 10,
                    "valorTotal": 100.00
                },
                {
                    "produto": 'X-SALADA',
                    "qtde": 10,
                    "valorTotal": 100.00
                }],
            "vendasPorHora": [
                {
                    "hora": '16:00',
                    "valor": 100.00
                },
                {
                    "hora": '16:30',
                    "valor": 150.00
                },
                {
                    "hora": '17:00',
                    "valor": 300.00
                },
                {
                    "hora": '17:30',
                    "valor": 200.00
                },
                {
                    "hora": '18:00',
                    "valor": 50.00
                }],
            "vendasPorTipo": [
                {
                    "tipo": "Balcao",
                    "valor": 3000.00
                },
                {
                    "tipo": "delivery",
                    "valor": 3000.00
                },
                {
                    "tipo": "Mesa/Comanda",
                    "valor": 3000.00
                }],
            "ConsumosEmAbertoQtde": 3,
            "ConsumosEmAbertoValor": 300.00,
            "EvolucaoVendasMes": [
                {
                    "Mes": "01/2022",
                    "valor": 3000.00
                },
                {
                    "Mes": "02/2022",
                    "valor": 3050.00
                },
                {
                    "Mes": "03/2022",
                    "valor": 4500.00
                },
                {
                    "Mes": "04/2022",
                    "valor": 6000.00
                },
                {
                    "Mes": "05/2022",
                    "valor": 5500.00
                }],
        }
    }
    getData() {
        return axios.get('http://192.95.42.179:9000/socket/VWSALESPERMONTH', {
            headers: {
                "socket_client": '@20033038'
            },
        }).then(response => {
            return { res: response, error: false }
        }).catch(err => {
            return { res: err, error: true }
        })
    }

    getMeses() {
        return [
            { name: 'Janeiro', value: 'JANEIRO' },
            { name: 'Fevereiro', value: 'FEVEREIRO' },
            { name: 'Março', value: 'MARCO' },
            { name: 'Abril', value: 'ABRIL' },
            { name: 'Maio', value: 'MAIO' },
            { name: 'Junho', value: 'JUNHO' },
            { name: 'Julho', value: 'JULHO' },
            { name: 'Agosto', value: 'AGOSTO' },
            { name: 'Setembro', value: 'SETEMBRO' },
            { name: 'Outubro', value: 'OUTUBRO' },
            { name: 'Novembro', value: 'NOVEMBRO' },
            { name: 'Dezembro', value: 'DEZEMBRO' }]
    }

    getFormatedData(data: DashboardDataType) {
        var somaProdutosDia = 0;
        const totalProdutosDia = _.map(data.RankingProdutos, (value, key) => {
            somaProdutosDia += data.RankingProdutos[key].ValorTotal
        })

        const somaToTaisDia = _.sum([data.TotalDiaCancelamentos + data.TotalDiaCortesias + data.TotalDiaDescontos + data.TotalDiaTaxaServico]).toFixed(2);

        const vendasPorHora = _.groupBy(data.VendasPorHora, (value) => value.Hora);

        const vendasHoraResult = _.map(vendasPorHora, (value, key) => {
            console.log(value)
            return [
                key, _.sumBy(vendasPorHora[key], (v) => v.Valor)
            ]
        })

        var totalPagamentos = 0;
        const totalPagamentosDia = _.map(data.VendasFormaPagamento, (value, key) => {
            totalPagamentos += data.VendasFormaPagamento[key].Valor
        })

        var totalVendasPorTipo = 0;
        const somaVendasPorTipo = _.map(data.VendasPorTipo, (value, key) => {
            totalVendasPorTipo += data.VendasPorTipo[key].Valor
        })

        const dataVendasPorTipo = _.groupBy(data.VendasPorTipo, (value) => value.Tipo);
        const dataVendasPorTipoResult = _.map(dataVendasPorTipo, (value, key) => {
            return [
                key, _.sumBy(dataVendasPorTipo[key], (v) => v.Valor)
            ]
        })

        const dataEvolucaoVendasMes = _.groupBy(data.EvolucaoVendasMes, (value) => value.Mes);

        const dataEvolucaoVendasMesResult = _.map(dataEvolucaoVendasMes, (value, key) => {
            var aux = [
                this.getMeses()[parseInt(key.substring(0, 2)) - 1].name.substring(0, 3), (_.sumBy(dataEvolucaoVendasMes[key], (v) => v.Valor))
            ]
            return aux;
        })

        const totalVendasDia = data.TotalVendasDia;
        const ticketMedio = data.TicketMedio

        return {
            vendasHoraResult,
            dataVendasPorTipoResult,
            dataEvolucaoVendasMesResult,
            totalPagamentos,
            somaToTaisDia,
            somaProdutosDia,
            totalVendasPorTipo,
            totalVendasDia,
            ticketMedio

        }
    }

    getDataJSON() {
        return {
            "qtdeRegistros": 20,
            "dataConsulta": "20-06-2022",
            "totalVendasDia": 2000.00,
            "ticketMedio": 145.00,
            "vendasFormaPagamento": [
                {
                    "forma": "Dinheiro",
                    "valor": 500.00
                },
                {
                    "forma": "Cartao Credito",
                    "valor": 150.00
                },
                {
                    "forma": "Cartao Debito",
                    "valor": 220.00
                },
                {
                    "forma": "PIX",
                    "valor": 320.00
                }],
            "totalDiaCancelamentos": 500.00,
            "totalDiaDescontos": 300.00,
            "totalDiaTaxaServico": 150.00,
            "totalDiaCortesias": 10.00,
            "rankingProdutos": [
                {
                    "produto": 'COCA COLA',
                    "qtde": 10,
                    "valorTotal": 100.00
                },
                {
                    "produto": 'FANTA',
                    "qtde": 10,
                    "valorTotal": 100.00
                },
                {
                    "produto": 'RODIZIO',
                    "qtde": 10,
                    "valorTotal": 100.00
                },
                {
                    "produto": 'CERVEJA BRAHMA',
                    "qtde": 10,
                    "valorTotal": 100.00
                },
                {
                    "produto": 'PETIT GATEAU',
                    "qtde": 10,
                    "valorTotal": 100.00
                },
                {
                    "produto": 'X-TUDO',
                    "qtde": 10,
                    "valorTotal": 100.00
                },
                {
                    "produto": 'X-SALADA',
                    "qtde": 10,
                    "valorTotal": 100.00
                }],
            "vendasPorHora": [
                {
                    "hora": '16:00',
                    "valor": 100.00
                },
                {
                    "hora": '16:30',
                    "valor": 150.00
                },
                {
                    "hora": '17:00',
                    "valor": 300.00
                },
                {
                    "hora": '17:30',
                    "valor": 200.00
                },
                {
                    "hora": '18:00',
                    "valor": 50.00
                }],
            "vendasPorTipo": [
                {
                    "tipo": "Balcao",
                    "valor": 3000.00
                },
                {
                    "tipo": "delivery",
                    "valor": 3000.00
                },
                {
                    "tipo": "Mesa/Comanda",
                    "valor": 3000.00
                }],
            "consumosEmAbertoQtde": 3,
            "consumosEmAbertoValor": 300.00,
            "evolucaoVendasMes": [
                {
                    "mes": "01/2022",
                    "valor": 3000.00
                },
                {
                    "mes": "02/2022",
                    "valor": 3050.00
                },
                {
                    "mes": "03/2022",
                    "valor": 4500.00
                },
                {
                    "mes": "04/2022",
                    "valor": 6000.00
                },
                {
                    "mes": "05/2022",
                    "valor": 5500.00
                }],
        }
    }

    getSalesInAMonth() {
        return {
            "vWSalesInAmonth": [
                {
                    "totalRegistros": 24,
                    "dataHora": "02-06-2022 19:54:59"
                }
            ],
            "vWSalesInAmonth_D": [
                {
                    "DAYOFMONTH": "01",
                    "AWEEKDAY": "qUARTA-FEIRA",
                    "DINHEIRO": 1200.00,
                    "CARTAO": 7539.45,
                    "eWALLET": 500.00,
                    "CREDIARIO": 8000,
                    "CORTESIA": 65.49,
                    "AMOUNT": 6311.59
                },
                {
                    "DAYOFMONTH": "02",
                    "AWEEKDAY": "qUINTA-FEIRA",
                    "DINHEIRO": 1200.00,
                    "CARTAO": 7539.45,
                    "eWALLET": 500.00,
                    "CREDIARIO": 8000,
                    "CORTESIA": 65.49,
                    "AMOUNT": 6293.89
                },
                {
                    "DAYOFMONTH": "03",
                    "AWEEKDAY": "SEXTA-FEIRA",
                    "DINHEIRO": 1200.00,
                    "CARTAO": 7539.45,
                    "eWALLET": 500.00,
                    "CREDIARIO": 8000,
                    "CORTESIA": 65.49,
                    "AMOUNT": 9117.55
                },
                {
                    "DAYOFMONTH": "04",
                    "AWEEKDAY": "SABADO",
                    "DINHEIRO": 1200.00,
                    "CARTAO": 7539.45,
                    "eWALLET": 500.00,
                    "CREDIARIO": 8000,
                    "CORTESIA": 65.49,
                    "AMOUNT": 10624.44
                },
                {
                    "DAYOFMONTH": "07",
                    "AWEEKDAY": "tERCA-FEIRA",
                    "DINHEIRO": 1200.00,
                    "CARTAO": 7539.45,
                    "eWALLET": 500.00,
                    "CREDIARIO": 8000,
                    "CORTESIA": 65.49,
                    "AMOUNT": 5881.55
                },
                {
                    "DAYOFMONTH": "08",
                    "AWEEKDAY": "qUARTA-FEIRA",
                    "DINHEIRO": 1200.00,
                    "CARTAO": 7539.45,
                    "eWALLET": 500.00,
                    "CREDIARIO": 8000,
                    "CORTESIA": 65.49,
                    "AMOUNT": 6187.5
                },
                {
                    "DAYOFMONTH": "09",
                    "AWEEKDAY": "qUINTA-FEIRA",
                    "DINHEIRO": 1200.00,
                    "CARTAO": 7539.45,
                    "eWALLET": 500.00,
                    "CREDIARIO": 8000,
                    "CORTESIA": 65.49,
                    "AMOUNT": 6051.1
                },
                {
                    "DAYOFMONTH": "10",
                    "AWEEKDAY": "SEXTA-FEIRA",
                    "DINHEIRO": 1200.00,
                    "CARTAO": 7539.45,
                    "eWALLET": 500.00,
                    "CREDIARIO": 8000,
                    "CORTESIA": 65.49,
                    "AMOUNT": 14109.95
                },
                {
                    "DAYOFMONTH": "11",
                    "AWEEKDAY": "SABADO",
                    "DINHEIRO": 1200.00,
                    "CARTAO": 7539.45,
                    "eWALLET": 500.00,
                    "CREDIARIO": 8000,
                    "CORTESIA": 65.49,
                    "AMOUNT": 12811.72
                },
                {
                    "DAYOFMONTH": "12",
                    "AWEEKDAY": "dOMINGO",
                    "DINHEIRO": 1200.00,
                    "CARTAO": 7539.45,
                    "eWALLET": 500.00,
                    "CREDIARIO": 8000,
                    "CORTESIA": 65.49,
                    "AMOUNT": 1733.9
                },
                {
                    "DAYOFMONTH": "14",
                    "AWEEKDAY": "tERCA-FEIRA",
                    "DINHEIRO": 1200.00,
                    "CARTAO": 7539.45,
                    "eWALLET": 500.00,
                    "CREDIARIO": 8000,
                    "CORTESIA": 65.49,
                    "AMOUNT": 6007.45
                },
                {
                    "DAYOFMONTH": "15",
                    "AWEEKDAY": "qUARTA-FEIRA",
                    "DINHEIRO": 1200.00,
                    "CARTAO": 7539.45,
                    "eWALLET": 500.00,
                    "CREDIARIO": 8000,
                    "CORTESIA": 65.49,
                    "AMOUNT": 7650.45
                },
                {
                    "DAYOFMONTH": "16",
                    "AWEEKDAY": "qUINTA-FEIRA",
                    "DINHEIRO": 1200.00,
                    "CARTAO": 7539.45,
                    "eWALLET": 500.00,
                    "CREDIARIO": 8000,
                    "CORTESIA": 65.49,
                    "AMOUNT": 8546.65
                },
                {
                    "DAYOFMONTH": "17",
                    "AWEEKDAY": "SEXTA-FEIRA",
                    "DINHEIRO": 1200.00,
                    "CARTAO": 7539.45,
                    "eWALLET": 500.00,
                    "CREDIARIO": 8000,
                    "CORTESIA": 65.49,
                    "AMOUNT": 9007.8
                },
                {
                    "DAYOFMONTH": "18",
                    "AWEEKDAY": "SABADO",
                    "DINHEIRO": 1200.00,
                    "CARTAO": 7539.45,
                    "eWALLET": 500.00,
                    "CREDIARIO": 8000,
                    "CORTESIA": 65.49,
                    "AMOUNT": 10083.2
                },
                {
                    "DAYOFMONTH": "21",
                    "AWEEKDAY": "tERCA-FEIRA",
                    "DINHEIRO": 1200.00,
                    "CARTAO": 7539.45,
                    "eWALLET": 500.00,
                    "CREDIARIO": 8000,
                    "CORTESIA": 65.49,
                    "AMOUNT": 5392.1
                },
                {
                    "DAYOFMONTH": "22",
                    "AWEEKDAY": "qUARTA-FEIRA",
                    "DINHEIRO": 1200.00,
                    "CARTAO": 7539.45,
                    "eWALLET": 500.00,
                    "CREDIARIO": 8000,
                    "CORTESIA": 65.49,
                    "AMOUNT": 6658.05
                },
                {
                    "DAYOFMONTH": "23",
                    "AWEEKDAY": "qUINTA-FEIRA",
                    "DINHEIRO": 1200.00,
                    "CARTAO": 7539.45,
                    "eWALLET": 500.00,
                    "CREDIARIO": 8000,
                    "CORTESIA": 65.49,
                    "AMOUNT": 5442.51
                },
                {
                    "DAYOFMONTH": "24",
                    "AWEEKDAY": "SEXTA-FEIRA",
                    "DINHEIRO": 1200.00,
                    "CARTAO": 7539.45,
                    "eWALLET": 500.00,
                    "CREDIARIO": 8000,
                    "CORTESIA": 65.49,
                    "AMOUNT": 11827.35
                },
                {
                    "DAYOFMONTH": "25",
                    "AWEEKDAY": "SABADO",
                    "DINHEIRO": 1200.00,
                    "CARTAO": 7539.45,
                    "eWALLET": 500.00,
                    "CREDIARIO": 8000,
                    "CORTESIA": 65.49,
                    "AMOUNT": 8432.27
                },
                {
                    "DAYOFMONTH": "27",
                    "AWEEKDAY": "SEGUNDA-FEIRA",
                    "DINHEIRO": 1200.00,
                    "CARTAO": 7539.45,
                    "eWALLET": 500.00,
                    "CREDIARIO": 8000,
                    "CORTESIA": 65.49,
                    "AMOUNT": 7877.51
                },
                {
                    "DAYOFMONTH": "28",
                    "AWEEKDAY": "tERCA-FEIRA",
                    "DINHEIRO": 1200.00,
                    "CARTAO": 7539.45,
                    "eWALLET": 500.00,
                    "CREDIARIO": 8000,
                    "CORTESIA": 65.49,
                    "AMOUNT": 7877.51
                },
                {
                    "DAYOFMONTH": "29",
                    "AWEEKDAY": "qUARTA-FEIRA",
                    "DINHEIRO": 1200.00,
                    "CARTAO": 7539.45,
                    "eWALLET": 500.00,
                    "CREDIARIO": 8000,
                    "CORTESIA": 65.49,
                    "AMOUNT": 6151.05
                },
                {
                    "DAYOFMONTH": "30",
                    "AWEEKDAY": "qUINTA-FEIRA",
                    "DINHEIRO": 1200.00,
                    "CARTAO": 7539.45,
                    "eWALLET": 500.00,
                    "CREDIARIO": 8000,
                    "CORTESIA": 65.49,
                    "AMOUNT": 8033.85
                }
            ]
        }
    }

    getTotalSalesInAMonth() {
        const total = _.sumBy(this.getSalesInAMonth().vWSalesInAmonth_D, "aMOUNT");
        const cartao = _.sumBy(this.getSalesInAMonth().vWSalesInAmonth_D, "cARTAO");
        const eWallet = _.sumBy(this.getSalesInAMonth().vWSalesInAmonth_D, "eWALLET");
        const crediario = _.sumBy(this.getSalesInAMonth().vWSalesInAmonth_D, "cREDIARIO");
        const cortesia = _.sumBy(this.getSalesInAMonth().vWSalesInAmonth_D, "cORTESIA");
        const dinheiro = _.sumBy(this.getSalesInAMonth().vWSalesInAmonth_D, "aMOUNT");

        return {
            "DINHEIRO": dinheiro,
            "CARTAO": (cartao + eWallet),
            "eWALLET": eWallet,
            "CREDIARIO": crediario,
            "CORTESIA": cortesia,
            "TOTAL": total,
        }
    }

    getEvolutionInAMonth() {
        var sum = 0;
        var result = []
        this.getSalesInAMonth().vWSalesInAmonth_D.map((dia) => (
            sum += dia.AMOUNT | result.push({ "DIA": dia.DAYOFMONTH, "EVOLUTION": sum + dia.AMOUNT})
        ));
        
        return result;
    }


};

export default DataTest