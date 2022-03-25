import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles(theme => ({
    root: {
      width: '100%',
      marginTop: theme.spacing(3),
      overflowX: 'auto',
    },
  }));
  
function DataTable(props) {
    const classes = useStyles();
    return (
        <Paper className={classes.root}>
        <Table>
            <TableHead>
            <TableRow>
                <TableCell>Order</TableCell>
                <TableCell align="right">Reading</TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
            {props.readings.map((reading, index) => (
                <TableRow key={index}>
                    <TableCell component="th" scope="reading">
                        {index}
                    </TableCell>
                    <TableCell align="right">{reading}</TableCell>
                </TableRow>
            ))}
            </TableBody>
        </Table>
        </Paper>
    );
}

export default DataTable;

DataTable.propTypes = {
    readings : PropTypes.arrayOf(PropTypes.number)
};