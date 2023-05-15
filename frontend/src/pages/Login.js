import { useState } from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import { LoginUser } from '../controllers/userController';
import { useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import { useContext } from 'react';
import { FormContext } from '../App';


const theme = createTheme();

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
        if (!formData.email) {
            errors.email = 'Email is required.';
            errors.helperEmail = "This field is required";
        }
        if (!formData.password) {
            errors.password = 'Password is required.';
            errors.helperPass = "This field is required";
        }
        if (status) {
            errors.status = "Invalid credentials";
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            let data = await LoginUser(formData.email, formData.password);
            data.status !== "invalid credentials" ? nav("/") : validateForm(data.status);
            setUser(data);
        }
    };

    return (
        <ThemeProvider theme={theme}>
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
                    <Typography sx={{ fontSize: "x-large" }}>
                        Log in
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        {formErrors.status ? (<Alert severity="error">{formErrors.status}</Alert>) : null}
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            value={formData.email}
                            onChange={handleInputChange}
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                        />
                        {formErrors.email ? (<Alert sx={{ fontSize: "small" }} severity="error">{formErrors.emal}</Alert>) : null}
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            value={formData.password}
                            onChange={handleInputChange}
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                        />
                        {formErrors.password ? <Alert sx={{ fontSize: "small" }} severity="error">{formErrors.password}</Alert> : null}
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