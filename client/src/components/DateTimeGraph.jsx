import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import {Bar} from 'react-chartjs-2';

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing(3),
        overflowX: 'auto',
    }
}));

function DateTimeGraph() {
    const classes = useStyles();

    var chartData = {
        labels: ['2019-08-01', '2019-08-02', '2019-08-03', '2019-08-04'],
        datasets: [{
            label: 'Number of Reports',
            data: [2, 4, 3, 1],
            backgroundColor: 'rgba(117, 125, 232, 0.2)',
            borderColor: 'rgba(117, 125, 232, 1)',
            borderWidth: 1,
            fill : true
        }],
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
            text: 'Frequency of Lightning Reports'
        }
    }

    return(
        <div className={classes.root}>
            <Bar 
                data= { chartData }
                options= {options}
                />
        </div>
    )
}

export default DateTimeGraph;