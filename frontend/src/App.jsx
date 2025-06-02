import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import 'remixicon/fonts/remixicon.css'
import Authentication from './pages/Authentication'
import UserProtectedWrapper from './pages/UserProtectedWrapper'
import UserProfile from './pages/UserProfile'
import ProductDetails from './pages/ProductDetails'
import CategoryProducts from './pages/CategoryProducts'
import AdminPanel from './pages/AdminPanel'
import MyCart from './pages/MyCart'
import Admin from './pages/Admin'
import PaymentPage from './pages/PaymentPage'

import AdminLogin from './pages/AdminLogin'
import AdminProtectedWrapper from './pages/AdminProtectedWrapper'
import MyOrders from './pages/MyOrders'

const App = () => {
  return (
   <Routes>
      <Route path="/" element={<Home/>} />
      <Route path='/authenticate' element={<Authentication/>}/>
      <Route path='/product-details/:productId' element={<ProductDetails/>}/>
      <Route path='/category-products/:category' element={<CategoryProducts/>}/>
      <Route path='/profile' element={<UserProtectedWrapper><UserProfile/></UserProtectedWrapper>}/>
      
      <Route path='/my-cart' element={
        <UserProtectedWrapper><MyCart/></UserProtectedWrapper>
      }/>
      <Route path='/order-place' element={<UserProtectedWrapper><PaymentPage/></UserProtectedWrapper> }/>
      <Route path='/admin' element={<AdminProtectedWrapper><Admin/></AdminProtectedWrapper> }/>
     <Route path='/admin-login' element={<AdminLogin/>}/>
     <Route path='my-orders' element={<UserProtectedWrapper><MyOrders/> </UserProtectedWrapper> }/>
   </Routes>
  )
}

export default App;