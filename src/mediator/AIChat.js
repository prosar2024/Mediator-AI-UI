import React, { useState, useEffect } from 'react';
import {
    Container,
    Box,
    TextField,
    List,
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemText,
    Typography,
    Divider,
    IconButton,
    AppBar,
    Toolbar,
    Paper,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import MenuIcon from '@mui/icons-material/Menu';

const initialMessages = [
    {
        id: 1,
        name: 'Keefe',
        message: 'Hi, How can I help you?',
        avatar: 'https://mui.com/static/images/avatar/1.jpg',
        isSender: false,
    },
    {
        id: 2,
        name: 'Alene',
        message: 'My manager is holding my pay from the last 5 months',
        avatar: 'https://mui.com/static/images/avatar/2.jpg',
        isSender: true,
    },
    {
        id: 3,
        name: 'Keefe',
        message: 'Did you talk to your manager regarding this?',
        avatar: 'https://mui.com/static/images/avatar/1.jpg',
        isSender: false,
    },
    {
        id: 4,
        name: 'Alene',
        message: 'Yes I did.. many times',
        avatar: 'https://mui.com/static/images/avatar/2.jpg',
        isSender: true,
    },
    {
        id: 5,
        name: 'Keefe',
        message: 'Okay, what is your manager saying about this?',
        avatar: 'https://mui.com/static/images/avatar/1.jpg',
        isSender: false,
    },
    {
        id: 6,
        name: 'Alene',
        message: 'He is just ignoring whenever I ask him about this',
        avatar: 'https://mui.com/static/images/avatar/2.jpg',
        isSender: true,
    },
    {
        id: 7,
        name: 'Keefe',
        message: 'I see, Is your HR aware of this?',
        avatar: 'https://mui.com/static/images/avatar/1.jpg',
        isSender: false,
    },
];

const users = [
    { name: 'Aravind', role: 'Party 1', status: '[in progress]', avatar: 'https://mui.com/static/images/avatar/5.jpg' },
    { name: 'Rohit', role: 'Party 2', status: '[pending]', avatar: 'https://mui.com/static/images/avatar/1.jpg' },
    { name: 'Sajan', role: 'Witness 1', status: '[pending]', avatar: 'https://mui.com/static/images/avatar/2.jpg' },
    { name: 'Prahalad', role: 'Witness 2', status: '[pending]', avatar: 'https://mui.com/static/images/avatar/6.jpg' },
];

function AIChat() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [showSidebar, setShowSidebar] = useState(!isMobile);
    const [messages, setMessages] = useState(initialMessages);
    const [messageText, setMessageText] = useState('');

    useEffect(() => {
        setShowSidebar(!isMobile);
    }, [isMobile]);

    const handleToggleSidebar = () => {
        setShowSidebar(!showSidebar);
    };

    const handleSendMessage = (event) => {
        if (event.key === 'Enter' && messageText.trim() !== '') {
            const newMessage = {
                id: messages.length + 1,
                name: 'Alene',
                message: messageText,
                avatar: 'https://mui.com/static/images/avatar/2.jpg',
                isSender: true,
            };
            setMessages([...messages, newMessage]);
            setMessageText('');
        }
    };

    return (
        <Container maxWidth={false} disableGutters sx={{ display: 'flex', height: '100vh', flexDirection: 'column' }}>
            <Paper elevation={3} sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, width: '100%', height: '100%' }}>
                <AppBar position="static" sx={{ backgroundColor: '#fff', color: '#000' }}>
                    <Toolbar>
                        <Box borderRadius={10} component="img" src={"https://mui.com/static/images/avatar/7.jpg"} alt="logo" sx={{ height: 40, marginRight: 2 }} />
                        <Typography variant="h6" noWrap>
                            Mediator AI
                        </Typography>
                        <IconButton edge="start" color="inherit" onClick={handleToggleSidebar} sx={{ marginLeft: '20px' }}>
                            <MenuIcon />
                        </IconButton>
                        <Box sx={{ flexGrow: 1 }} />
                        <Avatar src="https://mui.com/static/images/avatar/2.jpg" />
                        {!isMobile && (
                            <Typography variant="subtitle1" noWrap sx={{ marginLeft: '10px' }}>
                                Aravind R Pillai
                            </Typography>
                        )}
                    </Toolbar>
                </AppBar>
                <Box sx={{ display: 'flex', flex: 1, width: '100%' }}>
                    {showSidebar && (
                        <Box sx={{ width: '300px', borderRight: '1px solid #ddd', display: 'flex', flexDirection: 'column' }}>
                            <Box sx={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                                <Typography variant="h6">Parties Involved</Typography>
                            </Box>
                            <List sx={{ flexGrow: 1, overflowY: 'auto' }}>
                                {users.map((user) => (
                                    <ListItem
                                        key={user.name}
                                        sx={{
                                            padding: '10px',
                                            '&:hover': {
                                                backgroundColor: '#f1f1f1',
                                                cursor: 'pointer',
                                            },
                                        }}
                                    >
                                        <ListItemAvatar>
                                            <Avatar src={user.avatar} />
                                        </ListItemAvatar>
                                        <ListItemText primary={user.name} secondary={user.role} />
                                        <Typography variant="caption">{user.status}</Typography>
                                    </ListItem>
                                ))}
                            </List>
                            <Divider />
                            <Box sx={{ padding: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="body2">Mediator</Typography>
                            </Box>
                            <Box sx={{ padding: '8px', display: 'flex', alignItems: 'center' }}>
                                <Avatar src="https://mui.com/static/images/avatar/2.jpg" />
                                <Typography variant="body2" sx={{ marginLeft: '10px' }}>
                                    Adv. Mallesh Yadev
                                </Typography>
                            </Box>
                        </Box>
                    )}
                    <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ padding: '10px', borderBottom: '1px solid #ddd', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Typography variant="h6">Aravind R Pillai's Hearing</Typography>
                        </Box>
                        <Box sx={{ flexGrow: 1, padding: '10px', overflowY: 'auto', backgroundColor: '#f9f9f9' }}>
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
                                    {!msg.isSender && <Avatar src={msg.avatar} sx={{ marginRight: '10px' }} />}
                                    <Box
                                        sx={{
                                            backgroundColor: msg.isSender ? '#cce4ff' : '#f1f1f1',
                                            padding: '10px',
                                            borderRadius: '10px',
                                            maxWidth: '70%',
                                            boxShadow: 1, // subtle shadow for conversation boxes
                                        }}
                                    >
                                        <Typography variant="body2">{msg.message}</Typography>
                                        <Typography variant="caption" color="textSecondary">
                                            {msg.time}
                                        </Typography>
                                    </Box>
                                    {msg.isSender && <Avatar src={msg.avatar} sx={{ marginLeft: '10px' }} />}
                                </Box>
                            ))}
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
                </Box>
                <Box sx={{ padding: '10px', textAlign: 'center', borderTop: '1px solid #ddd' }}>
                    <Typography variant="caption">&copy; 2024 Mediator AI Application. All rights reserved.</Typography>
                </Box>
            </Paper>
        </Container>
    );
}

export default AIChat;
