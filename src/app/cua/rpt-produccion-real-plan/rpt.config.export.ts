let configChart = {
    chart: {
        type: 'column',
        backgroundColor: {
            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
            stops: [
                [0, 'rgb(77,182,172)'],
                [1, 'rgb(0,137,123)']
            ]
        }
    },
    credits: {
        enabled: false
    },
    title: {
        text: '',
        style: {
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
            text: ' Producción '
        },
        labels: {
            style: {
                color: '#fff',
            },
            formatter: function () {
                return this.value + 'T';
            }
        },
        // gridLineWidth:0
        gridLineColor: 'transparent',

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
        headerFormat: ''
    },
    series: [],
};

let configChartSpider = {

    chart: {
        polar: true,
        type: 'line',
        backgroundColor: '#009688'
    },

    title: {
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
                return this.value + ' T';
            }
        }
    },

    tooltip: {
        shared: true,
        pointFormat: '<span>{series.name}: <b>{point.y:,.0f}</b><br/>'
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
                enabled: false,
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
    configChart,
    configChartSpider
}