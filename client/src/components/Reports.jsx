import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import {Link} from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Refresh from '@material-ui/icons/Refresh';

const useStyles = makeStyles(theme => ({
    root: {
      width: '100%',
      marginTop: theme.spacing(3),
      overflowX: 'auto',
    },
}));

// eslint-disable-next-line react/display-name
const AdapterLink = React.forwardRef((props,ref) => <Link innerRef={ref} {...props}/>);

function Reports(props) {
    const classes = useStyles();
    var rows = props.Reports;

    return(
        <Paper className={classes.root}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Date and Time</TableCell>
                        <TableCell>Location</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell align="right">Link
                            <IconButton onClick={props.refresh()}>
                                <Refresh />
                            </IconButton>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map(row => (
                        <TableRow key={row.ReportID}>
                            <TableCell component="th" scope="row">
                                {row.DateTime !== null ? new Date(row.DateTime).toString() : row.DateTime}
                            </TableCell>
                            <TableCell>
                                {row.Location}
                            </TableCell>
                            <TableCell>
                                {row.Triangulated ? <font color="red">Triangulated</font> : <font>Individual</font>}
                            </TableCell>
                            <TableCell align="right">
                                <Button variant="contained" 
                                    color="primary" 
                                    component={AdapterLink}
                                    to={{
                                        pathname: "/report"+row.ReportID,
                                        state: {
                                            Reports : [row]
                                        }
                                    }}
                                    >
                                    View
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Paper>
    )
}

export default Reports;

Reports.propTypes = {
    Reports : PropTypes.arrayOf(PropTypes.shape({
        ReportID : PropTypes.number,
        DateTime : PropTypes.string,
        Location : PropTypes.string,
        Longitude : PropTypes.float,
        Latitude : PropTypes.float
    })).isRequired,
    refresh: PropTypes.func
};