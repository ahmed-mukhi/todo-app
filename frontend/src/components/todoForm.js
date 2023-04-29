import { Box, Button, MenuItem, Stack, TextField } from '@mui/material';
import React, { useState } from 'react';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import { SaveTodos } from '../controllers/todosControllers';
import FormControl from '@mui/material/FormControl';
import { useContext } from 'react';
import { FormContext } from '../App';
import { grey } from '@mui/material/colors';

function TodoForm() {
    const { value, setValue, reminder, setReminder,user } = useContext(FormContext);
    const [error, setError] = useState(false);
    const [reminderErr, setReminErr] = useState(false);

    const handleTodo = () => {
        setReminErr(false);
        setError(false);
        if (value === "") {
            setError(true);
        } else if (reminder === 0) {
            console.log("ddd");
            setReminErr(true);
        } else {
            SaveTodos(user._id,value, reminder);
            setValue("");
            setReminder("");
            setError("");
            setReminErr(false)
        }
    }
    return (
        <div>
            <Box sx={{ backgroundColor: grey[200],boxShadow : "25px" }}>
                <Stack spacing={2} sx={{ padding: '30px' }}>
                    <Box>
                        <TextField error={error} value={value} onChange={(ev) => setValue(ev.target.value)} variant='standard' label="Enter todo" />
                    </Box>
                    <Box>
                        <FormControl variant="standard" error={reminderErr} sx={{ minWidth: 190 }}>
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