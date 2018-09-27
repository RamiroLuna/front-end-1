let configChart = {
    chart: {
        type: 'column',
        height: null
    },
    credits: {
        enabled: false
    },
    exporting: {
        enabled: true
    },
    title: {
        text: '',
        style: {
            color: '#000'
        }
    },
    subtitle: {
        text: '',
        style: {
            color: '#000'
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
            text: ' Toneladas '
        },
        labels: {
            style: {
                color: '#000000',
            },
            formatter: function () {
                return this.value + 'T';
            }
        }

    },
    plotOptions: {
        series: {
            dataLabels: {
                enabled: false,
                color: '#FFFFFF',
                inside: false,
                // y: 10,
                // distance: -10
            },
            events: {
                legendItemClick: function () {
                    return false;
                }
            }
        },
        column: {
            stacking: 'normal'
        },
        line: {
            marker: {
                enabled: false
            }
        }
    },
    tooltip: {
        headerFormat: '<b>Dia: {point.x}</b><br/>',
        valueDecimals: 3
    },
    series: [],
};

export {
    configChart
}