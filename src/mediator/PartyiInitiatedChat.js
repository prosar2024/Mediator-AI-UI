import React, { useState, useRef, useEffect } from 'react';
import {
    Container,
    Box,
    TextField,
    Typography,
    IconButton,
    AppBar,
    Toolbar,
    Paper,
    Button,
    Modal,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import DiamondIcon from '@mui/icons-material/Diamond';
import Face3Icon from '@mui/icons-material/Face3';
import Face2Icon from '@mui/icons-material/Face2';
import ApiService from '../util/Service';
import SessionHandler from '../util/SessionHandler';
import { useNavigate, useParams } from 'react-router-dom';
import FileUploadModal from './FileUploadModal';
import { URLS } from '../util/Constants';

export default function PartyiInitiatedChat() {
    const navigate = useNavigate();
    const { conversation_id } = useParams();
    const [fileUploadModalOpen, setFileUploadModalOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [tempDomain, setTempDomain] = useState("");
    const [domain, setDomain] = useState("");
    const [messages, setMessages] = useState([]);
    const [messageText, setMessageText] = useState('');
    const [error, setError] = useState(null);
    const messagesEndRef = useRef(null);

    const handleSendMessage = (event) => {
        if ((event.type === 'click' || event.key === 'Enter') && messageText.trim() !== '') {
            appendMessageToUI(messageText, true);
            makeServiceCall(messageText);
            setMessageText('');
        }
    };

    function appendMessageToUI(msg, isSender, isFile = false) {
        const newMessage = {
            id: messages.length + 5,
            name: isSender ? 'User' : 'AI',
            message: msg,
            isSender: isSender,
            isFileUpload: isFile,
        };
        setMessages((prevMessages) => [...prevMessages, newMessage]);
    }

    useEffect(() => {
        if (domain === "" || domain === null) {
            setModalOpen(true)
            return
        } else {
            setModalOpen(false)
        }

        let conversationId = (conversation_id === null || conversation_id === undefined || conversation_id === "") ? null : conversation_id
        let fingerprint = SessionHandler.getSessionItem('fingerprint');
        console.log(conversationId)
        console.log(fingerprint)
        if (conversationId !== null && fingerprint !== null) {
            console.log("Make list all service call")
            let url = domain + URLS.STAGING_CONVERSATION_LIST_MESSAGES_URL + conversationId;
            let data = {
                "fingerprint": fingerprint
            }
            ApiService.postRequest(url, data)
                .then((response) => {
                    console.log(response['data'])

                    let content = []
                    let i = 1
                    for (let eachMsg of response["data"]) {
                        content.push({
                            id: i++,
                            name: eachMsg.role === "user" ? 'User' : 'AI',
                            message: eachMsg.content,
                            isSender: eachMsg.role === "user",
                            isFileUpload: eachMsg.request_fileupload
                        })
                    }
                    setMessages(content)
                    setError(null);
                })
                .catch((err) => {
                    console.error('POST Error:', err);
                    setError(err["message"])
                });
        } else {
            console.log("Make main service call")
            makeServiceCall();
        }
    }, [domain]);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    function fileModalCallBackHandler(filesUploaded) {
        console.log("Files uploaded ", filesUploaded)
        filesUploaded.forEach(fileData => {
            let content = `File : <b>${fileData.name}</b> uploaded<br>${fileData.description}`;
            appendMessageToUI(content, true)
        })

    }

    function makeServiceCall(message = null) {
        console.log('Sending msg- API call : ', message);
        let conversationId = (conversation_id === null || conversation_id === undefined || conversation_id === "") ? null : conversation_id
        let fingerprint = SessionHandler.getSessionItem('fingerprint');
        let url = domain + URLS.STAGING_CONVERSATION_URL
        if (conversationId != null) {
            url = url + conversationId;
        }
        let data = {
            fingerprint: fingerprint,
            user_message: message,
        };
        console.log("Request Data : ", url, data);
        ApiService.postRequest(url, data)
            .then((response) => {
                SessionHandler.setSessionItem('fingerprint', response['data']['fingerprint']);
                console.log('POST Response received:', response);
                if (conversationId === null) {
                    navigate('/pchat/' + response['data']['conversation_id']);
                }
                let aiMsg = response['data']['message'];
                let isFileUpload = response['data']['request_fileupload'];
                appendMessageToUI(aiMsg, false, isFileUpload);
            })
            .catch((err) => {
                console.error('POST Error:', err);
                setError(err["message"])
            });
    }

    return (
        <Container
            maxWidth={false}
            disableGutters
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                overflow: 'hidden',
            }}
        >
            <Box sx={{ width: '65%', display: 'flex', justifyContent: 'center', height: '100%' }}>
                <Paper elevation={3} sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, height: '100%', width: '100%' }}>
                    <AppBar position="static" sx={{ backgroundColor: '#fff', color: '#000' }}>
                        <Toolbar>
                            <DiamondIcon />
                            <Typography variant="h6" noWrap>
                                {' '}
                                &nbsp;&nbsp;Mediator AI{' '}
                            </Typography>

                            <Box sx={{ flexGrow: 1 }} />
                            <Button variant="contained" onClick={() => { setModalOpen(true) }} sx={{ marginLeft: '10px' }}>Update URL</Button>
                            <Face2Icon fontSize={'large'} sx={{ marginLeft: '10px' }} />
                        </Toolbar>
                    </AppBar>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            flexGrow: 1,
                            overflow: 'hidden',
                        }}
                    >
                        <Box
                            sx={{
                                flexGrow: 1,
                                padding: '10px',
                                overflowY: 'auto',
                                backgroundColor: '#f9f9f9',
                                '&::-webkit-scrollbar': {
                                    width: '8px',
                                },
                                '&::-webkit-scrollbar-track': {
                                    background: '#f1f1f1',
                                },
                                '&::-webkit-scrollbar-thumb': {
                                    background: '#888',
                                    borderRadius: '4px',
                                },
                                '&::-webkit-scrollbar-thumb:hover': {
                                    background: '#555',
                                },
                            }}
                        >
                            {messages.map((msg, index) => (
                                <Box
                                    key={"outer" + msg.id + index}  // Ensure unique key by combining id and index
                                    sx={{
                                        display: 'flex',
                                        marginBottom: '10px',
                                        alignItems: 'flex-start',
                                        justifyContent: msg.isSender ? 'flex-end' : 'flex-start',
                                    }}
                                >
                                    {!msg.isSender && <Face3Icon fontSize={'large'} sx={{ padding: '2px', marginRight: '10px' }} />}

                                    <Box key={"inner" + msg.id + index}  // Ensure unique key by combining id and index
                                        sx={{
                                            backgroundColor: msg.isSender ? '#cce4ff' : '#f1f1f1',
                                            padding: '10px',
                                            borderRadius: '10px',
                                            maxWidth: '70%',
                                            boxShadow: 1,
                                        }}
                                    >
                                        <Typography variant="body2" dangerouslySetInnerHTML={{ __html: msg.message }} />
                                        {msg.isFileUpload &&
                                            <>
                                                <br />
                                                <Button onClick={e => { setFileUploadModalOpen(true) }} variant="contained" component="span" sx={{ backgroundColor: 'ash' }}>
                                                    Upload file(s)
                                                </Button>
                                            </>
                                        }
                                    </Box>

                                    {msg.isSender && <Face2Icon fontSize={'large'} sx={{ padding: '2px', marginLeft: '10px' }} />}
                                </Box>
                            ))}
                            <div ref={messagesEndRef} />

                            {error &&
                                <center>{error}</center>
                            }
                        </Box>


                        <Box sx={{ padding: '10px', borderTop: '1px solid #ddd', display: 'flex', alignItems: 'center' }}>
                            <TextField
                                fullWidth
                                placeholder="Your Message..."
                                variant="outlined"
                                size="medium"
                                value={messageText}
                                onChange={(e) => setMessageText(e.target.value)}
                                onKeyDown={handleSendMessage}
                                sx={{ '& .MuiInputBase-input': { height: '40px' } }}
                            />
                            <IconButton onClick={handleSendMessage}>
                                <SendIcon />
                            </IconButton>
                        </Box>
                    </Box>
                    <Box sx={{ padding: '10px', textAlign: 'center', borderTop: '1px solid #ddd' }}>
                        <Typography variant="caption">&copy; 2024 Mediator AI Application. All rights reserved.</Typography>
                    </Box>
                </Paper>
            </Box>


            <Modal
                open={modalOpen}
                onClose={() => { setModalOpen(false) }}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        border: '2px solid #000',
                        boxShadow: 24,
                        p: 4,
                    }}
                >
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Enter Backend URL
                    </Typography>
                    <TextField
                        id="outlined-basic"
                        variant="outlined"
                        value={tempDomain}
                        onChange={(e) => { setTempDomain(e.target.value) }}
                        fullWidth
                        sx={{ marginBottom: '20px' }}
                    />
                    <Button variant="contained" onClick={() => { setDomain(tempDomain.trim()); setModalOpen(false); }}>
                        Submit
                    </Button>
                </Box>
            </Modal>

            <FileUploadModal 
                modalOpen={fileUploadModalOpen} 
                setModalOpen={setFileUploadModalOpen} 
                conversationID={conversation_id} 
                domainUrl = {domain}
                callBackHandler={fileModalCallBackHandler} />

        </Container>
    );
}
