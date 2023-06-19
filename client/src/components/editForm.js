import React, { useEffect, useState, useContext } from 'react';
import {
    TextField,
    Button,
    Select,
    MenuItem,
    FormControl,
    FormControlLabel,
    Checkbox,
    FormGroup,
    Grid,
    Alert,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle
}
    from '@mui/material';
import { FormContext } from '../App';
import { EditTodos, SaveTodos } from '../controllers/todosControllers';


const EditForm = ({ initialData, action }) => {
    let { active, setActive, id, setChange, user, setId } = useContext(FormContext);
    const [tagsArr, setTagArr] = useState([
        {
            title: "Home",
            checked: false
        },
        {
            title: "Health",
            checked: false
        },
        {
            title: "Work",
            checked: false
        },
        {
            title: "Study",
            checked: false
        },
    ]);
    const [formData, setFormData] = useState({
    });
    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        if (active) {
            if (initialData && action === "edit") {
                setFormData(initialData);
                checkTags(initialData.tags);
            }
            else {
                setFormData({
                    status: "Initial",
                    desc: "",
                    title: "",
                    dueDate: "",
                    assignedDate: ""
                });
                checkTags([]);
            }
        }
    }, [active]);


    const confirmTags = (tags) => {
        setTagArr([...tags]);
        const updated = tagsArr.filter(t => t.checked === true).map(t => t.title);
        setFormData(prev => ({
            ...prev,
            tags: updated
        }));
    }


    const validateForm = () => {
        let errors = {};
        Object.entries(formData).forEach(([key, value]) => {
            if (value instanceof Array && value.length === 0) {
                errors[key] = "Fill in atleast one tag";
            } else if (!value && key !== "__v") {
                errors[key] = "Fill in the required field";
            }
        })
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    }


    const checkTags = (tags) => {
        tagsArr.forEach(item => {
            if (tags.includes(item.title)) {
                item.checked = true;
            } else {
                item.checked = false;
            }
        });
        confirmTags(tagsArr);
    }
    const handleChange = (e) => {
        let { name, value } = e.target;
        if (name === "assignedDate" || name === "dueDate") {
            value = new Date(value);
        }
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const reset = () => {
        setTagArr([
            {
                title: "Home",
                checked: false
            },
            {
                title: "Health",
                checked: false
            },
            {
                title: "Work",
                checked: false
            },
            {
                title: "Study",
                checked: false
            },
        ]);
        setFormErrors({});
        setActive(false);
        setId("");
        setChange(true);

    }
    const closeDialog = () => {
        setFormErrors({});
        setActive(false);
    };
    const dateFormat = (date) => {
        const formattedDate = new Date(date).toISOString().split('T')[0];
        return formattedDate;
    }
    const handleTagChange = (e) => {
        const { name, checked } = e.target;
        tagsArr.forEach(tag => {
            if (tag.title === name) {
                checked ? tag.checked = true : tag.checked = false;
            }
        })
        confirmTags(tagsArr);
    };

    const handleEdit = async (e) => {
        try {
            e.preventDefault();
            if (validateForm()) {
                if (action === "edit") {
                    await EditTodos(id, formData);
                } else {
                    await SaveTodos(user._id, formData);
                }
                setFormData({});
                reset();
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div>
            <Dialog open={active} onClose={closeDialog} maxWidth="sm" fullWidth>
                <Grid item xs={12}>
                    <DialogTitle sx={{ fontWeight: "bold" }}>{action === "edit" ? 'Edit Task' : 'Add Task'}</DialogTitle>
                </Grid>
                <form onSubmit={handleEdit}>
                    <DialogContent>
                        <Grid container alignItems="center" spacing={2} sx={{ marginBottom: "20px" }}>
                            <Grid item xs={3}>
                                <label>Title</label>
                            </Grid>
                            <Grid item xs={9}>
                                <TextField
                                    variant='standard'
                                    label="Title"
                                    name="title"
                                    value={formData.title || ''}
                                    onChange={handleChange}
                                    fullWidth
                                />
                                {formErrors.title ? <Alert severity='error' sx={{ fontSize: "small" }}>{formErrors.title}</Alert> : null}
                            </Grid>
                        </Grid>
                        <Grid container alignItems="center" spacing={2} sx={{ marginBottom: "20px" }}>
                            <Grid item xs={3}>
                                <label>Brief</label>
                            </Grid>
                            <Grid item xs={9}>
                                <TextField
                                    variant='standard'
                                    label="Description"
                                    name="desc"
                                    value={formData.desc || ''}
                                    onChange={handleChange}
                                    fullWidth
                                />
                                {formErrors.desc ? <Alert severity='error' sx={{ fontSize: "small" }}>{formErrors.desc}</Alert> : null}
                            </Grid>
                        </Grid>
                        <Grid container alignItems="center" spacing={2} sx={{ marginBottom: "20px" }}>
                            <Grid item xs={3}>
                                <label>Tags</label>
                            </Grid>
                            <Grid item xs={9}>
                                <FormGroup sx={{ display: "inline" }}>
                                    {formData.tags ? tagsArr.map((t, index) => {
                                        return (
                                            <FormControlLabel
                                                control={<Checkbox name={t.title} onChange={e => handleTagChange(e)} checked={t.checked} color="default" />}
                                                label={t.title}
                                                key={index}
                                            />
                                        )
                                    }) : ''}
                                    {formErrors.tags ? <Alert severity='error' sx={{ fontSize: "small" }}>{formErrors.tags}</Alert> : null}
                                </FormGroup>
                            </Grid>
                        </Grid>
                        <FormControl fullWidth variant='standard'>
                            <Grid container alignItems="center" spacing={2} sx={{ marginBottom: "20px" }}>
                                <Grid item xs={3}>
                                    <label>Status</label>
                                </Grid>
                                <Grid item xs={9}>
                                    <Select
                                        name="status"
                                        value={formData.status || "Initial"}
                                        onChange={handleChange}
                                        required
                                        fullWidth
                                    >
                                        <MenuItem value="Initial">Initial</MenuItem>
                                        <MenuItem value="Progress">Progress</MenuItem>
                                        <MenuItem value="Completed">Completed</MenuItem>
                                    </Select>
                                </Grid>
                            </Grid>
                        </FormControl>
                        <Grid container alignItems="center" spacing={2} sx={{ marginBottom: "20px" }}>
                            <Grid item xs={3}>
                                <label>Assigned </label>
                            </Grid>
                            <Grid item xs={9}>
                                <TextField
                                    variant='standard'
                                    name="assignedDate"
                                    type="date"
                                    value={formData.assignedDate ? dateFormat(formData.assignedDate) : ''}
                                    onChange={handleChange}
                                    fullWidth
                                />
                                {formErrors.assignedDate ? <Alert severity='error' sx={{ fontSize: "small" }}>{formErrors.assignedDate}</Alert> : null}
                            </Grid>
                        </Grid>
                        <Grid container alignItems="center" spacing={2} sx={{ marginBottom: "20px" }}>
                            <Grid item xs={3}>
                                <label>Due </label>
                            </Grid>
                            <Grid item xs={9}>
                                <TextField
                                    variant='standard'
                                    name="dueDate"
                                    type="date"
                                    value={formData.dueDate ? dateFormat(formData.dueDate) : ''}
                                    onChange={handleChange}
                                    fullWidth
                                />
                                {formErrors.dueDate ? <Alert severity='error' sx={{ fontSize: "small" }}>{formErrors.dueDate}</Alert> : null}
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button color="error" variant='contained' onClick={closeDialog}>Cancel</Button>
                        <Button type="submit" color="primary" variant='contained'>
                            {action === "add" ? 'Save' : 'Update'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </div >
    );
};

export default EditForm;
