import React, { useState, useEffect } from 'react';
import {
    Box,
    TextField,
    Typography,
    Button,
    Modal,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Select,
    MenuItem
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTheme, useMediaQuery } from '@mui/material';

export default function PartiesInvolvedModal({ modalOpen, setModalOpen, callBackHandler }) {
    const [rows, setRows] = useState([]);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        if (modalOpen && rows.length === 0) {
            handleAddRow();
        }
    }, [modalOpen]);

    const handleAddRow = () => {
        setRows([...rows, { name: '', email: '', role: '' }]);
    };

    const handleRemoveRow = (index) => {
        const newRows = rows.filter((_, i) => i !== index);
        setRows(newRows);
    };

    const handleChange = (index, field) => (event) => {
        const newRows = [...rows];
        newRows[index][field] = event.target.value;
        setRows(newRows);
    };

    const handleReset = () => {
        setRows([]);
    };

    const handleSubmit = () => {
        callBackHandler(rows);
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
                    width: isMobile ? '100%' : 600,
                    bgcolor: 'background.paper',
                    border: '2px solid #000',
                    boxShadow: 24,
                    p: 4,
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '20px'
                    }}
                >
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Please add all the parties involved
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={handleAddRow}
                    >
                        + Add Party
                    </Button>
                </Box>
                {rows.length > 0 && (
                    <TableContainer component={Paper} sx={{ maxHeight: 400, overflow: 'auto' }}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Role</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.map((row, index) => (
                                    <TableRow key={index}>
                                        <TableCell>
                                            <TextField
                                                variant="outlined"
                                                fullWidth
                                                value={row.name}
                                                onChange={handleChange(index, 'name')}
                                                placeholder="Enter Name"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <TextField
                                                variant="outlined"
                                                fullWidth
                                                value={row.email}
                                                onChange={handleChange(index, 'email')}
                                                placeholder="Enter Email"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Select
                                                fullWidth
                                                value={row.role}
                                                onChange={handleChange(index, 'role')}
                                                displayEmpty
                                            >
                                                <MenuItem value="">
                                                    <em>Select Role</em>
                                                </MenuItem>
                                                <MenuItem value="Witness">Witness</MenuItem>
                                                <MenuItem value="Accused">Accused</MenuItem>
                                                <MenuItem value="Other">Other</MenuItem>
                                            </Select>
                                        </TableCell>
                                        <TableCell>
                                            <IconButton
                                                onClick={() => handleRemoveRow(index)}
                                                sx={{
                                                    '&:hover': {
                                                        color: 'red',
                                                    },
                                                }}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
                {rows.length > 0 && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                        <Box>
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
                                onClick={handleClose}
                            >
                                Close
                            </Button>
                        </Box>
                        <Button
                            variant="contained"
                            onClick={handleSubmit}
                        >
                            Submit
                        </Button>
                    </Box>
                )}
            </Box>
        </Modal>
    );
}
