let configChart = {
    chart: {
        type: 'column',
        height: null, 
        // backgroundColor:'#e3f2fd'
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
                inside: false,
                format: '{point.y:,.2f}'
            }
        },
        bar:{
            depth: 75
        }
    },
    colors: ['#01579b'],
    series: [],
};



export {
    configChart
}