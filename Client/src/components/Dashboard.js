import { BrowserRouter, Route, Routes } from 'react-router-dom';
import React from 'react';
import Sidebar from './Sidebar.js';
import Admin from './Admin.js';
import Home from './Home.js';
import Tagger from './Tagger.js';
import Reviewer from './Reviewer.js';
import Manager from './Manager.js';
// import ProtectedRoute from './ProtectedRoute';
import RequireAuth from './RequiredAuth.js';
import { AuthProvider } from '../context/AuthProvider.js';
// import Logout from './Logout.js';
import CreateTask from './CreateTask.js';
import CreateProfile from './CreateProfile.js';
import AssignToReviewer from './AssignToReviewer.js';
import Reports from './Reports.js';
import CreateProject from './CreateProject.js';
import CreateProfileManager from './CreateProfileManager.js';
import ProfileDetailsManager from './ProfileDetailsManager.js';
import Forgotpassword from './Forgotpassword.js';
 
import HistoricalRecords from './HistoricalRecords.js';
import BulkUpload from './BulkUpload.js';




const Dashboard = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
      <Sidebar>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/resetpassword/:pid/:pemail" element={<Forgotpassword />} />
          {/* <Route path="/logout" element={<Logout />} /> */}

          <Route element={<RequireAuth />} >
            <Route path="/admin" element={<Admin />} />
            <Route path="/tagger" element={<Tagger />} />
            <Route path="/reviewer" element={<Reviewer />} />
            <Route path="/manager" element={<Manager />} />
            <Route path="/createtask" element={<CreateTask />} />
            <Route path="/createprofile" element={<CreateProfile />} />
            <Route path="/assigntoreviewer" element={<AssignToReviewer />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/bulkupload" element={<BulkUpload />} />
            <Route path="/createproject" element={<CreateProject />} />
            <Route path="/createprofilemanager" element={<CreateProfileManager />} />
            <Route path="/profiledetailsmanager" element={<ProfileDetailsManager />} />       
            <Route path="/historicalrecords" element={<HistoricalRecords />} />
            {/* <Route path="/reports" element={<Reports />} /> */}
          </Route>
        </Routes>
      </Sidebar>
        </AuthProvider>
    </BrowserRouter>
  );
};

export default Dashboard