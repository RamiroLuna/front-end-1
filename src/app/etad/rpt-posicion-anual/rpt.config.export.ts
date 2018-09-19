let configChart = {
    chart: {
        type: 'column',
        height: null
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
        pointFormat: '<span>{series.name}: <b>{point.y:.2f}</b><br/>'
    },

    legend: {
        enabled: false
    },
    plotOptions: {
        series: {
            dataLabels: {
                color: '#000000',
                enabled: true,
                inside: false,
                format: '{y:.2f}'
            },
            events: {
                legendItemClick: function () {
                    return false;
                }
            }
        }
    },
    colors: [],
    series: [],
};



export {
    configChart
}