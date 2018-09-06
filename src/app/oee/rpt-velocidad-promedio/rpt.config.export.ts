let configChartSpider = {

    chart: {
        height: null, 
        polar: true,
        type: 'line',
        backgroundColor: {
            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
            stops: [
                [0, 'rgb(66,165,245)'],
                [1, 'rgb(21,101,192)']
            ]
        }
    },
    exporting: {
        enabled: true
    },
    title: {
        text: '',
        style: {
            color: '#ffffff'
        }
    },
    subtitle: {
        text: '',
        style: {
            color: '#ffffff'
        }
    },
    credits: {
        enabled: false
    },
    pane: {
        size: '95%'
    },

    xAxis: {
        categories: ['GRUPO A', 'GRUPO B', 'GRUPO C', 'GRUPO D'],
        tickmarkPlacement: 'on',
        lineWidth: 0,
        labels: {
            style: {
                color: '#ffffff'
            }
        }
    },

    yAxis: {
        gridLineInterpolation: 'polygon',
        lineWidth: 0,
        min: 0,
        labels: {
            style: {
                color: '#000000',
            },
            formatter: function () {
                return this.value + ' T/Hr';
            }
        }
    },

    tooltip: {
        shared: true,
        pointFormat: '<span>{series.name}: <b>{point.y}</b><br/>'
    },

    legend: {
        // align: 'right',
        // verticalAlign: 'top',
        // y: 70,
        // layout: 'vertical'
    },

    plotOptions: {
        series: {
            dataLabels: {
                enabled: true,
                color: '#FFFFFF',
                inside: false,
                y: 10,
                distance: -10
            },
            events: {
                legendItemClick: function () {
                    return false;
                }
            }
        }
    },

    series: []

};



export {

    configChartSpider
}