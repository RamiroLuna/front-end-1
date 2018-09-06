let configChart = {
    chart: {
        height: null, 
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
    exporting: {
        enabled: true
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
        line:{
            dataLabels: {                          
                inside: false,
                y: -5
            }
        }
    },
    colors: ['#388e3c', '#1a237e'],
    series: [],
};



export {
    configChart
}