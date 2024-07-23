import React, { useState } from 'react';
import { Container, Box, TextField, Button, Typography, Modal, MenuItem, Table, TableBody, TableCell, TableHead, TableRow, Paper, IconButton, Stack } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

const roles = ['petitioner', 'respondent', 'jury'];

function NewCase() {
  const [caseSummary, setCaseSummary] = useState('');
  const [open, setOpen] = useState(false);
  const [parties, setParties] = useState([]);
  const [partyName, setPartyName] = useState('');
  const [partyRole, setPartyRole] = useState('');
  const [email, setEmail] = useState('');
  const [contactNumber, setContactNumber] = useState('');

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleAddParty = () => {
    setParties([...parties, { partyName, partyRole, email, contactNumber }]);
    setPartyName('');
    setPartyRole('');
    setEmail('');
    setContactNumber('');
    handleClose();
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="h4" gutterBottom>
          New Case
        </Typography>
        <Button variant="contained" color="primary" onClick={handleOpen}>
          Register Case
        </Button>
        </Stack>
        <br/>
        <TextField
          label="Case Summary"
          multiline
          rows={4}
          fullWidth
          variant="outlined"
          value={caseSummary}
          onChange={(e) => setCaseSummary(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button variant="contained" color="primary" onClick={handleOpen}>
          Add Parties
        </Button>

        
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="add-party-modal-title"
          aria-describedby="add-party-modal-description"
        >
          <Box sx={{ ...style, width: 400 }}>
            <Typography id="add-party-modal-title" variant="h6" component="h2">
              Add Party
            </Typography>
            <TextField
              label="Party Name"
              fullWidth
              variant="outlined"
              value={partyName}
              onChange={(e) => setPartyName(e.target.value)}
              sx={{ mt: 2 }}
            />
            <TextField
              select
              label="Party Role"
              fullWidth
              variant="outlined"
              value={partyRole}
              onChange={(e) => setPartyRole(e.target.value)}
              sx={{ mt: 2 }}
            >
              {roles.map((role) => (
                <MenuItem key={role} value={role}>
                  {role}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Email Id"
              fullWidth
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mt: 2 }}
            />
            <TextField
              label="Contact Number"
              fullWidth
              variant="outlined"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              sx={{ mt: 2 }}
            />
            <Button variant="contained" color="primary" onClick={handleAddParty} sx={{ mt: 2 }}>
              Submit
            </Button>
          </Box>
        </Modal>


        <Paper sx={{ mt: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Party Name</TableCell>
                <TableCell>Party Role</TableCell>
                <TableCell>Email Id</TableCell>
                <TableCell>Contact Number</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {parties.map((party, index) => (
                <TableRow key={index}>
                  <TableCell>{party.partyName}</TableCell>
                  <TableCell>{party.partyRole}</TableCell>
                  <TableCell>{party.email}</TableCell>
                  <TableCell>{party.contactNumber}</TableCell>
                  <TableCell>
                    <IconButton color="primary">
                      <SendIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>


      </Box>
    </Container>
  );
}

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default NewCase;
