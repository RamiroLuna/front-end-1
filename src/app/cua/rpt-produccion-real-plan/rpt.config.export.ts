// let configChart = {
//     chart: {
//         type: 'column',
//     },
//     credits: {
//         enabled: false
//     },
//     title: {
//         text: '',
//         style: {
//             color: '#000'
//         }
//     },
//     subtitle: {
//         text: '',
//         style: {
//             color: '#000'
//         }
//     },
//     xAxis: {
//         categories: [],
//         labels: {
//             style: {
//                 color: '#000'
//             }
//         }
//     },
//     yAxis: {
//         title: {
//             text: ' Producción '
//         },
//         labels: {
//             style: {
//                 color: '#000000',
//             },
//             formatter: function () {
//                 return this.value + 'T';
//             }
//         }

//     },
//     plotOptions: {
//         series: {
//             dataLabels: {
//                 enabled: false,
//                 color: '#FFFFFF',
//                 inside: false,
//                 // y: 10,
//                 // distance: -10
//             },
//             events: {
//                 legendItemClick: function () {
//                     return false;
//                 }
//             }
//         },
//         column: {
//             stacking: 'normal'
//         },
//         line: {
//             marker: {
//                 enabled: false
//             }
//         }
//     },
//     tooltip: {
//         headerFormat: ''
//     },
//     series: [],
// };

let configChartSpider = {

    chart: {
        polar: true,
        type: 'line'
    },

    title: {
        text: 'Budget vs spending',
        x: -80
    },

    pane: {
        size: '80%'
    },

    xAxis: {
        categories: ['Sales', 'Marketing', 'Development', 'Customer Support',
            'Information Technology', 'Administration'],
        tickmarkPlacement: 'on',
        lineWidth: 0
    },

    yAxis: {
        gridLineInterpolation: 'polygon',
        lineWidth: 0,
        min: 0
    },

    tooltip: {
        shared: true,
        pointFormat: '<span style="color:{series.color}">{series.name}: <b>${point.y:,.0f}</b><br/>'
    },

    legend: {
        align: 'right',
        verticalAlign: 'top',
        y: 70,
        layout: 'vertical'
    },

    series: [{
        name: 'Allocated Budget',
        data: [43000, 19000, 60000, 35000, 17000, 10000],
        pointPlacement: 'on'
    }, {
        name: 'Actual Spending',
        data: [50000, 39000, 42000, 31000, 26000, 14000],
        pointPlacement: 'on'
    }]

};



export {

    configChartSpider
}