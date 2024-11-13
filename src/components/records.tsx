import LoadingUsers from "./loading";
import { useState,useEffect } from "react";
import Navbar from "./navbar";
import axios from "axios";  
import { Await, Link } from "react-router-dom";

function Records(){       

    interface filterState  {
        id: string,fullName: string,phone: string,email: string,postal: string,address: string
    }
    const [filterData, setFilterData] = useState<filterState> ({
        id:'',fullName:'',phone:'',email:'',postal:'',address:''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFilterData(prevData => ({...prevData, [name]: value}))
    } 
    const search = (e :  React.KeyboardEvent<HTMLInputElement>) => { 
        if(e.keyCode == 13) { filterList(); } 
    } 

    const filterList = () => {        
        const newUsers = Data.dblusers?.filter(item => 
            (item.id.toString().indexOf(filterData.id) > -1) &&
            (item.fullName.toLowerCase().indexOf(filterData.fullName) > -1) && 
            (item.phone.toLowerCase().indexOf(filterData.phone) > -1) && 
            (item.email.toLowerCase().indexOf(filterData.email) > -1) && 
            (item.postal.toLowerCase().indexOf(filterData.postal) > -1) && 
            (item.address.toLowerCase().indexOf(filterData.address) > -1));
        setData({users:newUsers,dblusers:Data.dblusers}); 
    }

    interface user  {
        id : number; fullName : string;
        phone : string; email : string;
        postal : string; address : string;
    }
    interface recordState  {
        users: Array<user>,
        dblusers: Array<user>
    }
    const [Data, setData] = useState<recordState> ({
        users:[],
        dblusers:[]
    });
    
    let [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        async function getToken() {
            setIsLoading(true);
            const url = "https://api.aliansari.net/user";
            const res = await axios.get(url);
            setData({users:res.data,dblusers:res.data});
            setIsLoading(false);
            const token = localStorage.getItem('token');
            if(token)
            {
                setIsLogin(true);
            }
        }
        getToken();    
    }, []);
    
    let [isLogin, setIsLogin] = useState<boolean>(false);

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

    const deleteuser = async (e: React.MouseEvent<HTMLInputElement>) => {
        const id = e.currentTarget.id;
        e.currentTarget.disabled = true;
        setIsLoading(true);
        isUserLogin();
        const token = localStorage.getItem('token');
        const url = "https://api.aliansari.net/user/"+id+"?token=" + token;
        const res = await axios.delete(url); 
        e.currentTarget.disabled = false;        
        setData({users:res.data,dblusers:res.data});     
        setIsLoading(false);   
    }  
    
    const edituser = (e: React.MouseEvent<HTMLInputElement>) => {
        isUserLogin();
        const id = e.currentTarget.id;
        window.location.href = '/user/' + id;
    }  

    return(
        <>
            {
                isLogin ? <Navbar lnk="logout"/>:<Navbar lnk="login"/>
            }
            <div className="p-3">
                <div className="row">   
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <p> { Data.users.length } records fetched from database by API and need to be authorised for every action, except filter..</p>
                    </div> 
                    <div className="table-responsive">                    
                        <table className="table table-bordered table-striped">
                            <thead>
                                <tr>
                                    <th className="text-center col-md-1"><input className="form-control text-center" id="id" name="id" value={filterData.id} type="number" placeholder="ID" onKeyDown={search} onChange={handleChange}></input></th>
                                    <th className="text-center col-md-2"><input className="form-control text-center" id="fullName" name="fullName" value={filterData.fullName} placeholder="full name" onKeyDown={search} onChange={handleChange}></input></th>
                                    <th className="text-center col-md-3"><input className="form-control text-center" id="email" name="email" value={filterData.email} type="email" placeholder="email" onKeyDown={search} onChange={handleChange}></input></th>
                                    <th className="text-center col-md-3"><input className="form-control text-center" id="address" name="address" value={filterData.address} placeholder="address" onKeyDown={search} onChange={handleChange}></input></th>
                                    <th className="text-center col-md-1"><input className="form-control text-center" id="postal" name="postal" value={filterData.postal} placeholder="postal" onKeyDown={search} onChange={handleChange}></input></th>
                                    <th className="text-center col-md-1"><input className="form-control text-center" id="phone" name="phone" value={filterData.phone} type="number" placeholder="phone" onKeyDown={search} onChange={handleChange}></input></th>
                                    <td className="text-center col-md-1 align-middle">
                                        <input type="submit" value="filter" onClick={filterList} className="btn btn-outline-success btn-sm m-1"></input>                                        
                                        {
                                            isLogin ? <Link className="btn btn-outline-primary btn-sm m-1" to="/user">add</Link>
                                                    : <Link className="btn btn-outline-primary btn-sm m-1" to="#">add</Link>
                                        }
                                    </td>
                                </tr>
                            </thead>
                            <tbody>                                      
                                {                                    
                                    isLoading ? (<LoadingUsers/>) : 
                                    (                                
                                        Data.users.map((user,i) =>              
                                        <tr key={i}>
                                            <td className="text-center align-middle col-md-1">{user.id}</td>
                                            <td className="text-center align-middle col-md-2">{user.fullName}</td>
                                            <td className="text-center align-middle col-md-3">{user.email}</td>
                                            <td className="text-center align-middle col-md-3">{user.address}</td>                                    
                                            <td className="text-center align-middle col-md-1">{[user.postal.slice(0, 3), " ", user.postal.slice(3,6)].join('')}</td>
                                            <td className="text-center align-middle col-md-1">{[user.phone.slice(0, 3), " ", user.phone.slice(3,6), " ", user.phone.slice(6)].join('')}</td>
                                            <td className="text-center align-middle col-md-1">
                                                <input disabled={!isLogin} type="submit" value="edit" onClick={edituser} id={user.id.toString()} name={user.id.toString()} className="btn btn-outline-warning btn-sm m-1"></input>
                                                <input disabled={!isLogin} type="submit" value="del" onClick={deleteuser} id={user.id.toString()} name={user.id.toString()} className="btn btn-outline-danger btn-sm m-1"></input>
                                            </td>
                                        </tr>)
                                    )
                                }      
                            </tbody>
                        </table>  
                    </div>                               
                </div>
            </div>
        </>
    )
}
 
export default Records;