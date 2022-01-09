import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './myComponent/Home';
import LoginForm from './myComponent/LoginForm';
import SignupForm from './myComponent/SignupForm';
import Navbar from './myComponent/Navbar';
import { useState } from "react";
import MainPage from './myComponent/MainPage';
import { signOut } from "firebase/auth";
import { auth } from './firebase-config';

function App() {
  const [isAuth, setIsAuth] = useState(localStorage.getItem("isAuth"));

  const [loginDetails, setLoginDetails] = useState([]);

  const signoutUser = () => {
    signOut(auth).then(() => {
      localStorage.clear();
      setIsAuth(false);
      window.location.pathname = "/";
    })
  }
  return (
    <div className="App">
      <header className="App-header">
        <Router>
          <Navbar signoutUser={signoutUser} isAuth={isAuth} />
          <Routes >
            <Route path="/" element={<Home />} />
            <Route exact path="/login"
              element={
                <LoginForm
                  setIsAuth={setIsAuth}
                  setLoginDetails={setLoginDetails}
                  loginDetails={loginDetails}
                />
              }
            />
            <Route exact path="/signup" element={<SignupForm setIsAuth={setIsAuth} />} />
            <Route exact path="/mainpage"
              element={
                <MainPage
                  isAuth={isAuth}
                  loginDetails={loginDetails}
                  setLoginDetails={setLoginDetails}
                />
              }
            />
          </Routes>
        </Router>

      </header>
    </div>
  );
}

export default App;
