import { useState, useContext, useEffect } from 'react';
import {
    Button,
    CssBaseline,
    TextField,
    Grid,
    Box,
    Typography,
    Container,
    Alert,
    Input
}
    from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { FormContext } from '../App';

const isEmail = (email) =>
    /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);


const SignUp = () => {
    const navigate = useNavigate();
    const { setUser, user } = useContext(FormContext);
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


    const handleApi = async () => {
        let form = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (key === 'profileImage') {
                form.append(key, value, value.name);
            } else {
                form.append(key, value);
            }
        });
        let resp_1 = await fetch("/user/signup", {
            method: "POST",
            body: form,
            credentials: "include"
        });
        return await resp_1.json();
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormErrors({});
        if (validateForm()) {
            let resp = await handleApi();
            if (resp.error) {
                validateForm(resp.error);
            } else {
                setUser(resp);
                navigate("/");
            }
        }
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setFormData((prev) => ({
            ...prev,
            profileImage: file
        }));
        console.log(file.name);
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
                <Typography sx={{ fontSize: "large" }}>
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
                                            <label htmlFor="file-input">
                                                <Button variant="contained" component="span">
                                                    Upload File
                                                </Button>
                                            </label>
                                            {formErrors.profileImage ? (<Alert sx={{ fontSize: "small" }} severity="error">{formErrors.profileImage}</Alert>) : (formData.profileImage ? " File added" : null)}
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
            </Box>
        </Container>
    );
}

export default SignUp;