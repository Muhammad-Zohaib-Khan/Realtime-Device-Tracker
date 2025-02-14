import Style from '../css/welcome.module.css'
import { useNavigate } from "react-router-dom";

export const Welcome_page = () => {
    const navigate = useNavigate(); 

    const Start_App = (e) => {
        e.preventDefault(); 
        navigate("/create"); 
    };

    return (
        <>
            <div className={`${Style.firstpage}`}>
                <h1 onClick={Start_App} className={`${Style.firstheading}`}>Welcome</h1>
            </div>
        </>
    );
};

export default Welcome_page;