import { useState, useEffect, useRef } from 'react';
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
import { LoginUser, verifyCaptcha, getQrCode } from '../controllers/userController';
import { useContext } from 'react';
import QRCodeModal from '../components/QrCodeModal';
import { FormContext } from '../App';
import ReCAPTCHA from "react-google-recaptcha";




const theme = createTheme();

const isEmail = (email) =>
    /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);

const Login = () => {
    const recaptcha = useRef();
    const { setUser } = useContext(FormContext);
    const [open, setOpen] = useState(false);
    const [QrCode, setQrCodeImage] = useState("");
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

    const validateForm = async (status) => {
        let errors = {};
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


    useEffect(() => {
        setFormErrors({});
    }, [formData]);

    const closeModal = () => {
        setOpen(false);
    }

    const retryQrCode = async () => {
        const newImage = await getQrCode();
        if (newImage.success){
            setQrCodeImage(newImage.image);
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormErrors({});
        if (validateForm()) {
            let data = await LoginUser(formData);
            const resp = await verifyCaptcha(recaptcha.current.getValue());
            if (resp.success === false) {
                validateForm("ReCaptcha verification failed");
            }
            if (data.status) {
                validateForm(data.status);
            } else {
                setUser(data);
                await retryQrCode();
                setOpen(true);
            }
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
                                        sx={{ mb: 4 }}
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
                        <ReCAPTCHA ref={recaptcha} sitekey={process.env.REACT_APP_SITE_KEY} />
                        {formErrors.hasOwnProperty("captcha") ? (<Alert sx={{ fontSize: "small" }} severity="error">{formErrors.captcha}</Alert>) : null}
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
                <QRCodeModal open={open} handleClose={closeModal} resend={retryQrCode} image={QrCode} />
            </Container>
        </ThemeProvider>
    );
}
export default Login;