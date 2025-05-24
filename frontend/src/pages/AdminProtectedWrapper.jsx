import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { AdminDataContext } from '../context/AdminContext';
import axios from 'axios';
const AdminProtectedWrapper = ({children}) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("adminToken");
  const {setAdmin}=useContext(AdminDataContext);
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    if (!token) {
      navigate("/admin-login");
    }
    else{
       
      axios.get(`${import.meta.env.VITE_BASE_URL}/admin/get-profile`,{
        headers:{
          Authorization: `Bearer ${token}`
        }
      })
      .then((response)=>{
           
      
       
        if(response.status==201){
        
          setAdmin(response.data.admin);
          setIsLoading(false)
        }
      })
      .catch(err=>{
        console.log(err.response.data.error);
        localStorage.removeItem("token");
        navigate('/admin-login');
      })
      
    }

  }, []);
  if(isLoading){
    return (
      <div>Loading...</div>
    )
  }
  return <div>{children}</div>;
}

export default AdminProtectedWrapper