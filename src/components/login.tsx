import { useState } from "react";
import Navbar from "./navbar";
import axios from "axios";
import * as yup from 'yup';

function Login(){

  const formSchema = yup.object({
    userName : yup.string().required("user name is required "),
    pass : yup.string().required("password is required ")       
  })

  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    setFormError("");
    setFormSending(true);
    e.preventDefault();
    try{
      await formSchema.validate(formData,{abortEarly:false});
      const url = "https://api.aliansari.net/login?userName=" + formData.userName + "&password=" + formData.pass;
      const res = await axios.post(url);
      if(res.data ==='token:0')
      {
        setFormError("user is not valid");
        setFormSending(false);        
      }   
      else{
        localStorage.setItem('token',res.data.replace("token:",""));
        window.location.href = '/';
      }  
    }catch(error){
      setFormSending(false);
      if (error instanceof Error) {        
        setFormError(error.message)
      } else {
          throw error;
      }      
    }       
  }

  interface loginState  {
    userName: string, 
    pass: string
  }
  const [formData, setFormData] = useState<loginState> ({
    userName:'',pass:''
  });

  const [formError, setFormError] = useState<string | null>(null);
  const [formSending, setFormSending] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setFormData(prevData => ({...prevData, [name]: value}))
  }  

  return(
    <>
      <Navbar lnk="home" />
      <div className="row justify-content-center align-items-center m-5">
        <div className="col-md-3 text-center card bg-light">
          <form className="card-body p-5 text-center" onSubmit={handleSubmit}>              
            <h3 className="mb-5">Sign in</h3>              
            <div className="form-outline mb-4">
              <label className="form-label" htmlFor="userName">user name</label>
              <input type="text" name="userName" id="userName" className="form-control" value={formData.userName} onChange={handleChange} placeholder="user name is : ali" />                      
            </div>
            <div className="form-outline mb-4">
              <label className="form-label" htmlFor="pass">Password</label>
              <input type="password" name="pass" id="pass" className="form-control" value={formData.pass} onChange={handleChange} placeholder="password is : 123456" />                      
            </div> 
            <div className="form-outline mb-4 text-danger">
              {formError}
            </div>                      
            <button disabled={formSending} className="btn btn-outline-primary btn-block" type="submit" >Login</button>
          </form>
        </div>
      </div>
    </>
  )    
}

export default Login;