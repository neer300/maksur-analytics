var Chart = require('chart.js');
// require('chartjs-plugin-streaming');

function getRandomNumber(max) {
    return Math.floor(Math.random() * Math.floor(max));
}
function getRandomColor() {
    return 'rgb(' + getRandomNumber(255) + ', ' + getRandomNumber(255) + ', ' + getRandomNumber(255) + ')';
}

function showChart(canvasId, dataSets, xLabel, xType, yLabel) {
    var ctx = document.getElementById(canvasId).getContext('2d');
    var chart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: dataSets
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
                        labelString: xLabel
                    },
                    type: xType
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: yLabel
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
}

const { readFromFile } = require('./reader');
readFromFile().then(function(results) {
    console.log('Result', results);

    var chartDataSets = results.map(function(item) {
        return {
            data: item.data.map(function(entry) {
                return {
                    x: entry.time,
                    y: entry.metal_loss
                }
            }),
            label: item.source,
            borderColor: getRandomColor(),
            fill: false
        }
    })
    console.log(chartDataSets);
    showChart('myChart', chartDataSets, 'Time', 'time', 'Metal Loss');

    // Map temperature
    var temperatureDataSet = results.map(function(item) {
        return {
            data: item.data.map(function(entry) {
                return {
                    x: entry.time,
                    y: entry.temperature
                }
            }),
            label: item.source,
            borderColor: getRandomColor(),
            fill: false
        }
    });
    showChart('tempChart', temperatureDataSet, 'Time', 'time', 'Temperature');

    // Map differences
    var timeWindow = 60;
    var diffDataSet = results.map(function(item) {
        return {
            data: item.data.map(function(entry, index) {
                if (index >= timeWindow) {
                    var previousEntry = item.data[index - timeWindow];
                    var diffValue = entry.metal_loss - previousEntry.metal_loss;
                    var diffTimeMs = entry.time - previousEntry.time; // Value in ms
                    var diffTimeHour = diffTimeMs / (1 * 60 * 60 * 1000); // 1 hr * 60 min * 60 sec * 1000 ms
                    var change = (diffValue / diffTimeHour).toExponential();
                    return {
                        x: entry.time,
                        y: diffValue
                    };
                } else {
                    return {
                        x: entry.time,
                        y: 0
                    }
                }
            }),
            label: item.source,
            borderColor: getRandomColor(),
            fill: false,
            cubicInterpolationMode : 'monotone'
        }
    });
    console.log(diffDataSet);

    showChart('diffChart', diffDataSet, 'Time', 'time', 'Change every hour');
});
