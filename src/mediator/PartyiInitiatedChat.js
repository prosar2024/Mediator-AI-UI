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
import PartiesInvolvedModal from './PartiesInvolvedModal';
import PeopleIcon from '@mui/icons-material/People';
import HttpIcon from '@mui/icons-material/Http';
import SourceIcon from '@mui/icons-material/Source';
import Party1InfoModal from './Party1InfoModal';

export default function PartyiInitiatedChat() {
    const navigate = useNavigate();
    const { conversation_id } = useParams();
    const [fileUploadModalOpen, setFileUploadModalOpen] = useState(false);
    const [summary, setSummary] = useState("");
    const [filesUploaded, setFilesUploaded] = useState("");
    
    const [partiesIdentified, setPartiesIdentified] = useState([]);
    const [partiesInvolvedModalOpen, setPartiesInvolvedModalOpen] = useState(false);
    const [thisUserInfoCollected, setThisUserInfoCollected] = useState(true);
    const [thisUserInfoModalOpen, setThisUserInfoModalOpen] = useState(false);
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
            if(thisUserInfoCollected === false){
                setThisUserInfoModalOpen(true)
                return 
             }
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
        let filesContent = `<br><b>Supporting Files: </b>`
        let indx = 0
        filesUploaded.forEach(fileData => {
            let content = `File : <b>${fileData.name}</b> uploaded<br>${fileData.description}`;
            appendMessageToUI(content, true)
            filesContent += `<br>${indx+1} : <b>${fileData.name}</b> : ${fileData.description}`;
            indx = indx+1
        })
        if(indx > 0){
            setFilesUploaded(filesContent)
        }else{
            setFilesUploaded(`<br><b>Supporting files uploaded`)
        }
        
        setPartiesInvolvedModalOpen(true);
        // let url = domain + URLS.STAGING_FILE_UPLOAD_COMPLETION_NOTIFY_URL + conversation_id;
        // let data = { fingerprint: SessionHandler.getSessionItem('fingerprint') }
        // console.log("Request Data : ", url, data);
        // ApiService.postRequest(url, data)
        //     .then((response) => {
        //        console.log("File upload ack response : ",response) 
        //     })
        //     .catch((err) => {
        //         console.error('POST Error:', err);
        //         setError(err["message"])
        //     });
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
                let isSummary = response['data']['is_summary'];
                if(isSummary !== true){
                    appendMessageToUI(aiMsg, false);
                }else{
                    console.log("Parties Identified : ", response['data']['parties_identified'])
                    setPartiesIdentified(response['data']['parties_identified'])
                    setFileUploadModalOpen(true)
                    setSummary(aiMsg)
                }
            })
            .catch((err) => {
                console.error('POST Error:', err);
                setError(err["message"])
            });
    }

    function partiesInvolvedCallBackHandler(records){
        console.log("FIles uploaded msg : ",filesUploaded)
        
        console.log("Return from Parties Involved : ", records)
        let indx = 0
        let _partiesInvolved = `<b><br>Parties Involved:</b>`
        records.forEach(party => {
            _partiesInvolved += `<br>${indx+1} : <b>${party["name"]}</b>`;
            indx = indx+1
        })
        let finalSummary = `${summary}<br> ${filesUploaded} <br> ${_partiesInvolved}`;
        console.log("Finak Summary : ",finalSummary)

        appendMessageToUI(finalSummary, false)
    }

    function thisUserInfoCallBackHandler(response){
        console.log("This user info : ", response)
        setThisUserInfoCollected(true);
        makeServiceCall();
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
            <Box sx={{ width: { xs: '100%', sm: '80%', md: '65%'}, display: 'flex', justifyContent: 'center', height: '100%' }}>
                <Paper elevation={3} sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, height: '100%', width: '100%' }}>
                    <AppBar position="static" sx={{ backgroundColor: '#fff', color: '#000' }}>
                        <Toolbar>
                            <DiamondIcon />
                            <Typography variant="h6" noWrap>
                                {' '}
                                &nbsp;&nbsp;Mediator AI{' '}
                            </Typography>

                            <Box sx={{ flexGrow: 1 }} />
                            {/* <Button variant="contained" onClick={() => { setPartiesInvolvedModalOpen(true) }} sx={{ marginLeft: '10px' }}>Add Parties</Button>
                            <Button variant="contained" onClick={() => { setModalOpen(true) }} sx={{ marginLeft: '10px' }}>Update URL</Button> */}

                            <IconButton onClick={() => { setModalOpen(true) }} sx={{ marginLeft: '10px' }}>
                                <HttpIcon />
                            </IconButton>
                            <IconButton onClick={() => { setFileUploadModalOpen(true) }} sx={{ marginLeft: '10px' }}>
                                <SourceIcon />
                            </IconButton>
                            <IconButton onClick={() => { setPartiesInvolvedModalOpen(true) }} sx={{ marginLeft: '10px' }}>
                                <PeopleIcon />
                            </IconButton>
                            <IconButton onClick={() => { setThisUserInfoModalOpen(true) }} sx={{ marginLeft: '10px' }}>
                                <Face2Icon />
                            </IconButton>
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

            <PartiesInvolvedModal 
                modalOpen={partiesInvolvedModalOpen} 
                setModalOpen={setPartiesInvolvedModalOpen} 
                conversationID={conversation_id} 
                domainUrl = {domain}
                callBackHandler={partiesInvolvedCallBackHandler} 
                descriptions = {partiesIdentified}
                />

            <Party1InfoModal 
                modalOpen={thisUserInfoModalOpen} 
                setModalOpen={setThisUserInfoModalOpen} 
                conversationID={conversation_id} 
                domainUrl = {domain}
                callBackHandler={thisUserInfoCallBackHandler}
                />

        </Container>
    );
}
