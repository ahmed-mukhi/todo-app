import { useState } from 'react';
import {
    Button,
    CssBaseline,
    TextField,
    Grid,
    Box,
    Typography,
    Container,
    Alert
}
    from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import { LoginUser } from '../controllers/userController';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { FormContext } from '../App';




const theme = createTheme();

const isEmail = (email) =>
    /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);

const Login = () => {
    const nav = useNavigate();
    const { setUser } = useContext(FormContext);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
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
        e.preventDefault();
        setFormErrors({});
        if (validateForm()) {
            let data = await LoginUser(formData);
            if (data.status) {
                validateForm(data.status);
            } else {
                nav("/");
            }
            setUser(data);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box sx={{ marginTop: 8, flexDirection: 'column', alignItems: 'center' }}
                >
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Typography sx={{ fontSize: "x-large" }}>
                            Log in
                        </Typography>
                    </div>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        {formErrors.status ? (<Alert severity="error">{formErrors.status}</Alert>) : null}
                        {Object.entries(formData).map(([key, value], index) => {
                            return (
                                <span key={index}>
                                    <TextField
                                        margin="normal"
                                        type={key === "password" ? key : "text"}
                                        variant="standard"
                                        required
                                        fullWidth
                                        value={value}
                                        onChange={handleInputChange}
                                        id={key}
                                        label={key.charAt(0).toUpperCase() + key.slice(1)}
                                        name={key}
                                        autoComplete={key}
                                        autoFocus
                                    />
                                    {formErrors.hasOwnProperty(key) ? (<Alert sx={{ fontSize: "small" }} severity="error">{formErrors[key]}</Alert>) : null}
                                </span>
                            )
                        })}
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign In
                        </Button>
                        <Grid container>
                            <Grid item>
                                <Link to="/signup">
                                    Don't have an account? Sign Up
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}
export default Login;