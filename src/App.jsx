import React from 'react'
import { BrowserRouter as Router, Routes,Route } from 'react-router-dom'
import Dashboard from './Pages/Dashboard'
import Users from './Pages/Users'
import Enquiry from './Pages/Enquiry'
import Setting from './Pages/Setting'
import Booking from './Pages/Booking'
import Login from './Pages/Login'
import AllBooking from './Pages/AllBooking'
import ManagePackage from './Pages/ManagePackage'
import ManageDesign from './Pages/ManageDesign'
import InfoSetting from './Pages/InfoSetting'
import Profile from './Pages/Profile'
const App = () => {
  return (
   <>
   <Router>
    <Routes>

     
     <Route path='/' element={<Login/>} />
      <Route path='/dashboard' element={<Dashboard/>}/>
      <Route path='/user' element={<Users/>}/>
      <Route path='/booking"' element={<Booking/>}/>
      <Route path='/enquiry' element={<Enquiry/>}/>
      <Route path='/setting' element={<Setting/>}/>
      <Route path='/booking/allbooking' element={<AllBooking/>}/>
      <Route path='/booking/packages' element={<ManagePackage/>}/>
      <Route path='/booking/design-styles' element={<ManageDesign/>}/>
      <Route path='/setting/contact' element={<InfoSetting/>}/>
      <Route path='/setting/profile' element={<Profile/>}/>
    </Routes>
   </Router>
   </>
  )
}

export default App