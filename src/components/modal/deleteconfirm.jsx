import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';

const style = {
  display: 'flex',
  flexDirection: 'column',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '40%',
  //   height: '60%',
  bgcolor: 'background.paper',
  border: '1px solid grey',
  borderRadius: '20px',
  boxShadow: 24,
  p: 4,
};

function DeleteConfirm({ title, open, handleClose, yesFunc, noFunc }) {
  return (
    <Modal open={Boolean(open)} onClose={handleClose}>
      <Box sx={style}>
        <Typography variant="h3">{title} устгахдаа итгэлтэй байна уу</Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button onClick={noFunc}>Үгүй</Button>
          <Button onClick={yesFunc}>Тийм</Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default DeleteConfirm;
