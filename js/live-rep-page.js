`use strict`;
const APILink = `https://min-api.cryptocompare.com/data/pricemulti?`
const APIKEY = `19297a75c9cd52b820114dddd16739ededb5e917341534c55913e5cf2037dd53`;
var coinSymbolsArr;

function APIBuilder(){
    
    const Parametes = {
        coin: `fsyms`,
        currency: `tsyms`,
        API_key: `api_key`
    }
    function getCoins(myCoins){
        let coinSymbols = [];
        myCoins.forEach(e => {
            const coinID = e;
            let coinIndex = CACHECoinList.findIndex(e => coinID == e.id);
            
            coinSymbols.push(CACHECoinList[coinIndex].symbol.toUpperCase());
        })
        coinSymbolsArr = coinSymbols;
        let coinSTR = coinSymbols.join(`,`);
        return `&` + Parametes.coin + '=' + coinSTR;
    }
    function getCurrency(currencyArr){
        let currencySTR = currencyArr[0]
        if(currencyArr.length>1){
            currencySTR = currencyArr.join(`,`)
        }
        return `&` + Parametes.currency + `=` + currencySTR;
    }
    function getKey(key){
        return `&` + Parametes.API_key + `=` + key;
    }
    return {
        getCoins,
        getCurrency,
        getKey
    }
}

function reportsPage(event){
    load_more_btn.style.display = `none`;
    let liveDAtaRepLink = APILink;
    liveDAtaRepLink += APIBuilder().getCoins(myCoins);
    liveDAtaRepLink += APIBuilder().getCurrency([`USD`]);
    liveDAtaRepLink += APIBuilder().getKey(APIKEY);

    contentDiv.innerHTML = `<div id="chartContainer" style="height: 300px; width: 100%; text-align:center;">${createSpinner()}</div>`;
    const liveData = createChart(liveDAtaRepLink);
}