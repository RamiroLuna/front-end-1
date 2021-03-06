let configChart = {
    chart: {
        height: null,
        type: 'column',
        backgroundColor: {
            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
            stops: [
                [0, 'rgb(124,179,66)'],
                [1, 'rgb(51,105,30)']
            ]
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
            text: ' Producción ',
            style: {
                color: '#FFFFFF'
            }
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
                rotation: 0,
                format: '{point.y:,.3f}'
            }
        },
        line: {
            marker: {
                enabled: false
            }
        }
    },
    tooltip: {
        valueDecimals: 3,
        headerFormat: ''
    },
    series: [],
};

let configChartSpider = {

    chart: {
        polar: true,
        type: 'line',
        height: null
    },

    title: {
        text: '',
        x: -300,     
        style: {
            color: '#FFFFFF',
            fontSize: '20px'
        }
    },
    exporting: {
        enabled: true
    },
    credits: {
        enabled: false
    },
    pane: {
        size: '100%'
    },

    xAxis: {
        categories: [],
        tickmarkPlacement: 'on',
        lineWidth: 0,
        labels: {
            style: {
                color: '#33691E',
                fontWeight: 'bold'
            },
            y: -20
        },

    },

    yAxis: {
        gridLineInterpolation: 'polygon',
        lineWidth: 0,
        min: 0,

        labels: {
            enabled: false,
            style: {
                color: '#33691E',
            },
            formatter: function () {
                return '';
            }
        }
    },

    tooltip: {
        enabled: false,
        shared: true,
        pointFormat: '<span>{series.name}: <b>{point.y}</b><br/>'
    },

    legend: {
        itemStyle: {
            color: '#33691E'
        },
        x: -200,
        margin: 0
    },

    plotOptions: {
        series: {

            dataLabels: {
                overflow: 'none',
                allowOverlap: true,
                enabled: false,
                x: 0,
                y: -6,
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