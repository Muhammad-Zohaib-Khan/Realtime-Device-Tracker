import { useState } from "react"
import Style from "../css/create_user.module.css"
import {Link,useNavigate} from 'react-router-dom'
export const Create_user=()=>{
    
    const [error ,setError]=useState("")
    const [name,setname]= useState("")
    const [email,setemail]=useState("")
    const [image,setimage]=useState("")

    const navigate=useNavigate()
    const logout = async (e)=>{
        e.preventDefault()
        try{
            const response= await fetch("http://localhost:5000/logout",{
                method:"GET",
                credentials:"include"
            })

            if(!response.ok){
                throw new Error(`HTTPS Error! Status ${response.status}`)
            }
            const result= await response.json()
            if (result.redirect){
                navigate(result.redirect)
            }
        }catch(error){
            setError("Something went wrong")
        }
    }

    const create_user = async (e) => {
        e.preventDefault(); 
    
        const ldata = {
            name,
            email,
            image
        };
    
        try {
            const l_response = await fetch("http://localhost:5000/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify(ldata)
            });
    
            if (!l_response.ok) {
                setError("Something went wrong");
                console.log("Error:", await l_response.text());
                return;
            }
    
            const data = await l_response.json();
    
            if (data.redirect) {
                navigate(data.redirect);
            } else {
                setError("No redirect URL provided");
            }
        } catch (error) {
            setError(error.message || "An error occurred");
            console.error("Fetch error:", error);
        }
    };

    return(
        <>
        <div className={`${Style.container}`}>
        <Link to="/read">Check Users</Link>
        <h1 className={`${Style.main_heading}`}>Create Users</h1>
        <div className="create_users">
            <form onSubmit={create_user}>
                <div className={`${Style.userbox}`}>
                    <input type="text" 
                           className="name" 
                           name="name"
                           onChange={(e)=>setname(e.target.value)} 
                    required/>
                    <label>Username: </label>
                </div>

                <div className={`${Style.userbox}`}>
                    <input type="email" 
                           className="email" 
                           name="email"
                           onChange={(e)=>setemail(e.target.value)}
                           required/>
                    <label>Email: </label>
                </div>

                <div className={`${Style.userbox}`}>
                    <input type="url" className="image" 
                       name="image"
                       onChange={(e)=>setimage(e.target.value)} 
                       required/>
                    <label>Image URL:</label>
                </div>
                    
                <input type="submit" className={`${Style.btn}`} value="Create"/>
            </form>
        </div>
        {error && <p> {error} </p>}
        <div style={{'position':'relative','left':'60%'}}>
            <button onClick={logout} className={`${Style.btn}`} >Logout</button>
        </div>
    </div>
        </>
    )
}
export default Create_user;