import React from 'react';
import PropTypes from 'prop-types';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Paper from '@material-ui/core/Paper';
import { Line } from 'react-chartjs-2';

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing(3),
        overflowX: 'auto',
    }
}));

function Graph(props) {
    const classes = useStyles();

    var chartData = {
        labels: props.indexes,
        datasets: [{
            label: 'Sensor Reading Values',
            data : props.readings,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
            fill : false
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
    }

    return(
        <Paper className={classes.root}>
            <Line 
                data={ chartData }
                options={ options }
            />
        </Paper>
    )
}

export default Graph;

Graph.propTypes = {
    readings : PropTypes.arrayOf(PropTypes.number),
    indexes : PropTypes.arrayOf(PropTypes.number) 
};