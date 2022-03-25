import React from 'react';
import { Link } from 'react-router-dom';
import { makeStyles} from '@material-ui/core/styles'
import { Typography, IconButton, Menu } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import MenuItem from '@material-ui/core/MenuItem';
import AccountCircle from '@material-ui/icons/AccountCircle';
import FlashOnSharp from '@material-ui/icons/FlashOnSharp';

const useStyles = makeStyles(theme=> ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2)
    },
    title: {
        flexGrow: 1
    },
}));

function AppToolbar() {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    // eslint-disable-next-line react/display-name
    const AdapterLink = React.forwardRef((props, ref) => <Link innerRef={ref} {...props} />);

    function handleMenu(event) {
        setAnchorEl(event.currentTarget);
      }
    
    function handleClose() {
        setAnchorEl(null);
    }
    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" className={classes.menuButton} 
                    color="inherit" aria-label="menu" component={AdapterLink} to="/reports">
                        <FlashOnSharp />
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        Lightning Flash
                    </Typography>
                    <div>
                        <IconButton
                            aria-label="Account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleMenu}
                            color="inherit"
                            >
                            <AccountCircle />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical:'top',
                                horizontal:'right',
                            }}
                            open={open}
                            onClose={handleClose}
                            >
                                <MenuItem onClick={handleClose}>Profile</MenuItem>
                                <MenuItem onClick={handleClose}>My Account</MenuItem>
                            </Menu>
                    </div>
                </Toolbar>
            </AppBar>
        </div>
    )
}

export default AppToolbar;