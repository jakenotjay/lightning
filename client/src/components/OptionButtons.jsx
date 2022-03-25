import React from 'react';
import PropTypes from 'prop-types';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import SaveIcon from '@material-ui/icons/Save';

const useStyles = makeStyles(theme => ({
    root : {
        width: '100%',
        marginTop: theme.spacing(3),
        overflowX: 'auto',
    },
    buttonGroup: {
        margin: theme.spacing(1)
    },
    leftIcon: {
        marginRight: theme.spacing(1),
      },
    rightIcon: {
        marginLeft: theme.spacing(1),
    },
}));

function OptionButtons(props){
    var classes = useStyles();

    return (
        <Paper className={classes.root}>
            <Grid container>
                <Grid item sm={12} md={12} className={classes.buttonGroup}>
                    <ButtonGroup 
                        fullWidth
                        variant="contained" 
                        color="primary" 
                        aria-label="Save options"
                        size="large"
                        >
                            <Button onClick={props.getReadingstxt()}>
                                <SaveIcon className={classes.leftIcon}/>
                                .txt
                            </Button>
                            <Button onClick={props.getReadingscsv()}>
                                <SaveIcon className={classes.leftIcon}/>
                                .csv
                            </Button>
                            <Button onClick={props.copyToClip()}>
                                <FileCopyIcon className={classes.leftIcon}/>
                                Copy
                            </Button>
                    </ButtonGroup>
                </Grid>
            </Grid>

        </Paper>
    )
}

export default OptionButtons;

OptionButtons.propTypes = {
    getReadingstxt: PropTypes.func,
    getReadingscsv: PropTypes.func,
    copyToClip: PropTypes.func
}