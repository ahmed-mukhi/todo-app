import React, { useEffect, useState } from 'react';
import '../App.css';
import { DelTodos, getTodos } from '../controllers/todosControllers';
import { ListItem, ListItemText, Snackbar, IconButton, Tooltip, CircularProgress } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import Skeleton from '@mui/material/Skeleton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import EditForm from './editForm';
import { useContext } from 'react';
import { FormContext } from '../App';
const ListFormat = () => {
    const { open, setOpen, setActive, setId, user, setChange, change } = useContext(FormContext);
    const [data, setData] = useState([]);

    const handleClose = (ev, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };


    const fetchData = async () => {
        const _data = JSON.parse(localStorage.getItem("data"));
        if (!_data || _data.length === 0 || change) {
            try {
                const resp = await getTodos(user._id);
                setData(resp.todos);
                localStorage.setItem("data", JSON.stringify(resp.todos));
                setChange(false);
            } catch (error) {
                console.log(error);
            }
        } else {
            setData(_data);
        }
    };

    const handleThisEdit = (id) => {
        setId(id);
        setActive(true);
    }
    const handleDel = async (id) => {
        const resp = await DelTodos(id, user._id);
        if (resp) {
            setChange(true);
            // console.log(change);
            setOpen(true);
        }
    }

    useEffect(() => {
        if (user) {
            fetchData();
        }
    }, [change]);




    const action = (
        <React.Fragment>
            <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleClose}
            >
                <CloseIcon fontSize="small" />
            </IconButton>
        </React.Fragment>
    );

    return (
        <div>
            <EditForm />
            {data && change ? <CircularProgress /> :
                (data ? data.map((obj) => {
                    let c = 'white';
                    let date = new Date(obj.createdAt);
                    obj.reminder === 1 ? c = 'pink' : (obj.reminder === 2 ? c = 'lightblue' : c = 'white');
                    return (
                        <div key={obj._id}>
                            <ListItem sx={{ backgroundColor: c }}>
                                <ListItemText primary={obj.title} secondary={date.toDateString()} />
                                <Tooltip title="Delete">
                                    <IconButton onClick={(e) => handleDel(obj._id)}>
                                        <DeleteIcon sx={{ ":hover": { color: "red" } }} />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Edit">
                                    <IconButton onClick={e => {
                                        handleThisEdit(obj._id);
                                    }}>
                                        <EditIcon sx={{ ":hover": { color: "green" } }} />
                                    </IconButton>
                                </Tooltip>
                                <Snackbar
                                    open={open}
                                    autoHideDuration={6000}
                                    onClose={handleClose}
                                    message="Task Deleted"
                                    action={action}
                                />
                            </ListItem>
                        </div>
                    );
                }) : (
                    <div>
                        <Skeleton sx={{ mb: 1 }} height={90} width={700} variant='rounded' />
                        <Skeleton sx={{ mb: 1 }} height={90} width={700} variant='rounded' />
                    </div>
                ))}
            {data.length === 0 ? <h5>No todos yet</h5> : ""}
        </div>
    );
};

export default ListFormat;