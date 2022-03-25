import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Line } from 'react-chartjs-2';

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing(3),
        overflowX: 'auto',
    }
}));

function Graph() {
    const classes = useStyles();

    var labels = ['Sensor 1', 'Sensor 2', 'Sensor 3', 'Best fit'];
    var data = {
        1 : [1.500001907,
            1.500001907,
            1.500001907,
            1.500001907,
            1.666668653,
            1.8333354,
            2.166668892,
            2.500002384,
            3.166669369,
            3.666669607,
            4.166669846,
            4.333336592,
            4.333336592,
            4.166669846,
            4.000003099,
            3.833336353,
            3.833336353,
            3.833336353,
            3.833336353,
            3.833336353,
            3.833336353
        ],
        2: [1.500001907,
            1.500001907,
            1.500001907,
            1.500001907,
            1.500001907,
            1.500001907,
            1.500001907,
            1.500001907,
            1.500001907,
            1.500001907,
            1.666668653,
            1.8333354,
            2.166668892,
            2.500002384,
            3.166669369,
            3.666669607,
            4.166669846,
            4.333336592,
            4.333336592,
            4.166669846,
            4.000003099
        ],
        3: [1.500001907,
            1.500001907,
            1.500001907,
            1.500001907,
            1.500001907,
            1.500001907,
            1.500001907,
            3.166669369,
            3.666669607,
            4.166669846,
            4.333336592,
            4.333336592,
            4.166669846,
            4.000003099,
            3.833336353,
            3.100000312,
            2.500002384,
            1.8333354,
            1.666668653,
            1.500001907,
            1.500001907
            ],
        4: [1.500001907,
            1.500001907,
            1.500001907,
            1.500001907,
            1.500001907,
            1.500001907,
            1.500001907,
            1.500001907,
            1.666668653,
            1.8333354,
            2.166668892,
            2.500002384,
            3.166669369,
            3.666669607,
            4.166669846,
            4.333336592,
            4.333336592,
            4.166669846,
            4.000003099,
            3.833336353,
            3.833336353]
    }

    var backgroundColors = ['rgba(255, 99, 132, 0.2)', 
                            'rgba(117, 125, 232, 0.2)', 
                            'rgba(10, 173, 114, 0.2)', 
                            'rgba(173, 119, 10, 0.2)']
    var borderColors = ['rgba(255, 99, 132, 1)', 
                        'rgba(117, 125, 232, 1)', 
                        'rgba(10, 173, 114, 1)', 
                        'rgba(173, 119, 10, 1)']

    var chartData = {
        labels: [],
        datasets: []
    }

    for(var i=0; i<21; i++){
        chartData.labels.push(i);
    }

    for(var j=0; j<4; j++){
        chartData.datasets.push({
            label: labels[j],
            data: data[j],
            backgroundColor: backgroundColors[j],
            borderColor: borderColors[j],
            borderWidth: 1,
            fill : false
        })
    }

    var options = {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        },
        title: {
            display: true,
            position: 'top',
            text: 'Last Triangulated Strike Best Fit'
        }
    }

    return(
        <div className={classes.root}>
            <Line 
                data={ chartData }
                options={ options }
            />
        </div>
    )
}

export default Graph;