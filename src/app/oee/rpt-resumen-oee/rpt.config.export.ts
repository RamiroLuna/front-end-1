let configChartOEE = {
    chart: {
        type: 'column',
        borderWidth: 0,
        borderRadius: 0,
        plotBackgroundColor: null,
        plotShadow: false,
        plotBorderWidth: 0,
        options3d: {
            enabled: true,
            alpha: 10,
            beta: 1,
            depth: 56
        }
    },
    credits: {
        enabled: false
    },
    title: {
        text: '',
        style: {
            color: '#1a237e'
        }
    },
    subtitle: {
        text: '',
        style: {
            color: '#1a237e'
        }
    },
    xAxis: {
        categories: [],
        labels: {
            style: {
                color: '#000000'
            }
        },
        gridLineWidth: 0
    },
    yAxis: {
        title: {
            text: ''
        },
        labels: {
            style: {
                color: '#000000',
            },
            formatter: function () {
                return this.value + ' %';
            }
        },
        gridLineWidth: 1,
        gridLineColor: '#607d8b',
        gridLineDashStyle: 'dot'

    },
    zAxis: {
        visible: false
    },
    tooltip: {
        shared: false,
        pointFormat: '<span>{series.name}: <b>{point.y}</b><br/>'
    },

    legend: {
        itemStyle: {
            color: '#000000'
        }
    },
    plotOptions: {
        series: {
            dataLabels: {
                enabled: true,
                color: '#000000',
                inside: true,
                y: 10,
                distance: -10
            },
            events: {
                legendItemClick: function () {
                    return false;
                }
            }
        },
        bar: {
            depth: 75
        }
    },
    colors: ['#388e3c', '#1a237e'],
    series: [],

};


let configChartDisp = {
    chart: {
        type: 'bar',
        backgroundColor: {
            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
            stops: [
                [0, 'rgb(96, 96, 96)'],
                [1, 'rgb(16, 16, 16)']
            ]
        },
        borderWidth: 0,
        borderRadius: 0,
        plotBackgroundColor: null,
        plotShadow: false,
        plotBorderWidth: 0,
        options3d: {
            enabled: true,
            alpha: 10,
            beta: 2,
            depth: 95
        }
    },
    credits: {
        enabled: false
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
    xAxis: {
        categories: [],
        labels: {
            style: {
                color: '#ffffff'
            }
        }
    },
    yAxis: {
        title: {
            text: ''
        },
        labels: {
            style: {
                color: '#ffffff',
            },
            formatter: function () {
                return this.value + ' Hrs';
            }
        }

    },
    plotOptions: {
        series: {
            dataLabels: {
                enabled: true,
                color: '#FFFFFF',
                inside: false,
                y: 10,
                distance: -10
            }
        },
        bar: {
            depth: 75
        }
    },
    colors: ['#c0ca33'],
    series: [],
};

let configChartPerdidas = {
    chart: {
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
    plotOptions: {
        series: {
            dataLabels: {
                enabled: true,
                color: '#000',
                inside: true,
                y: 0,
                distance: -10
            }
        },
        bar: {
            depth: 75
        }
    },
    colors: ['#d32f2f'],
    series: [],
};




export {
    configChartOEE,
    configChartDisp,
    configChartPerdidas
}