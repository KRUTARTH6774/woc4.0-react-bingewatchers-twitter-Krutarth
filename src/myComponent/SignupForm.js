import React, { useState, useEffect } from 'react'
import './SignupForm.css'
import { FcGoogle } from "react-icons/fc";
import { auth, provider, db } from "../firebase-config";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { addDoc, collection, getDocs } from "firebase/firestore";


const SignupForm = ({ setIsAuth }) => {
    const [userPasswordWithGoogle, setUserPasswordWithGoogle] = useState("")
    const [userName, setUserName] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [userPhoneNumber, setUserPhoneNumber] = useState("");
    const [userPassword, setUserPassword] = useState("");

    let navigate = useNavigate();
    const [user, setUser] = useState([]);
    var sno = 1;
    var userIdArr = [];
    var userEmailArr = [];
    user.map((user) => {
        return (
            userIdArr.push(user.Id),
            userEmailArr.push(user.userEmail)
        )
    })
    sno = Math.max(...userIdArr) + 1;
    const checkUser = (object, value) => {
        let flag = 0;
        for (let i = 0; i < object.length; i++) {
            if (object[i] === value) {
                flag = 1
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
    const signupWithGoogle = async () => {
        signInWithPopup(auth, provider).then((result) => {
            if (checkUser(userEmailArr, result.user.email)) {
                alert("user allready exist with this Email ID,Try to login")
                setIsAuth(false);
            }
            else {
                addDoc(signupCollectionRef, {
                    Id: sno,
                    userName: result.user.displayName,
                    userEmail: result.user.email,
                    userPhoneNumber: result.user.phoneNumber,
                    userPassword: userPasswordWithGoogle,
                });
                // localStorage.setItem("isAuth", true);
                // setIsAuth(true);
                navigate("/login");
            }
        })
    }

    const signup = async (e) => {
        e.preventDefault();
        if (checkUser(userEmailArr, userEmail)) {
            alert("user allready exist with this Email ID,Try to login")
            setIsAuth(false);
        }
        else {
            await addDoc(signupCollectionRef, { Id: sno, userName, userEmail, userPhoneNumber, userPassword });
            // localStorage.setItem("isAuth", true);
            // setIsAuth(true);
            navigate("/login");
        }
    }

    useEffect(() => {
        const getusers = async () => {
            const data = await getDocs(signupCollectionRef);
            setUser(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
        }
        getusers();
        if (window.location.pathname === "/signup" && localStorage.getItem("isAuth") === "true") {
            window.location.reload();
            localStorage.clear();
        }
    }, [])


    const signupCollectionRef = collection(db, "users");

    function myFunction() {
        var x = document.getElementById("MyDiv");
        if (x.style.display === "none") {
            x.style.display = "block";
        } else {
            x.style.display = "none";
        }
    }

    return (
        <>
            <form className="animate " >
                <div className="container">
                    <h1>Sign Up</h1>
                    <p>Please fill in this form to create an account.</p>
                    <hr />
                    <label htmlFor="username"><b>Username</b></label>
                    <input type="text" value={userName} onChange={(e) => { setUserName(e.target.value) }} placeholder="Enter Username" name="username" required />

                    <label htmlFor="email"><b>Email</b></label>
                    <input type="text" value={userEmail} onChange={(e) => { setUserEmail(e.target.value) }} placeholder="Enter Email" name="email" required />

                    <label htmlFor="phone-number"><b>Phone Number</b></label>
                    <input type="text" value={userPhoneNumber} onChange={(e) => { setUserPhoneNumber(e.target.value) }} placeholder="Phone" name="phone-number" required />

                    <label htmlFor="psw"><b>Create Password</b></label>
                    <input type="password" value={userPassword} onChange={(e) => { setUserPassword(e.target.value) }} placeholder="Enter Password" name="psw" required autoComplete="on" />

                    <div className="clearfix" style={
                        {
                            display: "flex",
                            justifyContent: "center",
                        }}>
                        <button type="button" style={
                            {
                                width: "40%",
                                padding: "14px 20px",
                                backgroundColor: "#f44336",
                                float: "left"
                            }}
                            className="cancelbtn1">Cancel</button>
                        <button type="submit" className="signupbtn" onClick={signup}>Sign Up</button>
                    </div>

                </div>
            </form>
            <hr />

            <div className="container">
                <button onClick={myFunction}><FcGoogle size="2em" /> SignUp With Google</button>
                <form>
                    <div id="MyDiv" style={{ display: "none" }}>
                        <label htmlFor="psw"><b>Create Password</b></label>
                        <input id="passwordEithGoogle" type="password" value={userPasswordWithGoogle} onChange={(e) => { setUserPasswordWithGoogle(e.target.value) }} placeholder="Enter Password" autoComplete="on" />
                        <button id="button" type="button" onClick={signupWithGoogle}>Continue</button>
                    </div>
                </form>
            </div>

        </>
    )
}
export default SignupForm
