import React, { useEffect, useState } from 'react'
import { blueGrey } from '@mui/material/colors';
import {
    AppBar,
    Toolbar,
    InputBase,
    IconButton,
    FormControlLabel,
    Checkbox,
    FormGroup,
    LinearProgress,
}
    from '@mui/material';
import { getTodos } from '../controllers/todosControllers';
import { Search as SearchIcon } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import { useContext } from 'react';
import { FormContext } from '../App';

export default function FilterAndSearch() {
    const { status, setStatus, setData, setActive, setMethod, user, data } = useContext(FormContext);
    const [backup, setBackup] = useState([]);
    const [on, setOn] = useState(false);
    // let nav = useNavigate();

    const handleFilterToggle = (ev, filterOption) => {
        if (ev.target.checked) {
            setStatus([...status, filterOption]);
        } else {
            setStatus(status.filter(option => option !== filterOption));
        }
    };

    useEffect(() => {
        if (backup) {
            if (status.length > 0) {
                setData(backup.filter(obj => status.includes(obj.status)));
            } else {
                setData(backup);
            }
        }
    }, [status]);

    const createBackup = async () => {
        const resp = await getTodos(user._id);
        console.log(resp);
        setBackup(resp.todos);
    }

    useEffect(() => {
        createBackup();
    }, []);

    useEffect(() => {
        setOn(true);
    }, [backup]);

    const searchCheck = (text) => {
        if (text) {
            text = text.toLowerCase();
            setData(backup.filter(item => item.title.toLowerCase().includes(text)));
        } else {
            setData(backup);
        }
    }


    return (
        <AppBar position="static" sx={{ backgroundColor: blueGrey[100], color: "black" }}>
            {on ?
                (<Toolbar sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                    <div style={{ marginRight: "auto" }}>
                        <h4>Todos List</h4>
                    </div>
                    <div>
                        <div style={{ flexGrow: "1" }}>

                            <FormGroup sx={{ display: "inline", marginRight: "10px" }}>
                                <FormControlLabel
                                    control={<Checkbox color="default" />}
                                    label="Completed"
                                    onChange={(ev) => handleFilterToggle(ev, "Completed")}
                                />
                                <FormControlLabel
                                    control={<Checkbox color="default" />}
                                    label="In progress"
                                    onChange={(ev) => handleFilterToggle(ev, "Progress")}
                                />
                                <FormControlLabel
                                    control={<Checkbox color="default" />}
                                    label="Initial"
                                    onChange={(ev) => handleFilterToggle(ev, "Initial")}
                                    sx={{ paddingRight: "2px" }}
                                />
                            </FormGroup>
                            <IconButton edge="start" color="inherit" aria-label="search">
                                <SearchIcon />
                            </IconButton>
                            <InputBase
                                placeholder="Search..."
                                onChange={(ev) => {
                                    searchCheck(ev.target.value);
                                }}
                                sx={{
                                    color: 'black',
                                }}
                            />
                            <IconButton onClick={() => {
                                setActive(true);
                                setMethod("add");
                            }}
                                sx={{ color: "inherit" }}
                            >
                                <AddIcon />
                            </IconButton>
                        </div>
                    </div>
                </Toolbar >) : <LinearProgress />
            }
        </AppBar >
    )
}
