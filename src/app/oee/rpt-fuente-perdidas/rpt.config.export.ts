let configChart = {
    chart: {
        height: null,
        type: 'bar',
        borderWidth: 0,
        borderRadius: 0,
        plotBackgroundColor: null,
        plotShadow: false,
        plotBorderWidth: 0,
        options3d: {
            enabled: false,
            alpha: 10,
            beta: 2,
            depth: 95
        }
    },
    exporting: {
        enabled: true
    },
    credits: {
        enabled: false
    },
    title: {
        text: '',
        style: {
            color: '#b71c1c'
        }
    },
    subtitle: {
        text: '',
        style: {
            color: '#b71c1c'
        }
    },
    xAxis: {
        categories: [],
        labels: {
            style: {
                color: '#000'
            }
        }
    },
    yAxis: {
        title: {
            text: ''
        },
        labels: {
            style: {
                color: '#000',
            },
            formatter: function () {
                return this.value + ' Hrs';
            }
        },
        gridLineWidth: .5,
        gridLineColor: '#e57373',
        gridLineDashStyle: 'dot'

    },
    tooltip: {
        valueDecimals: 3
    },
    plotOptions: {
        series: {
            dataLabels: {
                enabled: true,
                color: '#000',
                inside: true,
                y: 0,
                distance: -10,
                format: '{y:.3f}',
                style: {
                    fontWeight: 'bold',
                    color: '#000',
                    textOutline: '1px',
                    fontSize: '10px'
                }
            }
        },
        bar: {
            depth: 75
        }
    },
    colors: ['#ef5350'],
    series: [],
};



export {
    configChart
}