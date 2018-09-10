let configChartOEE = {
    chart: {
        type: 'column',
        borderWidth: 0,
        borderRadius: 0,
        plotBackgroundColor: null,
        plotShadow: false,
        plotBorderWidth: 0,
        options3d: {
            enabled: false,
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
                color: '#000000',
                enabled: true,
                inside: true
            },
            events: {
                legendItemClick: function () {
                    return false;
                }
            }
        },
        line: {
            dataLabels: {
                inside: false,
                y: -5
            }
        }
    },
    colors: ['#388e3c', '#1a237e'],
    series: [],

};


let configChartDisp = {
    chart: {
        type: 'column',
        // backgroundColor:'#e3f2fd'
    },
    credits: {
        enabled: false
    },
    title: {
        text: '',
        style: {
            color: '#0d47a1'
        }
    },
    subtitle: {
        text: '',
        style: {
            color: '#0d47a1'
        }
    },
    xAxis: {
        categories: [],
        labels: {
            style: {
                color: '#0d47a1'
            }
        }
    },
    yAxis: {
        title: {
            text: ''
        },
        labels: {
            style: {
                color: '#0d47a1',
            },
            formatter: function () {
                return this.value + ' Hrs';
            }
        },
        gridLineWidth: 0.1,
        gridLineColor: '#bbdefb',
        gridLineDashStyle: 'longdash'

    },
    plotOptions: {
        series: {
            dataLabels: {
                enabled: true,
                color: '#000000',
                inside: true,
                format: '{point.y:,.2f}'
            }
        },
        bar: {
            depth: 75
        }
    },
    colors: ['#01579b'],
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