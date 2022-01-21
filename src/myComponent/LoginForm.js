import React, { useState,useEffect } from 'react'
import './LoginForm.css'
import { getDocs,collection } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase-config";
export const LoginForm = ({setIsAuth,setLoginuserid,setLoginDetails,loginDetails}) => {
    const navigate = useNavigate();
    const [userEmail, setUserEmail] = useState("");
    const [userPassword, setUserPassword] = useState("");
    const loginCollectionRef = collection(db, "users");
    
    var userArr = [];

    loginDetails.map((user) => (
        userArr.push({email:user.userEmail,password:user.userPassword,id:user.id})
    ))
    const checkUser = (object, email,password) => {
        let flag = 0;
        for (let i = 0; i < object.length; i++) {
            if (object[i].email === email && object[i].password === password) {
                flag = 1;
                // setLoginuserid(object[i].id);
                localStorage.setItem("currentUser",object[i].id)
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

    const handleLogin = ()=>{
        if(checkUser(userArr,userEmail,userPassword)){
            localStorage.setItem("isAuth", true);
            setIsAuth(true);
            navigate("/mainpage");
        }
        else{
            alert('Email or Password is incorrect');
            setIsAuth(false);
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
    const handleCancle = () =>{
        setUserPassword("");
        setUserEmail("");
    }
    return (
        <form className="modal-content animate" >
            <div className="container">
                <label htmlFor="uname" style={{ color: "black" }}><b>Email-ID</b></label>
                <input type="text" value={userEmail} onChange={(e)=>{setUserEmail(e.target.value)}} placeholder="Enter Email-ID" name="uname" required />

                <label htmlFor="psw" style={{ color: "black" }}><b>Password</b></label>
                <input type="password" value={userPassword} onChange={(e)=>{setUserPassword(e.target.value)}} placeholder="Enter Password" name="psw" required autoComplete="on" />

                <button type="submit" onClick={handleLogin}>Login</button>

            </div>

            <div className="container" style={
                {
                    backgroundColor: "#f1f1f1",
                    display: "flex",
                    justifyContent: "space-between",
                }}>
                <button type="button" className="cancelbtn" onClick={handleCancle}>Cancel</button>
                <span className="psw" style={{ color: "black" }}>Forgot <a href="/#">password?</a></span>
            </div>
        </form>
    )
}

export default LoginForm
