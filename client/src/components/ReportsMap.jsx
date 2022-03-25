import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Map from './Map.jsx';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(3),
    overflowX: 'auto',
    height: '732px'
  },
}));

function ReportsMap(props) {
  const classes = useStyles();

  return (
    <Paper className={classes.root}>
      <Map Reports={props.Reports}/>
    </Paper>
  )
}

export default ReportsMap;

ReportsMap.propTypes = {
  Reports : PropTypes.arrayOf(PropTypes.shape({
    ReportID : PropTypes.number,
    DateTime : PropTypes.string,
    Location : PropTypes.string,
    Longitude : PropTypes.float,
    Latitude : PropTypes.float
  })).isRequired,
}