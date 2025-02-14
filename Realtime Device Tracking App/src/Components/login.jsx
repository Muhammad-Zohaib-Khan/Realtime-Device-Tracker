import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Style from "../css/login_user.module.css";

export const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const submission = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        const mdata = { email, password };

        try {
            const response = await fetch("http://localhost:5000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify(mdata)
            });

            if (!response.ok) {
                if (response.status === 401) {
                    setErrorMessage("Invalid email or password. Please try again.");
                } else if (response.status === 403) {
                    setErrorMessage("You do not have permission to access this resource.");
                } else {
                    setErrorMessage("An unexpected error occurred. Please try again later.");
                }
                return;
            }

            const data = await response.json();

            if (data.redirect) {
                navigate(data.redirect);
            } else {
                setErrorMessage("Login successful, but no redirect URL provided.");
            }

        } catch (error) {
            console.error("Error during login:", error);
            setErrorMessage("Network error. Please check your internet connection.");
        }
    };

    return (
        <>
            <div className={Style.login_container}>
                <h1>Dynamic User Profile System</h1>
                <form onSubmit={submission} className={Style.box1}>
                    <div className={Style.email_field}>
                        <label htmlFor="email">Email: </label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter Email"
                            required
                        />
                    </div>

                    <div className={Style.email_field}>
                        <label htmlFor="password">Password:</label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter Password"
                            required
                        />
                    </div>

                    {errorMessage && <p className={Style.error_message}>{errorMessage}</p>}

                    <div className={Style.button_center}>
                        <input type="submit" value="Login" className={Style.button_log} />
                    </div>
                </form>
                <div>
                    <Link to="/signup">
                        <span>Click here to </span>Signup
                    </Link>
                </div>
            </div>
        </>
    );
};

export default Login;