import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton, Input, TextField, Button, Alert, LinearProgress } from '@mui/material';
import { Grid, Card, CardMedia, Typography } from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import EditIcon from '@mui/icons-material/Edit';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { editUserDetails } from '../controllers/userController';


const isEmail = (email) =>
    /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);

const UserProfileModal = ({ open, handleClose, user, imgUrl, setUserChange }) => {
    const [editMode, setEditMode] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [loading, setLoading] = useState(false);
    const [upUser, setUpUser] = useState(user);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        profileImage: null
    });
    const [image, setImage] = useState(null);
    const [formErrors, setFormErrors] = useState({});



    const validateForm = () => {
        let errors = {};
        Object.entries(formData).forEach(([key, value]) => {
            if (!value && key !== "profileImage") {
                errors[key] = `${key} is required`;
            } else if (key === "email") {
                if (!isEmail(value)) {
                    errors[key] = `Invalid format`;
                }
            }
        });
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    }


    const onSubmit = async () => {
        setLoading(true);
        if (validateForm()) {
            const resp = await editUserDetails(user._id, formData);
            if (resp) {
                setUpUser(resp);
                setEditMode(false);
            }
        } else {
            setLoading(false);
        }
    };

    const backupFunc = () => {
        Object.entries(upUser).forEach(([key, value]) => {
            if (key !== "profileImage" && (key in formData)) {
                setFormData(prev => ({
                    ...prev,
                    [key]: value
                }))
            }
        });
    }

    useEffect(() => {
        setUserChange(true);
        backupFunc();
        setLoading(false);
    }, [upUser]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            setImage(event.target.result)
            setFormData((prev) => ({
                ...prev,
                profileImage: event.target.result
            }));
        };
    };

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    const detailsContainerStyle = {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '15px',
    };
    const iconStyle = {
        marginRight: '8px',
    };

    const nameStyle = {
        fontWeight: 'bold',
        marginBottom: '8px',
    };


    return (
        <Dialog open={open} onClose={() => {
            setEditMode(false);
            handleClose();
        }} maxWidth="sm" fullWidth>
            <DialogTitle>User Profile</DialogTitle>
            <DialogContent>
                {(!loading && formData && upUser) ?
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={4} lg={3}>
                            <Card
                                sx={{
                                    position: 'relative',
                                    display: 'inline-block',
                                }}
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                            >
                                <CardMedia
                                    component="img"
                                    alt="Profile Image"
                                    height="200"
                                    sx={{
                                        transition: 'opacity 0.3s',
                                        '&:hover': {
                                            opacity: 0.7,
                                        },
                                    }}
                                    image={image ? image : imgUrl.secure_url}
                                />
                                {(isHovered && editMode) && (
                                    <>
                                        <Input
                                            type="file"
                                            name="profileImage"
                                            onChange={handleFileChange}
                                            style={{ display: 'none' }}
                                            id="file-input"
                                        />
                                        <label htmlFor="file-input">
                                            <Button sx={{
                                                position: 'absolute',
                                                top: '75%',
                                                left: '50%',
                                                transform: 'translate(-50%, -50%)',
                                                zIndex: 1,
                                            }} variant="contained" component="span">
                                                Upload
                                            </Button>
                                        </label>
                                    </>
                                )}
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={4} md={6} lg={7}>
                            <Typography variant="h6" style={nameStyle}>
                                {editMode ?
                                    <Grid spacing={2} container>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                variant="standard"
                                                name="firstName"
                                                focused={formData.firstName ? true : false}
                                                value={formData.firstName}
                                                fullWidth
                                                label="First Name"
                                                onChange={handleInputChange}
                                            />
                                            {formErrors.firstName ? (<Alert sx={{ fontSize: "small" }} severity="error">{formErrors.firstName}</Alert>) : null}
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                name="lastName"
                                                focused={formData.lastName ? true : false}
                                                variant="standard"
                                                value={formData.lastName}
                                                fullWidth
                                                label="Last Name"
                                                onChange={handleInputChange}
                                            />
                                            {formErrors.lastName ? (<Alert sx={{ fontSize: "small" }} severity="error">{formErrors.lastName}</Alert>) : null}
                                        </Grid>
                                    </Grid>
                                    :
                                    <div>{formData.firstName} {formData.lastName}</div>
                                }
                            </Typography>
                            <div>
                                {editMode ?
                                    <div>
                                        <TextField
                                            variant="standard"
                                            fullWidth
                                            name="phone"
                                            value={formData.phone}
                                            label="Phone"
                                            onChange={handleInputChange}
                                            focused={formData.phone ? true : false}
                                        />
                                        {formErrors.phone ? (<Alert sx={{ fontSize: "small" }} severity="error">{formErrors.phone}</Alert>) : null}
                                    </div> :
                                    <div style={detailsContainerStyle}>
                                        <PhoneIcon style={iconStyle} />
                                        <Typography variant="body1">{formData.phone}</Typography>
                                    </div>
                                }
                            </div>
                            <div>
                                {editMode ?
                                    <div>
                                        <TextField
                                            variant="standard"
                                            fullWidth
                                            name="email"
                                            focused={formData.email ? true : false}
                                            type="email"
                                            value={formData.email}
                                            label="Email"
                                            onChange={handleInputChange}
                                        />
                                        {formErrors.email ? (<Alert sx={{ fontSize: "small" }} severity="error">{formErrors.email}</Alert>) : null}
                                    </div>
                                    :
                                    <div style={detailsContainerStyle}>
                                        <EmailIcon style={iconStyle} />
                                        <Typography variant="body1">{formData.email}</Typography>
                                    </div>
                                }
                            </div>
                            {editMode ?
                                <div>
                                    <Button color='primary' onClick={onSubmit} variant='contained' size='small' sx={{ marginTop: "10px" }}>Save</Button>
                                </div>
                                : null}
                        </Grid>
                        <Grid item xs={12} sm={2} md={2} lg={2}>
                            {editMode ?
                                <IconButton onClick={() => {
                                    backupFunc();
                                    setFormErrors({});
                                    setEditMode(false);
                                    setImage(null);
                                }
                                }>
                                    <KeyboardBackspaceIcon />
                                </IconButton>
                                :
                                <IconButton onClick={() => setEditMode(true)}>
                                    <EditIcon color='primary' />
                                </IconButton>
                            }
                        </Grid>
                    </Grid>
                    : (<LinearProgress color="inherit"/>)}
            </DialogContent>
        </Dialog>
    );
};

export default UserProfileModal;
