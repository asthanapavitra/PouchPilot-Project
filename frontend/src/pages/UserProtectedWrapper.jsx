import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserDataContext } from "../context/UserContext";
import axios from 'axios'
const UserProtectedWrapper = ({ children }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const {setUser}=useContext(UserDataContext);
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    if (!token) {
      navigate("/authenticate", { replace: true });

    }
    else{
       
      axios.get(`${import.meta.env.VITE_BASE_URL}/users/get-profile`,{
        headers:{
          Authorization: `Bearer ${token}`
        }
      })
      .then((response)=>{
           
      
       
        if(response.status==201){
       
          setUser(response.data.user);
          setIsLoading(false)
        }
      })
      .catch(err=>{
        console.log(err);
        localStorage.removeItem("token");
        navigate("/authenticate", { replace: true });

      })
      
    }

  }, []);
  if(isLoading){
    return (
      <div>Loading...</div>
    )
  }
  return <div>{children}</div>;
};

export default UserProtectedWrapper;
