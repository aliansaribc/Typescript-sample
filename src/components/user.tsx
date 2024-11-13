import React,{ useState,useEffect } from "react";
import Navbar from "./navbar";
import axios from "axios";
import * as yup from 'yup';

function User() {

  const isUserLogin = async () =>
  {  
    const token = localStorage.getItem('token');
    const url = "https://api.aliansari.net/login?token=" + token;
    const res = await axios.get(url);    
    if(res.data ==='token:0')
    {
      localStorage.clear();
      window.location.href = '/login';
    }     
  }

  useEffect(() => {
    async function getToken() {
      const token = localStorage.getItem('token');
      let urlElements = window.location.pathname.split('/');
      if(token && urlElements[2])
      {   
        isUserLogin();
          const url = "https://api.aliansari.net/user/"+urlElements[2]+"?token="+token;   
          const res = await axios.get(url);
          setFormData(res.data);
      }
    }
    getToken();    
  }, []);

  const formSchema = yup.object({
      fullName : yup.string().required('full name is required'),
      phone : yup.string().max(10,'phone should be 10 max').required('phone is required'),
      email : yup.string().email('email should be email').required('email is required'),
      postal : yup.string().required('postal code is required'),
      address : yup.string().required('address is required')         
  })

  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    isUserLogin();
    setFormError("");
    setFormSending(true);
    e.preventDefault();
    try {   
      await formSchema.validate(formData,{abortEarly:false});
      const token = localStorage.getItem('token');
      let url='';
      if(formData.id){   
        url = "https://api.aliansari.net/user?id="+ formData.id +"&fullName=" + formData.fullName + "&phone=" + formData.phone
          + "&email=" + formData.email + "&postal=" + formData.postal + "&address=" + formData.address + "&token=" + token;
      }
      else{
        url = "https://api.aliansari.net/user?fullName=" + formData.fullName + "&phone=" + formData.phone
          + "&email=" + formData.email + "&postal=" + formData.postal + "&address=" + formData.address + "&token=" + token;          
      }  
      const res = await axios.post(url); 
      setFormSending(false);
      if(res.data==="login:failed"){
        setFormError("need login again!");
      }
      else{
        window.location.href = '/';
      }
    }
    catch (error) {
      setFormSending(false); 
      if (error instanceof Error) {        
        setFormError(error.message)
      } else {
          throw error;
      }   
    }
  }

  interface user  {
    id:string; fullName: string; phone: string; email: string; postal: string; address: string
  }

  interface userState  {
    user:user
  }
  const [formData, setFormData] = useState<user> ({
     id:'',fullName: '', phone: '', email: '', postal: '', address: ''
  })

  const [formError, setFormError] = useState<string | null>(null);
  const [formSending, setFormSending] = useState<boolean>(false);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setFormData(prevData => ({...prevData, [name]: value}))
  }

  return ( 
    <>
      <Navbar lnk="home"/>
      <div className="row justify-content-center align-items-center m-5">
        <div className="col-xl-4 text-center card bg-light">
          <form className="card-body p-5 text-center" onSubmit={handleSubmit}>   
            {
              formData.id ? <h3 className="mb-5">edit user {formData.id}</h3> : <h3 className="mb-5">add new user</h3>  
            }         
            <div className="form-outline mb-4">
              <input onChange={handleChange} type="text" id="fullName" name="fullName" className="form-control" placeholder="enter full name" value={formData.fullName} />                      
            </div>
            <div className="form-outline mb-4">
              <input onChange={handleChange} type="text" id="phone" name="phone" className="form-control" placeholder="enter phone" value={formData.phone} />                      
            </div>
            <div className="form-outline mb-4">
              <input onChange={handleChange} type="email" id="email" name="email" className="form-control" placeholder="enter email" value={formData.email} />                      
            </div>
            <div className="form-outline mb-4">
              <input onChange={handleChange} type="text" id="postal" name="postal" className="form-control" placeholder="enter postal code" value={formData.postal} />                      
            </div>
            <div className="form-outline mb-4">
              <input onChange={handleChange} type="text" id="address" name="address" className="form-control" placeholder="enter address" value={formData.address} />                      
            </div>
            <div className="form-outline mb-4 text-danger">
              {formError}
            </div> 
            <button disabled={formSending} className="btn btn-outline-primary btn-block" type="submit" >submit</button>
          </form>
        </div>
      </div>
    </> );
}
 
export default User;