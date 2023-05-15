import { Box, Button, MenuItem, Stack, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import { SaveTodos, getTodos } from '../controllers/todosControllers';
import FormControl from '@mui/material/FormControl';
import { useContext } from 'react';
import { FormContext } from '../App';
import { grey } from '@mui/material/colors';

function TodoForm() {
    const { value, setValue, reminder, setReminder, user, setChange } = useContext(FormContext);
    const [error, setError] = useState("");
    const [reminderErr, setReminErr] = useState("");

    const addTodo = async () => {
        try {
            const data = await SaveTodos(user._id, value, reminder);
            const resp = await getTodos(data._id);
            localStorage.setItem("data", JSON.stringify(resp.todos));
            setChange(true);
            setValue("");
            setReminder(0);
            setError("");
            setReminErr("");
        } catch (error) {
            console.log(error);
        }
    }

    const handleTodo = async () => {
        setReminErr("");
        setError("");
        if (value === "" || reminder === 0) {
            value === "" ? setError("Fill in the required field") : setReminErr("Fill in the required field");
        } else {
            await addTodo();
        }
    }
    return (
        <div>
            <Box sx={{ backgroundColor: grey[200], boxShadow: "25px" }}>
                <Stack spacing={2} sx={{ padding: '30px' }}>
                    <Box>
                        <TextField value={value} onChange={(ev) => setValue(ev.target.value)} variant='standard' label="Enter todo" />
                        <Typography variant='caption' display="block" sx={{ color: "red", fontSize: "small" }} gutterBottom>{error}</Typography>
                    </Box>
                    <Box>
                        <FormControl variant="standard" sx={{ minWidth: 190 }}>
                            <InputLabel id="demo-simple-select-standard-label">Reminder</InputLabel>
                            <Select
                                label="Reminder"
                                value={reminder}
                                fullWidth
                                onChange={(ev) => setReminder(ev.target.value)}
                            >
                                <MenuItem value={0}><em>None</em></MenuItem>
                                <MenuItem value={1}>Urgent</MenuItem>
                                <MenuItem value={2}>Necessary</MenuItem>
                                <MenuItem value={3}>Delay</MenuItem>
                            </Select>
                            <Typography variant='caption' sx={{ color: "red", fontSize: "small" }} gutterBottom>{reminderErr}</Typography>
                        </FormControl>
                    </Box>
                    <Box>
                        <Button color='success' type='button' variant='contained' onClick={handleTodo}>Add</Button>
                    </Box>
                </Stack>
            </Box>
        </div>
    );
};

export default TodoForm;