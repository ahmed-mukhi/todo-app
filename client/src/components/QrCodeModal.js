import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    TextField,
    Button,
    Typography,
    Container,
    Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { verifyQrCode } from '../controllers/userController';

const QRCodeModal = ({ open, handleClose, resend, image }) => {
    const nav = useNavigate();
    const [otp, setOtp] = useState("");
    const [error, setError] = useState({});

    const handleOtpChange = (event) => {
        setOtp(event.target.value);
    };

    const handleButtonClick = async () => {
        if (otp.length) {
            setError({});
            let verification = await verifyQrCode(otp);
            if (verification.success) {
                nav("/");
            } else {
                setError({display: "Wrong OTP. Retry Please."})
            }
        } else {
            setError({ display: "Please fill in the otp" });
        }
    };

    return (
        <Dialog
            open={open}
            fullWidth
            maxWidth="xs"
            onClose={(event, reason) => {
                if (reason !== 'backdropClick') {
                    handleClose(event, reason);
                }
            }}
        >
            <Container>
                <DialogContent
                sx={{padding : "20px"}}
                >
                    <div style={{ marginTop: 16,textAlign: 'center' }}>
                    <Typography variant="h4" mb={2}>Scan the QR Code</Typography>
                        <img
                            src={image ? image : null}
                            alt="QR Code"
                            style={{ width: '100%', maxWidth: 200 }}
                        />
                    </div>

                    <TextField
                        label="Enter OTP"
                        variant="standard"
                        fullWidth
                        margin="normal"
                        value={otp}
                        onChange={handleOtpChange}
                    />
                    {error.display ? <Alert sx={{ fontSize: "small" }} severity="error">{error.display}</Alert> : null}


                    <Button
                    variant="contained"
                        color="success"
                        fullWidth
                        sx={{marginBottom:"5px"}}
                        onClick={handleButtonClick}
                    >
                        Submit
                    </Button>
                    <Button
                    variant="contained"
                        color="secondary"
                        fullWidth
                        onClick={resend}
                    >
                        Re-send
                    </Button>
                </DialogContent>
            </Container>
        </Dialog >
    );
};

export default QRCodeModal;
