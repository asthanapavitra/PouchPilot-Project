import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import 'remixicon/fonts/remixicon.css'
import Authentication from './pages/Authentication'
import UserProtectedWrapper from './pages/UserProtectedWrapper'
import UserProfile from './pages/UserProfile'
import ProductDetails from './pages/ProductDetails'
import SubCategoryProducts from './pages/SubCategoryProducts'
import AdminPanel from './pages/AdminPanel'
import MyCart from './pages/MyCart'
import Admin from './pages/Admin'
import PaymentPage from './pages/PaymentPage'

import AdminLogin from './pages/AdminLogin'
import AdminProtectedWrapper from './pages/AdminProtectedWrapper'

const App = () => {
  return (
   <Routes>
      <Route path="/" element={<Home/>} />
      <Route path='/authenticate' element={<Authentication/>}/>
      <Route path='/product-details/:productId' element={<ProductDetails/>}/>
      <Route path='/product-category/:category' element={<SubCategoryProducts/>}/>
      <Route path='/profile' element={<UserProtectedWrapper><UserProfile/></UserProtectedWrapper>}/>
      
      <Route path='/my-cart' element={
        <UserProtectedWrapper><MyCart/></UserProtectedWrapper>
      }/>
      <Route path='/purchase' element={<PaymentPage/>}/>
      <Route path='/admin' element={<AdminProtectedWrapper><Admin/></AdminProtectedWrapper> }/>
     <Route path='/admin-login' element={<AdminLogin/>}/>
   </Routes>
  )
}

export default App;