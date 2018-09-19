var Chart = require('chart.js');
require('chartjs-plugin-streaming');
var ctx = document.getElementById("myChart").getContext('2d');
var chart = new Chart(ctx, {
    type: 'line',
    data: {
        datasets: [
            {
                data: [],
                borderColor: 'rgb(255, 99, 132)',
            }, {
                data: [],
                borderColor: 'rgb(54, 162, 235)',
            }
        ]
    },
    options: {
        scales: {
            xAxes: [{
                type: 'realtime'
            }]
        },
        plugins: {
            streaming: {
                onRefresh: function() {
                    chart.data.datasets.forEach(function(dataset) {
                        dataset.data.push({
                            x: Date.now(),
                            y: Math.random()
                        }
                        );
                    });
                },
                delay: 2000,
            }
        }
    }
});