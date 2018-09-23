var Chart = require('chart.js');
// require('chartjs-plugin-streaming');
var ctx = document.getElementById("myChart").getContext('2d');

function getRandomNumber(max) {
    return Math.floor(Math.random() * Math.floor(max));
}
function getRandomColor() {
    return 'rgb(' + getRandomNumber(255) + ', ' + getRandomNumber(255) + ', ' + getRandomNumber(255) + ')';
}

const { readFromFile } = require('./reader');
readFromFile().then(function(results) {
    console.log('Result', results);

    var chartDataSets = results.map(function(item) {
        return {
            data: item.data.map(function(entry) {
                return {
                    x: new Date(entry.time),
                    y: entry.metal_loss
                }
            }),
            label: item.source,
            borderColor: getRandomColor(),
            fill: false
        }
    })
    console.log(chartDataSets);
    var chart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: chartDataSets
        },
        options: {
            responsive: true,
            title: {
                display: true,
                text: 'Maksur Charts'
            },
            tooltips: {
                mode: 'index',
                intersect: false,
            },
            hover: {
                mode: 'nearest',
                intersect: true
            },
            scales: {
                xAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Time'
                    },
                    type: 'time'
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Metal Loss'
                    }
                }]
            }
            // scales: {
            //     xAxes: [{
            //         type: 'realtime'
            //     }]
            // },
            // plugins: {
            //     streaming: {
            //         onRefresh: function() {
            //             chart.data.datasets.forEach(function(dataset) {
            //                 dataset.data.push({
            //                     x: Date.now(),
            //                     y: Math.random()
            //                 }
            //                 );
            //             });
            //         },
            //         delay: 2000,
            //     }
            // }
        }
    });
});