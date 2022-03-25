import React from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import makeStyles from '@material-ui/core/styles/makeStyles';
import BestFitGraph from '../components/BestFitGraph.jsx';
import DateTimeGraph from '../components/DateTimeGraph.jsx';

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing(3),
        overflowX: 'auto',
    }
}));

function Dashboard() {
    const classes = useStyles();

    return(
        <Paper className={classes.root}>
            <Grid container>
                <Grid item xs={12} sm={6}>
                    <BestFitGraph />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <DateTimeGraph />    
                </Grid>
            </Grid>
        </Paper>
    )
}

export default Dashboard;