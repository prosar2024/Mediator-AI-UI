import React, { useState } from 'react';
import {
    Box,
    TextField,
    Typography,
    Button,
    Modal,
    Select,
    MenuItem
} from '@mui/material';
import { useTheme, useMediaQuery } from '@mui/material';

export default function Party1InfoModal({ modalOpen, setModalOpen, callBackHandler }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [role, setRole] = useState('Petitioner');

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handleReset = () => {
        setName('');
        setEmail('');
        setMobileNumber('');
        setRole('Petitioner');
    };

    const handleSubmit = () => {
        const formData = {
            name,
            email,
            mobileNumber,
            role
        };
        console.log(formData);
        callBackHandler(formData);
        setModalOpen(false);
    };

    const handleClose = () => {
        setModalOpen(false);
    };

    return (
        <Modal
            open={modalOpen}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: isMobile ? '100%' : 400,
                    bgcolor: 'background.paper',
                    border: '2px solid #000',
                    boxShadow: 24,
                    p: 4,
                }}
            >
                <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ marginBottom: '20px' }}>
                    Lets start with your details.
                </Typography>
                <TextField
                    variant="outlined"
                    fullWidth
                    label="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    sx={{ marginBottom: '20px' }}
                />
                <TextField
                    variant="outlined"
                    fullWidth
                    label="Email ID"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    sx={{ marginBottom: '20px' }}
                />
                <TextField
                    variant="outlined"
                    fullWidth
                    label="Mobile Number"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    sx={{ marginBottom: '20px' }}
                />
                <Select
                    fullWidth
                    disabled={true}
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    displayEmpty
                    sx={{ marginBottom: '20px' }}
                >
                    <MenuItem value="Petitioner">Petitioner</MenuItem>
                    <MenuItem value="Respondent">Respondent</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                </Select>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleReset}
                        sx={{ marginRight: '10px' }}
                    >
                        Reset
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                    >
                        Submit
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}
