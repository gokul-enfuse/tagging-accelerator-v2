import React from 'react'
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import './style.css'

const Model = ({open,handleClose}) => {
    const style = {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 400,
      bgcolor: 'background.paper',
      border: '2px solid #000',
      borderRadius: '7px',
      boxShadow: 24,
      p: 4,
    };
  return (
    <div>
         <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Select Option
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>

              </Typography>
              <div className='wrapper'>
                <div id='HAlign'>
                  <div className='wrapper2' id='tagUsr'>
                    <select style={{width: '100%'}}>
                      <option >Tagger User ID</option>
                    </select>
                  </div>
                  <div className='wrapper2'>
                    <select>
                      <option >Reviewer User ID</option>
                    </select>
                  </div>
                </div>
                <div className='wrapper'>
                  <button id='btn'>Update</button>
                </div>
              </div>
            </Box>
          </Modal>
    </div>
  )
}

export default Model;
