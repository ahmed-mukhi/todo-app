import React, { useState } from 'react'
import { IconButton, Popover, Avatar, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import UserProfileModal from './profileModal';

const UserMenu = ({ imgUrl, handleLogout, user }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);

    const closeDialog = () => {
        setOpenDialog(false);
    }

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;
    return (
        <div>
            <UserProfileModal handleClose={closeDialog} open={openDialog} user={user} imgUrl={imgUrl} />
            <IconButton aria-describedby={id} onClick={handleClick}>
                <Avatar src={imgUrl} alt="P" />
            </IconButton>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                <List component="nav">
                    <ListItem button onClick={() => setOpenDialog(true)}>
                        <ListItemIcon>
                            <AccountCircleIcon />
                        </ListItemIcon>
                        <ListItemText primary="View Profile" />
                    </ListItem>
                    <ListItem button onClick={handleLogout}>
                        <ListItemIcon>
                            <ExitToAppIcon />
                        </ListItemIcon>
                        <ListItemText primary="Logout" />
                    </ListItem>
                </List>
            </Popover>
        </div>
    )
};

export default UserMenu;
