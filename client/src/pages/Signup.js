import { useState, useContext } from 'react';
import {
    Button,
    CssBaseline,
    TextField,
    Grid,
    Box,
    Typography,
    Container,
    Alert,
    Input,
    IconButton,
    Avatar,
    CircularProgress
}
    from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';

import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import { FormContext } from '../App';
import { registerUser } from '../controllers/userController';

const isEmail = (email) =>
    /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);


const SignUp = () => {
    const navigate = useNavigate();
    const { setUser } = useContext(FormContext);
    const [change, setChange] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        phone: "",
        profileImage: null
    });
    const [formErrors, setFormErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };


    const validateForm = (status) => {
        const errors = {};
        if (!status) {
            Object.entries(formData).forEach(([key, value]) => {
                if (!value) {
                    errors[key] = `${key} is required`;
                } else if (key === "email") {
                    if (!isEmail(value)) {
                        errors[key] = `Invalid format`;
                    }
                }
            });
        } else {
            errors.status = status;
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };


    const handleSubmit = async (e) => {
        try {
            setChange(true);
            e.preventDefault();
            setFormErrors({});
            if (validateForm()) {
                let resp = await registerUser(formData);
                if (resp.error && resp.error !== {}) {
                    validateForm(resp.error);
                    console.log(resp);
                    throw resp.error;
                } else {
                    setUser(resp);
                    navigate("/");
                }
                setChange(false);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        if (file) {
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                setFormData((prev) => ({
                    ...prev,
                    profileImage: event.target.result
                }));
            };
        }
    };


    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                {!change ?
                    <div>
                        <Typography sx={{ fontSize: "large",fontWeight:"bold" }}>
                            Sign up
                        </Typography>
                        <Box component="form" noValidate onSubmit={handleSubmit} encType='multipart/form-data' sx={{ mt: 3 }}>
                            {formErrors.status ? (<Alert sx={{ marginBottom: "15px", fontSize: "small" }} severity="error">{formErrors.status}</Alert>) : null}
                            <Grid container spacing={2}>
                                {Object.entries(formData).map(([key, value], index) => (
                                    <Grid key={index} item xs={12} sm={(key === "firstName" || key === "lastName") ? 6 : 12}>
                                        {key === "profileImage" ?
                                            (
                                                <span>
                                                    <Input
                                                        type="file"
                                                        name="profileImage"
                                                        onChange={handleFileChange}
                                                        style={{ display: 'none' }}
                                                        id="file-input"
                                                    />
                                                    <Grid container>
                                                        <Grid item xs={6}>
                                                            <IconButton>
                                                                <label htmlFor="file-input">
                                                                    {formData.profileImage ?
                                                                        (
                                                                            <Avatar src={formData.profileImage} />
                                                                        )
                                                                        :
                                                                        (
                                                                            <Avatar>
                                                                                <AddPhotoAlternateOutlinedIcon />
                                                                            </Avatar>
                                                                        )
                                                                    }
                                                                </label>
                                                            </IconButton>
                                                        </Grid>
                                                    </Grid>
                                                    {formErrors.profileImage ? (<Alert sx={{ fontSize: "small" }} severity="error">{formErrors.profileImage}</Alert>) : null}
                                                </span>
                                            )
                                            :
                                            (
                                                <span>
                                                    <TextField
                                                        name={key}
                                                        type={key === "password" ? key : "text"}
                                                        variant="standard"
                                                        required
                                                        fullWidth
                                                        value={value}
                                                        onChange={handleInputChange}
                                                        id={key}
                                                        label={key.charAt(0).toUpperCase() + key.slice(1)}
                                                        autoFocus
                                                    />
                                                    {formErrors.hasOwnProperty(key) ? (
                                                        <Alert sx={{ fontSize: "small" }} severity="error">
                                                            {formErrors[key]}
                                                        </Alert>
                                                    ) : null}
                                                </span>
                                            )
                                        }
                                    </Grid>
                                ))}
                            </Grid>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Sign Up
                            </Button>
                            <Grid container justifyContent="flex-end">
                                <Grid item>
                                    <Link to="/login">
                                        Already have an account? Sign in
                                    </Link>
                                </Grid>
                            </Grid>
                        </Box>
                    </div> : <CircularProgress />}
            </Box>
        </Container >
    );
}

export default SignUp;