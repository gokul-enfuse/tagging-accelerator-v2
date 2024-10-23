import React, { useEffect, useState } from 'react'
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import './style.css'
import axios from 'axios';
import { DOMAIN } from '../Constant.js';
import Swal from 'sweetalert2';

export const Model = ({open,handleClose,taskId,refreshData}) => {//refreshData
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
  const [taggerProfile, setTaggerProfile] = useState([]);
  const [reviewerProfile, setReviewerProfile] = useState([]);
  const [tagger, setTagger] = useState([]);
  const [reviewer, setReviewer] = useState([]);

  const handleTaggerChange = (e) => {
     const {value} = e.target;
     setTagger(value);
  };
  const handleReviewerChange = (e) => {
     const {value} = e.target;
     setReviewer(value)
  };
  const showAlert = (message, icon) => {
    Swal.fire({
      title: message,
      text: message,
      icon: icon,
      confirmButtonText: 'OK',
    });
  };
  const updateHistoricalData = (e) => {
    axios
      .put(`${DOMAIN}/api/updateprofile`, null, {
         params:{
             new_profile_id: tagger,
             new_reviewer_profile_id: reviewer,
             task_id: taskId.split('_')[0],
             old_reviewer_profile_id: taskId.split('_')[1]
         }
      }).then(result => {
          showAlert('Selected tasks reassigned successfully', 'success');
          handleClose();
          refreshData();
      }).catch(error => {
          console.log("hello",error);
          showAlert(error.response.data.message, 'error');
      });
  };

  useEffect(() => {
     axios.get(`${DOMAIN}/api/getallprofile`, {
        params: {
            role_id: [3, 4]
        }
     }).then(res => {
        setTaggerProfile(res.data.filter(items => items.profile_role === 3));
        setReviewerProfile(res.data.filter(items => items.profile_role === 4));
     }).catch(error => {
        console.log(error);
     });
  }, []);
  
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
                    <select style={{width: '100%'}} onChange={handleTaggerChange}>
                      <option key={0} value={0}>Tagger User ID</option>
                      {taggerProfile.length > 0 &&
                        taggerProfile.map((tagger) => (
                          <option key={tagger.profile_id} value={tagger.profile_id} > 
                            {tagger.profile_username}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className='wrapper2'>
                    <select onChange={handleReviewerChange}>
                      <option key={0} value={0}>Reviewer User ID</option>
                      {reviewerProfile.length > 0 &&
                        reviewerProfile.map((reviewer) => (
                          <option key={reviewer.profile_id} value={reviewer.profile_id} > 
                            {reviewer.profile_username}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
                <div className='wrapper'>
                  <button id='btn' onClick={updateHistoricalData} >Update</button>
                </div>
              </div>
            </Box>
          </Modal>
    </div>
  )
}

export const ModelReport = ({open,handleClose,taskId}) => {
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
              Work in progress.
            </Box>
          </Modal>
    </div>
  );
}
//export default Model;
