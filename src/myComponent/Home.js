import React,{useEffect} from 'react'
import { useNavigate } from "react-router-dom";


const Home = ({ isAuth }) => {
    let navigate = useNavigate();
    useEffect(() => {
        if(isAuth){
            navigate("/mainpage")
        }
    }, [])

    return (
        <>
            {!isAuth && <div>
                <h3>Welcome To BingeWatcher </h3>
                <p style={{ color: "blue" }}>if you're new user then try to sign up</p>
            </div>}

        </>
    )
}
export default Home