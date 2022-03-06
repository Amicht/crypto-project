"use strict";

async function createChart(link){
    
    if(chartInterval){
        clearInterval(chartInterval);
    }
    const options = {
        exportEnabled: true,
        animationEnabled: true,
        title:{
            text: `${coinSymbolsArr.join(`, `)} to USD`
        },
        subtitles: [{
            text: "Click Legend to Hide or Unhide Data Series"
        }],
        axisX: {
            title: "Time"
        },
        axisY: {
            titleFontColor: "#4F81BC",
            lineColor: "#4F81BC",
            labelFontColor: "#4F81BC",
            tickColor: "#4F81BC"
        },
        axisY2: {
            title: "coin value in USD",
            titleFontColor: "#C0504E",
            lineColor: "#C0504E",
            labelFontColor: "#C0504E",
            tickColor: "#C0504E"
        },
        toolTip: {
            shared: true
        },
        legend: {
            cursor: "pointer",
            itemclick: toggleDataSeries
        },
        data: []
    };
    let coinDataAPI = await fetch(link).then(res => res.json());

    coinSymbolsArr.forEach(e => {
        if(coinDataAPI[e]){
            options.data.push({
                type: "line",
                name: e,
                axisYType: "secondary",
                showInLegend: true,
                xValueFormatString: "h:mm:ss",
                yValueFormatString: "$#,##0.#",
                dataPoints: [
                    { x: new Date(),  y: coinDataAPI[e].USD },
                ]
            })
        } 
        else{
            console.error(`ERROR: ${e} does not exist in this API`)
        }
            
    });
    $("#chartContainer").CanvasJSChart(options);
    chartInterval = setInterval(async function(){
        coinDataAPI = await fetch(link).then(res => res.json());
        //options.time +=2;
        
        var chart = $("#chartContainer").CanvasJSChart();
        chart.options.data.forEach((e) =>{
            if(coinDataAPI[e.name]){
                e.dataPoints.push({
                    x: new Date(), y: coinDataAPI[e.name].USD
                })
            }
        })
		chart.render();
    },2000)
    function toggleDataSeries(e) {
        if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
            e.dataSeries.visible = false;
        } else {
            e.dataSeries.visible = true;
        }
        e.chart.render();
    }
}