let configChart = {
    chart: {
        type: 'column',
        backgroundColor: {
            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
            stops: [
                [0, 'rgb(124,179,66)'],
                [1, 'rgb(51,105,30)']
            ]
        }
    },
    credits: {
        enabled: false
    },
    title: {
        text: '',
        style: {
            fontSize: '14px',
            color: '#fff'
        }
    },
    subtitle: {
        text: '',
        style: {
            color: '#fff'
        }
    },
    xAxis: {
        categories: [],
        labels: {
            style: {
                color: '#fff'
            }
        }
    },
    yAxis: {
        title: {
            text: '',
            style: {
                color: '#FFFFFF'
            },
            enabled: false
        },
        labels: {
            style: {
                color: '#fff',
            },
            formatter: function () {
                return this.value + 'T';
            }
        },
        gridLineWidth: 0.1,
        gridLineColor: '#e0f2f1',
        gridLineDashStyle: 'longdash'
    },
    legend: {
        itemStyle: {
            color: '#FFFFFF'
        }
    },
    plotOptions: {
        series: {
            events: {
                legendItemClick: function () {
                    return false;
                }
            }
        },
        column: {
            dataLabels: {
                enabled: true,
                color: '#000000',
                inside: true,
                rotation: 0
            }
        },
        line: {
            marker: {
                enabled: false
            }
        }
    },
    tooltip: {
        headerFormat: ''
    },
    series: [],
};



export {

    configChart
}