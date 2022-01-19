import React, { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import { db } from "../firebase-config";
import { getDocs, collection, doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import Tweet from './Tweet';
const MainPage = ({ isAuth }) => {
    let navigate = useNavigate();
    // const loginCollectionRef = collection(db, "users");


    const [loggedUser, setLoggedUser] = useState("");
    
    useEffect(() => {
        
        if (!isAuth) {
            navigate("/");
        }
        else {
            
            const getDetails = async () => {
                // const data = await getDocs(loginCollectionRef);
                // setLoginDetails(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
                const loginCollectionRef = doc(db, "users", localStorage.getItem("currentUser"));
                const dataSnap = await getDoc(loginCollectionRef);
                const data = dataSnap.data()
                setLoggedUser(data);
            }
            getDetails();
        }
    }, []);
    
    // const citiesRef = collection(db, "cities");
    // const setDetails = async () => {
    //     await setDoc(doc(citiesRef, "SF"), {
    //         name: "San Francisco", state: "CA", country: "USA",
    //         capital: false, population: 860000,
    //         regions: ["west_coast", "norcal"]
    //     });
    //     await setDoc(doc(citiesRef, "LA"), {
    //         name: "Los Angeles", state: "CA", country: "USA",
    //         capital: false, population: 3900000,
    //         regions: ["west_coast", "socal"]
    //     });
    //     await setDoc(doc(citiesRef, "DC"), {
    //         name: "Washington, D.C.", state: null, country: "USA",
    //         capital: true, population: 680000,
    //         regions: ["east_coast"]
    //     });
    //     await setDoc(doc(citiesRef, "TOK"), {
    //         name: "Tokyo", state: null, country: "Japan",
    //         capital: true, population: 9000000,
    //         regions: ["kanto", "honshu"]
    //     });
    //     await setDoc(doc(citiesRef, "BJ"), {
    //         name: "Beijing", state: null, country: "China",
    //         capital: true, population: 21500000,
    //         regions: ["hello", "hebei"]
    //     });
    // }
    // setDetails().then(() => { setDetails1() });
    // const citiesRef1 = doc(db, "cities", "LA");
    // const str = "If your document contains an array field, you can use arrayUnion() and arrayRemove() to add and remove elements. arrayUnion()";
    // const setDetails1 = async () => {
    //     await updateDoc(citiesRef1, {
    //         "age": 69
    //     })
    //     await updateDoc(citiesRef1, {
    //         regions1: arrayUnion({ str })
    //     });
    //     // await updateDoc(citiesRef1, {
    //     //     regions1: arrayRemove({str})
    //     // });
    // }
    // setDetails1()
    // const citiesRef2 = doc(db, "cities", "LA");
    // // const citiesRef2 = doc(db, "users", localStorage.getItem("currentUser"));
    // const [city, setCity] = useState("")
    // const setDetails2 = async () => {
    //     const docSnap = await getDoc(citiesRef2);
    //     setCity(docSnap.data());
    //     console.log(city.age);
    // }
    // setDetails2();




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
