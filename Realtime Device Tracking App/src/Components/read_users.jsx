import Style from '../css/read_users.module.css'
import { useState, useEffect } from "react"
import {Link} from "react-router-dom"

export const Read_users=()=>{
    const [data,setdata]=useState([])
    const [error,seterror]=useState(null)
    useEffect(()=>{
        const fetchdata=async ()=>{
            try{
                const response= await fetch("http://localhost:5000/read")
                if(!response.ok){
                    throw new Error(`HTTPS Error! Status ${response.status}`)
                }
                const result= await response.json()
                setdata(result.data)
            }catch(error){
                seterror(error.message)
            }
        };
        fetchdata()
    },[])
 return (
    <>
    <div className={`${Style.set_button}`}>
        <div className={`${Style.create_user}`}>
            <Link to="/create"> <button className={`${Style.design}`}>Create Users</button></Link>
        </div>
        <div className={`${Style.tracker}`}>
            <Link to="/real_time"><button className={`${Style.design}`}>Track Users</button></Link>
        </div>
    </div>
    <h1 style={{'marginTop':'2%','marginLeft':'2%'}}><u>Profiles</u></h1>
    <div className={`${Style.profiles}`}>
        {data.length>0?<>
            {data.map((item, i)=>(
            <div className={`${Style.profile}`} key={i}>
                <div>
                    <img src={item.image} alt="imgage ${key}" className={`${Style.image}`}></img>
                </div>
                <h1>{item.name}</h1>
                <h5>{item.email}</h5>

                <div className={`${Style.flex}`}>
                    <Link to={`/delete/${item._id}`}>Delete</Link>
                    <Link to={`/edit/${item._id}`}>Update Users </Link>
                </div>
            </div>
        ))}</>:
        <><p style={{'textAlign':'center','width':'100vw'}}>No User Avaliable Create User</p>
        </>}
    </div>
    </>
 )   
}

export default Read_users