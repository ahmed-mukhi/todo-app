import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Select, MenuItem } from '@mui/material';
import { TextField, Button } from '@mui/material';
import { useContext } from 'react';
import { FormContext } from '../App';
import { EditTodos } from '../controllers/todosControllers';

const EditForm = () => {
    let { active, setActive, id, value, setChange, setValue, setReminder, reminder } = useContext(FormContext);


    const closeDialog = () => {
        setActive(false);
        setValue("");
        setReminder("");
        setChange(true);
    };

    const handleEdit = async () => {
        if (value === "" || reminder === 0) {
            console.log("Incomplete fields");
        } else {
            try {
                await EditTodos(id, value, reminder);
                closeDialog();
            } catch (error) {
                console.log(error);
            }
        }
    }

    return (
        <div>
            <Dialog open={active} onClose={closeDialog}>
                <DialogTitle>Edit Task</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        margin="dense"
                        id="name"
                        label="Title"
                        variant="standard"
                    />
                    <Select sx={{ marginLeft: "15px" }} label="Reminder" onChange={(ev) => setReminder(ev.target.value)} value={reminder}>
                        <MenuItem value={0}><em>None</em></MenuItem>
                        <MenuItem value={1}>Urgent</MenuItem>
                        <MenuItem value={2}>Necessary</MenuItem>
                        <MenuItem value={3}>Delay</MenuItem>
                    </Select>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDialog}>Cancel</Button>
                    <Button onClick={handleEdit}>Done</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default EditForm;