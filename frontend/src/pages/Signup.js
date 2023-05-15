import { useState } from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import { Link } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { registerUser } from '../controllers/userController';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import Alert from '@mui/material/Alert';
import { FormContext } from '../App';

const SignUp = () => {
    const navigate = useNavigate();
    const { setUser } = useContext(FormContext);
    const [formData, setFormData] = useState({
        fName: "",
        lName: "",
        email: "",
        password: "",
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
        if (!formData.email) {
            errors.email = 'Email is required.';
        }
        if (!formData.password) {
            errors.password = 'Password is required.';
        }
        if (!formData.fName) {
            errors.fName = 'First Name is required.';
        }
        if (!formData.lName) {
            errors.lName = 'Last Name is required.';
        }
        if (status) {
            errors.status = "Email already exists";
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            let resp = await registerUser(formData.fName, formData.lName, formData.email, formData.password);
            if (resp.error) {
                console.log(resp);
                validateForm(resp.error);
            } else {
                setUser(resp);
                navigate("/");
            }
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
                <Typography sx={{ fontSize: "large" }}>
                    Sign up
                </Typography>
                <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        {formErrors.status ? (<Alert sx={{ marginBottom : "15px",fontSize: "small" }} severity="error">{formErrors.status}</Alert>) : null}
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                autoComplete="given-name"
                                name="fName"
                                required
                                fullWidth
                                value={formData.fName}
                                onChange={handleInputChange}
                                variant='standard'
                                id="firstName"
                                label="First Name"
                                autoFocus
                            />
                            {formErrors.fName ? (<Alert sx={{ fontSize: "small" }} severity="error">{formErrors.fName}</Alert>) : null}
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                variant='standard'
                                value={formData.lName}
                                required
                                onChange={handleInputChange}
                                fullWidth
                                id="lastName"
                                label="Last Name"
                                name="lName"
                                autoComplete="family-name"
                            />
                            {formErrors.lName ? (<Alert sx={{ fontSize: "small" }} severity="error">{formErrors.lName}</Alert>) : null}
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                value={formData.email}
                                onChange={handleInputChange}
                                variant='standard'
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                            />
                            {formErrors.email ? (<Alert sx={{ fontSize: "small" }} severity="error">{formErrors.email}</Alert>) : null}
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                autoFocus
                                value={formData.password}
                                onChange={handleInputChange}
                                variant='standard'
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="new-password"
                            />
                            {formErrors.password ? (<Alert sx={{ fontSize: "small" }} severity="error">{formErrors.password}</Alert>) : null}
                        </Grid>
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