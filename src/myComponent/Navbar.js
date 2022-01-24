import React from 'react'
import { Link } from "react-router-dom";
import './Navbar.css'

const Navbar = ({ isAuth, signoutUser }) => {
    return (
        <>
            {localStorage.getItem("isAuth") ?
                (
                    <ul className="nav justify-content-center" id="pills-tab" role="tablist">
                        <li className="nav-item" role="presentation" >
                            <Link to="/mainpage" className="nav-link active">
                                <button>Home</button>
                            </Link>
                        </li>
                        <li className="nav-item" role="presentation">
                            <Link to="/profile" className="nav-link" >
                                <button onClick={() => { localStorage.setItem("ClickedProfile", localStorage.getItem("currentUser")) }} >My Profile</button>
                            </Link>
                        </li>
                        <li className="nav-item" role="presentation">
                            <Link to="/trending" className="nav-link" >
                                <button  >Trending</button>
                            </Link>
                        </li>
                        <li className="nav-item" role="presentation">
                            <div className="nav-link">
                                <button onClick={signoutUser} >Logout</button>
                            </div>
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
