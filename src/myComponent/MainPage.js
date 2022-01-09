import React, { useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import { db } from "../firebase-config";
import { getDocs, collection } from "firebase/firestore";
const MainPage = ({ isAuth, loginDetails, setLoginDetails }) => {
    let navigate = useNavigate();
    const loginCollectionRef = collection(db, "users");
    useEffect(() => {
        if (!isAuth) {
            navigate("/signup");
        }
        else {
            const getDetails = async () => {
                const data = await getDocs(loginCollectionRef);
                setLoginDetails(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
            }
            getDetails();
        }
    }, []);


    return (
        <>
            <h3>Welcome to BingeWatcher!!</h3>

            <ul>
                {loginDetails.map((user) => {
                    return (
                        <div key={user.id}>
                            {
                                isAuth && localStorage.getItem("currentUser") === user.id &&
                                <li>Welcome {user.userName} sir!!,i hope you enjoy our website</li>
                            }
                        </div>
                    )
                })}
            </ul>
        </>
    )
}

export default MainPage
