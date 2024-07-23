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
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import DiamondIcon from '@mui/icons-material/Diamond';
import Face3Icon from '@mui/icons-material/Face3';
import Face2Icon from '@mui/icons-material/Face2';

const initialMessages = [
    {
        id: 1,
        name: 'Keefe',
        message: 'Hi, How can I help you?',
        isSender: false,
    },
    {
        id: 2,
        name: 'Alene',
        message: 'My manager is holding my pay from the last 5 months',
        isSender: true,
    }
];

export default function PartyiInitiatedChat() {
    const [messages, setMessages] = useState(initialMessages);
    const [messageText, setMessageText] = useState('');
    const messagesEndRef = useRef(null);

    const handleSendMessage = (event) => {
        if ((event.type === 'click' || event.key === 'Enter') && messageText.trim() !== '') {
            const newMessage = {
                id: messages.length + 1,
                name: 'Alene',
                message: messageText,
                isSender: true,
            };
            setMessages([...messages, newMessage]);
            setMessageText('');
        }
    };

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    return (
        <Container maxWidth={false} disableGutters sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', overflow: 'hidden' }}>
            <Box sx={{ width: '65%', display: 'flex', justifyContent: 'center', height: '100%' }}>
                <Paper elevation={3} sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, height: '100%', width: '100%' }}>
                    <AppBar position="static" sx={{ backgroundColor: '#fff', color: '#000' }}>
                        <Toolbar>
                            <DiamondIcon/>
                            <Typography variant="h6" noWrap> &nbsp;&nbsp;Mediator AI </Typography>
                            <Box sx={{ flexGrow: 1 }} />
                            <Face2Icon fontSize={"large"} sx={{ marginLeft:"10px" }} />
                        </Toolbar>
                    </AppBar>
                    <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, overflow: 'hidden' }}>
                        <Box sx={{ flexGrow: 1, padding: '10px', overflowY: 'auto', backgroundColor: '#f9f9f9', 
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
                        }}>
                            {messages.map((msg) => (
                                <Box
                                    key={msg.id}
                                    sx={{
                                        display: 'flex',
                                        marginBottom: '10px',
                                        alignItems: 'flex-start',
                                        justifyContent: msg.isSender ? 'flex-end' : 'flex-start',
                                    }}
                                >
                                    {!msg.isSender && <Face3Icon fontSize={"large"} sx={{  padding: '2px', marginRight:"10px" }} />}
                                    <Box
                                        sx={{
                                            backgroundColor: msg.isSender ? '#cce4ff' : '#f1f1f1',
                                            padding: '10px',
                                            borderRadius: '10px',
                                            maxWidth: '70%',
                                            boxShadow: 1
                                        }}
                                    >
                                        <Typography variant="body2">{msg.message}</Typography>
                                        <Typography variant="caption" color="textSecondary">
                                            {msg.time}
                                        </Typography>
                                    </Box>
                                    {msg.isSender && <Face2Icon fontSize={"large"} sx={{  padding: '2px', marginLeft:"10px" }} />}
                                </Box>
                            ))}
                            <div ref={messagesEndRef} />
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
        </Container>
    );
}
