import IconButton from '@mui/material/IconButton';
import { Person } from '@mui/icons-material';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import React, { useState } from 'react';
import Box from '@mui/material/Box';
import { signOutEndpoint } from "./backend";
import { makeStyles } from '@material-ui/styles';
import { useAuthContext } from './authContext';

const useStyles = makeStyles({
    userDetails: {
        borderBottom: "1px solid rgb(224, 224, 224)",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginBottom: "8px",
        "& > *": {
            marginBottom: "8px"
        }
    }
})

export function UserMenu(){
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const { user, onSignOut} = useAuthContext();

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    }

    const handleClose = () => {
        setAnchorEl(null);
    }

    const classes = useStyles();
    
    const signOut = () => {
        signOutEndpoint();
        onSignOut();
    }

    return(
        <div>
            <IconButton onClick={handleClick}>
                <Avatar>
                    <Person />
                </Avatar>
            </IconButton>
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >   
            <Box className={classes.userDetails}>
                <Avatar>
                    <Person />
                </Avatar>
                <div>{user.name}</div>
                <small>{user.email}</small>
            </Box>
                <MenuItem onClick={signOut}>Sair</MenuItem>
            </Menu>
        </div>
    )
}