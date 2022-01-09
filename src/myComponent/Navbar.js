import React from 'react'
import {Link} from "react-router-dom";

const Navbar = ({isAuth,signoutUser}) => {
    return (
        <>
        {isAuth ? <button onClick={signoutUser}>Logout</button>:
        <ul className="nav justify-content-center">
            <li className="nav-item">
                <Link className="nav-link active" aria-current="page" to="/"><button>Home</button></Link>
            </li>
            <li className="nav-item">
                <Link className="nav-link" to="/login"><button>Ligin</button></Link>
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
