import {Link} from 'react-router-dom'
import { useState } from "react";
import Style from '../css/signup_user.module.css'

export const Signup=()=>{
    const [name,setname]=useState("")
    const [email,setemail]=useState("")
    const [password,setpassword]=useState("")
    const [c_password,set_c_password]=useState("")
    const [error, seterror]=useState("")

    const submission= async (e)=>{
        e.preventDefault();
        if(!name || !email || !password || !c_password){
            seterror("Fill the complete form")
            return;
        }
        if(password!=c_password){
            seterror("password do not match")
            return;
        }
        seterror(" ")
        const f_data={
            name,email,password
        }
        try{
            const response=await fetch("http://localhost:5000/save_data",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                credentials:"include",
                body:JSON.stringify(f_data)
            })
            const data= await response.json()
            if(data.ok){
                setname("")
                setemail("")
                setpassword("")
                set_c_password("")
                alert("Sucessful Signup")
            }else{
                seterror("Sometime went wrong")
            }
        }
        catch{
            seterror("Failed to Connect")
        }
    }
    return(
        <>
        <div className={`${Style.signup_container}`}>
            <form onSubmit={submission} className={`${Style.box1}`}>
                <div className={`${Style.field}`}>
                    <label htmlFor="name">Name:</label>
                    <input type="text" name="name" id="name"
                           value={name} placeholder="Enter Your Name" 
                           onChange={(e)=>setname(e.target.value)}/>
                </div>

                <div className={`${Style.field}`}>
                    <label htmlFor="email">Email:</label>
                    <input type="email" name="email" id="email"
                           value={email} placeholder="Enter Your Email Address" 
                           onChange={(e)=>setemail(e.target.value)}/>
                </div>
                
                <div className={`${Style.field}`}>
                    <label htmlFor="password">Password:</label>
                    <input type="password" name="password" id="password"
                           value={password} placeholder="Enter Your Password" 
                           onChange={(e)=>setpassword(e.target.value)}/>
                </div>
                
                <div className={`${Style.field}`}>
                    <label htmlFor="c_password">Confirm Password:</label>
                    <input type="password" name="c_password" id="c_password"
                           value={c_password} placeholder="Confirmed Password" 
                           onChange={(e)=>set_c_password(e.target.value)}/>
                </div>

                <div className={`${Style.button_center}`}>
                    <input type="submit" value="Signup" className={`${Style.button_log}`}/>
                </div>
            </form>

            <div>
                <span>{error!="" && error}</span>
            </div>
        </div>
        <div>
            <Link to="/"><span>Click here</span> to Login</Link>
        </div>
        </>
    )
}
export default Signup;