import React, { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import { db } from "../firebase-config";
import { getDocs, collection, doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import Tweet from './Tweet';
const MainPage = ({ isAuth ,loggedUser,setLoggedUser}) => {
    let navigate = useNavigate();
    // const loginCollectionRef = collection(db, "users");


    
    
    useEffect(() => {
        
        if (!isAuth) {
            navigate("/");
        }
        else {
            
            const getDetails = async () => {

                const loginCollectionRef = doc(db, "users", localStorage.getItem("currentUser"));
                const dataSnap = await getDoc(loginCollectionRef);
                const data = dataSnap.data()
                setLoggedUser({...data,id : localStorage.getItem("currentUser")});
            }
            getDetails();
        }
    }, []);
    
    return (
        <>
            <h3>Welcome to BingeWatcher!! <br/>{loggedUser.userName} </h3>
            <ul>
                <Tweet loggedUser={loggedUser} />
            </ul>
        </>
    )
}

export default MainPage
