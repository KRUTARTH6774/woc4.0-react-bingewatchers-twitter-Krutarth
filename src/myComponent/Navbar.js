import React from 'react'
import { Link } from "react-router-dom";
import './Navbar.css'

const Navbar = ({ isAuth, signoutUser }) => {
    return (
        <>
            {localStorage.getItem("isAuth") ?
                (
                    <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
                        <Link to="/mainpage"><li className="nav-item" role="presentation" >
                            <button href="/mainpage" className="nav-link btn btn-primary" id="pills-home-tab"  >Home</button>
                        </li></Link>
                        <Link to="/profile"><li className="nav-item" role="presentation">
                            <button href="/profile" className="nav-link btn btn-primary" id="pills-profile-tab" type="button" onClick={()=>{localStorage.setItem("ClickedProfile",localStorage.getItem("currentUser"))}} >My Profile</button>
                        </li></Link>
                        <Link to="/trending"><li className="nav-item" role="presentation">
                            <button  className="nav-link btn btn-primary" id="pills-profile-tab" type="button" >Trending</button>
                        </li></Link>
                        <li className="nav-item" role="presentation">
                            <button className="nav-link btn btn-primary" id="pills-contact-tab" data-bs-toggle="pill" data-bs-target="#pills-contact" type="button" role="tab"
                            onClick={signoutUser} >Logout</button>
                        </li>
                    </ul>

                )
                :
                <ul className="nav justify-content-center">
                    <li className="nav-item">
                        <Link className="nav-link active" aria-current="page" to="/"><button>Home</button></Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/login"><button>Login</button></Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/signup"><button>Signup</button></Link>
                    </li>
                </ul>
            }
        </>
    )
}

export default Navbar
