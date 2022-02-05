import React, { useState, useEffect } from 'react'
import './LoginForm.css'
import { getDocs, collection } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase-config";
import { width } from 'dom-helpers';
export const LoginForm = ({ setIsAuth, setLoginuserid, setLoginDetails, loginDetails }) => {
    const navigate = useNavigate();
    const [userEmail, setUserEmail] = useState("");
    const [userPassword, setUserPassword] = useState("");
    const loginCollectionRef = collection(db, "users");

    var userArr = [];

    loginDetails.map((user) => (
        userArr.push({ email: user.userEmail, password: user.userPassword, id: user.id })
    ))
    const checkUser = (object, email, password) => {
        let flag = 0;
        for (let i = 0; i < object.length; i++) {
            if (object[i].email === email && object[i].password === password) {
                flag = 1;
                // setLoginuserid(object[i].id);
                localStorage.setItem("currentUser", object[i].id)
                break;
            }
            else {
                flag = 0;
            }
        }
        if (flag === 1) {
            return true;
        }
        else {
            return false;
        }
    }

    const handleLogin = (e) => {
        e.preventDefault();
        if (userEmail === "" || userPassword === "") {
            document.getElementById("empty").style.display = "block";
            document.getElementById("worning").style.display = "none";
            document.getElementById("email").style.border = "none";
            document.getElementById("password").style.border = "none";
            setIsAuth(false);
        }
        else {
            if (checkUser(userArr, userEmail, userPassword)) {
                localStorage.setItem("isAuth", true);
                setIsAuth(true);
                navigate("/mainpage");
            }
            else {
                document.getElementById("email").style.border = "6px solid red";
                document.getElementById("password").style.border = "6px solid red";
                document.getElementById("empty").style.display = "none";
                document.getElementById("worning").style.display = "block";
                // alert('Email or Password is incorrect');
                setIsAuth(false);
            }
        }
    }
    useEffect(() => {
        const getusers = async () => {
            const data = await getDocs(loginCollectionRef);
            setLoginDetails(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        }
        getusers();
        if (window.location.pathname === "/login" && localStorage.getItem("isAuth") === "true") {
            alert("login timeout")
            window.location.reload();
            localStorage.clear();
        }
    }, [])
    const handleCancle = () => {
        setUserPassword("");
        setUserEmail("");
    }
    return (
        <form className="animate" >
            <div className="container">
                <h1>Log in</h1>
                <hr />
                <label htmlFor="email"><b>Email-ID</b></label>
                <input type="text" id="email" value={userEmail} onChange={(e) => { setUserEmail(e.target.value) }} placeholder="Enter Email" name="email" required />


                <label htmlFor="psw" ><b>Password</b></label>
                <input type="password" id="password" value={userPassword} onChange={(e) => { setUserPassword(e.target.value) }} placeholder="Enter Password" name="psw" required autoComplete="on" />

                <div style={{
                    display: "flex",
                    justifyContent: "center",
                    color: "red"
                }}>
                    <h5 id="worning" style={{ display: "none" }}>Email or Password that you've entered is incorrect.</h5>
                    <h5 id="empty" style={{ display: "none" }}>Sorry, we could not find your account.</h5>
                </div>

                <div className="clearfix" style={
                    {
                        display: "flex",
                        justifyContent: "center",
                    }}>
                    <button type="button" onClick={handleCancle} style={
                        {
                            width: "40%",
                            padding: "14px 20px",
                            backgroundColor: "firebrick",
                            float: "left"
                        }}
                        className="cancelbtn1">Cancel</button>
                    <button type="submit" className="signupbtn" style={{ backgroundColor: "#007e7e" }} onClick={handleLogin}>Login</button>
                </div>

            </div>
        </form>
    )
}

export default LoginForm
