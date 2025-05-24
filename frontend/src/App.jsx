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
const App = () => {
  return (
   <Routes>
      <Route path="/" element={<Home/>} />
      <Route path='/authenticate' element={<Authentication/>}/>
      <Route path='/product-details/:productId' element={<ProductDetails/>}/>
      <Route path='/product-subcategory/:subCategory' element={<SubCategoryProducts/>}/>
      <Route path='/profile' element={<UserProtectedWrapper><UserProfile/></UserProtectedWrapper>}/>
      <Route path='/add-product' element={<AdminPanel/>}/>
      <Route path='/my-cart' element={
        <UserProtectedWrapper><MyCart/></UserProtectedWrapper>
      }/>
      <Route path='/purchase' element={<PaymentPage/>}/>
      <Route path='/admin' element={<Admin/>}/>
   </Routes>
  )
}

export default App;