//API Key: no
//NEVER *PUBLICLY* VERSION CONTROL API KEYS
//import {Chart} from './chart.js/dist/chart.js'


const APIBasePrefix = 'https://api.twelvedata.com/'
const WSBasePrefix = 'wss://ws.twelvedata.com/'

const APISortTime = 'time_series?'
const APISymbolPrefix = 'symbol='

async function main() {
    const timeChartCanvas = document.querySelector('#time-chart');
    const highestPriceChartCanvas = document.querySelector('#highest-price-chart');
    const averagePriceChartCanvas = document.querySelector('#average-price-chart');

    //API key is given by an external file as I will not be including it in version control (GitHub) for the sake of security
    const resp = await fetch(APIBasePrefix+APISortTime+APISymbolPrefix+"GME,MSFT,DIS,BNTX&interval=1min&apikey="+getAPIKey())

    const result = await resp.json()
    console.log(result)

    const { GME, MSFT, DIS, BNTX } = result;
    const stocks = [GME, MSFT, DIS, BNTX];

    stocks.forEach( stock => stock.values.reverse())


    new Chart(timeChartCanvas.getContext('2d'), {
        type: 'line',
        data: {
            labels: stocks[0].values.map(value => value.datetime),
            datasets: stocks.map( stock => ({
                label: stock.meta.symbol,
                data: stock.values.map(value => parseFloat(value.high)),
                backgroundColor: getColor(stock.meta.symbol),
                borderColor: getColor(stock.meta.symbol),
            }))
        }
    })

    new Chart(highestPriceChartCanvas.getContext('2d'), {
        type: 'bar',
        data: {
            labels: stocks.map(stock => stock.meta.symbol),
            datasets: [{
                label: "Highest",
                data: stocks.map(stock => (
                    getHighestPrice(stock.values)
                )),
                backgroundColor: stocks.map(stock => (
                    getColor(stock.meta.symbol)
                )),
                borderColor: stocks.map(stock => (
                    getColor(stock.meta.symbol)
                ))
            }]
        }
    })

    new Chart(averagePriceChartCanvas.getContext('2d'), {
        type: 'pie',
        data: {
            labels: stocks.map(stock => stock.meta.symbol),
            datasets: [{
                label: "Average",
                backgroundColor: stocks.map(stock => (
                    getColor(stock.meta.symbol)
                )),
                borderColor: stocks.map(stock => (
                    getColor(stock.meta.symbol)
                )),
                data: stocks.map(stock => (
                    getAveragePrice(stock.values)
                ))
            }]
        }
    });
}

function getColor(stock){
    if(stock === "GME"){
        return 'rgba(61, 161, 61, 0.7)'
    }
    if(stock === "MSFT"){
        return 'rgba(209, 4, 25, 0.7)'
    }
    if(stock === "DIS"){
        return 'rgba(18, 4, 209, 0.7)'
    }
    if(stock === "BNTX"){
        return 'rgba(166, 43, 158, 0.7)'
    }
}

function getHighestPrice(stockValues) {
    let high = 0
    stockValues.forEach( stockValue => {
        if (parseFloat(stockValue.high) > high ) {
            high = stockValue.high
        }
    })
    return high
}

function getAveragePrice(stockValues) {
    let totalPrice = 0
    stockValues.forEach( stockValue => {
        totalPrice += parseFloat(stockValue.high)
    })
    return totalPrice / stockValues.length
}

await main()