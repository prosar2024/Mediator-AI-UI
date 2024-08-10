import React, { useState } from 'react';
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
    LinearProgress
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTheme, useMediaQuery } from '@mui/material';
import { URLS } from '../util/Constants';
import ApiService from '../util/Service';
import SessionHandler from '../util/SessionHandler';

export default function FileUploadModal({ modalOpen, setModalOpen, conversationID, domainUrl, callBackHandler }) {
    const [files, setFiles] = useState([]);
    const [descriptions, setDescriptions] = useState({});
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState({});
    const [uploaded, setUploaded] = useState({});
    const [conversationId, setConversationId] = useState(conversationID);
    const [domain, setDomain] = useState(domainUrl);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handleFileChange = (event) => {
        const selectedFiles = Array.from(event.target.files);
        setFiles(prevFiles => [...prevFiles, ...selectedFiles]);
    };

    const handleDescriptionChange = (index) => (event) => {
        const newDescriptions = { ...descriptions, [index]: event.target.value };
        setDescriptions(newDescriptions);
    };


    async function uploadFile(file, description) {
        const base64File = await convertToBase64(file);
        let fingerprint = SessionHandler.getSessionItem('fingerprint');
        const payload = {
            fingerprint : fingerprint,
            filename: file.name,
            description: description,
            file_base64: base64File
        };
        console.log("Request Payload : ", payload);
        console.log(domainUrl , URLS.STAGING_FILE_UPLOAD_URL , conversationID)
        return ApiService.postRequest(domainUrl + URLS.STAGING_FILE_UPLOAD_URL + conversationID, payload)
            .then((response) => {
                console.log("Response : ", response);
                return true;
            })
            .catch((err) => {
                console.error('POST Error:', err);
                return false;
            });
    }
    
    function convertToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result.split(',')[1]);
            reader.onerror = (error) => reject(error);
        });
    }
    
    const handleRemoveFile = (index) => {
        const newFiles = files.filter((_, i) => i !== index);
        setFiles(newFiles);

        const newDescriptions = { ...descriptions };
        delete newDescriptions[index];
        setDescriptions(newDescriptions);

        const newProgress = { ...progress };
        delete newProgress[index];
        setProgress(newProgress);

        const newUploaded = { ...uploaded };
        delete newUploaded[index];
        setUploaded(newUploaded);
    };

    const handleRemoveAllFiles = () => {
        setFiles([]);
        setDescriptions({});
        setProgress({});
        setUploaded({});
        setModalOpen(false);
        callBackHandler([]);
    };

    const handleClose = () => {
        handleRemoveAllFiles();
        setModalOpen(false);
    };

    const handleSubmit = async () => {
        setUploading(true);
        let uploadResults = [];
        for (let i = 0; i < files.length; i++) {
            if (uploaded[i] === true) {
                // Skip already uploaded files
                continue;
            }
            const file = files[i];
            const description = descriptions[i] || '';
            setProgress(prev => ({ ...prev, [i]: 0 }));

            const success = await uploadFile(file, description);
            console.log("uploaded status : ", success);
            if (success) {
                setUploaded(prev => ({ ...prev, [i]: true }));
                setProgress(prev => ({ ...prev, [i]: 100 }));
                uploadResults.push({ name: file.name, description: description });
            } else {
                setUploaded(prev => ({ ...prev, [i]: false }));
            }
        }
        setUploading(false);
        handleRemoveAllFiles();
        if (callBackHandler) {
            callBackHandler(uploadResults);
            setModalOpen(false);
        }
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
                        Upload Relevant Files
                    </Typography><br/>
                    {files.length == 0 &&
                    <Button
                        variant="contained"
                        component="label"
                        color={'warning'}
                        onClick={()=>{setModalOpen(false); callBackHandler([]); }}
                    >
                        No files to upload
                    </Button>
                    }
                    <Button
                        variant="contained"
                        component="label"
                        disabled={uploading}
                    >
                        Select Files
                        <input
                            type="file"
                            hidden
                            multiple
                            onChange={handleFileChange}
                        />
                    </Button>
                </Box>
                {files.length > 0 && (
                    <TableContainer component={Paper} sx={{ maxHeight: 400, overflow: 'auto' }}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell>File Name & Description</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {files.map((file, index) => (
                                    <TableRow key={index}>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                                {file.name}
                                                {uploaded[index] === true && (
                                                    <Typography variant="body2" color="success.main" sx={{ marginLeft: 1 }}>
                                                        Uploaded
                                                    </Typography>
                                                )}
                                                {uploaded[index] === false && (
                                                    <Typography variant="body2" color="error.main" sx={{ marginLeft: 1 }}>
                                                        Upload failed
                                                    </Typography>
                                                )}
                                                {uploaded[index] === undefined && (
                                                    <IconButton
                                                        onClick={() => handleRemoveFile(index)}
                                                        sx={{
                                                            marginLeft: 1,
                                                            '&:hover': {
                                                                color: 'red',
                                                            },
                                                        }}
                                                        disabled={uploading}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                )}
                                            </Box>
                                            {uploaded[index] === true ? (
                                                <Typography variant="body2" sx={{ marginTop: '10px' }}>
                                                    {descriptions[index]}
                                                </Typography>
                                            ) : (
                                                <TextField
                                                    variant="outlined"
                                                    fullWidth
                                                    placeholder="Add a description about the file"
                                                    value={descriptions[index] || ''}
                                                    onChange={handleDescriptionChange(index)}
                                                    sx={{ marginTop: '10px' }}
                                                    disabled={uploading}
                                                />
                                            )}
                                            {uploading && (
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={progress[index] || 0}
                                                    sx={{ marginTop: '10px' }}
                                                />
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
                {files.length > 0 && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                        <Box>
                            <Button
                                variant="contained"
                                color="error"
                                onClick={handleRemoveAllFiles}
                                sx={{ marginRight: '10px' }}
                                disabled={uploading}
                            >
                                Ignore, No files to upload 
                            </Button>
                            
                        </Box>
                        {!uploading && (
                            <Button
                                variant="contained"
                                onClick={handleSubmit}
                            >
                                Submit
                            </Button>
                        )}
                    </Box>
                )}
            </Box>
        </Modal>
    );
}
