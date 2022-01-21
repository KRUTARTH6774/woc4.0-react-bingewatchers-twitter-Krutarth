import React, { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import { collection, getDocs, getDoc, query, orderBy, doc, deleteDoc, where } from "firebase/firestore";
import { db } from "../firebase-config";
import { BsPersonCircle } from "react-icons/bs";
import Comment from "./Comment";
import AddComment from './AddComment';
import { AiOutlineComment } from "react-icons/ai";
import { FaTrash } from "react-icons/fa";
//loggedUser
const Profile = ({ isAuth, loggedUser }) => {
    let navigate = useNavigate();
    const [Loading, setLoading] = useState(false);
    const [UserData, setUserData] = useState([])
    if (!isAuth) {
        navigate("/");
    }
    else {
        //Clicked User Data

        const userRef = doc(db, "users", localStorage.getItem("ClickedProfile"));
        const setUserProfile = async () => {
            const docSnap = await getDoc(userRef);
            setUserData({ ...docSnap.data(), id: localStorage.getItem("ClickedProfile") });
            setLoading(true);
        }
        setUserProfile();
    }

    //Clicked user Tweets
    const tweetCollectionRef = collection(db, "tweet");
    const q = query(tweetCollectionRef, where("userID", "==", localStorage.getItem("ClickedProfile")));
    const [tweetList, setTweetList] = useState([]);
    const [commentList, setCommentList] = useState([])

    useEffect(() => {
        const getTweet = async () => {
            const data = await getDocs(q);
            setTweetList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
            setLoading(true);
        }
        getTweet();
    }, []);
    //time

    const commentCollectionRef = collection(db, "comments");
    const deleteTweet = async (tweetID) => {
        const tweetDoc = doc(db, "tweet", tweetID)
        await deleteDoc(tweetDoc);
        // const commentDoc = doc(db, "comments", tweetID)
        // await deleteDoc(commentDoc);
        const q2 = query(commentCollectionRef, where("tweetID", "==", tweetID))
        // await deleteDoc(q2)
        const querySnapshot = await getDocs(q2);
        querySnapshot.forEach((doc1) => {
            // doc.data() is never undefined for query doc snapshots
            // console.log(doc.id, " => ", doc.data());
            const commentDoc = doc(db, "comments", doc1.id)
            deleteDoc(commentDoc);
        });

        const getTweet = async () => {
            const data = await getDocs(q);
            setTweetList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
            setLoading(true);
        }
        getTweet();
    }
    function myFunction(id) {
        var x = document.getElementById(id);
        if (x.style.display === "none") {
            x.style.display = "block";
        } else {
            x.style.display = "none";
        }
    }
    return (
        <>
            {Loading ?
                <div>
                    {
                        UserData.id === localStorage.getItem("currentUser") ?
                            <>
                                <div className="currentUser">
                                    {/* You're in CurrentUser! */}
                                    <div className="padding" style={{
                                        display: "flex",
                                        justifyContent: "center"
                                    }}>
                                        <div className="col-md-8">
                                            <div className="card">
                                                {/* <img className="card-img-top" src="https://i.imgur.com/K7A78We.jpg" alt="Card image cap" /> */}
                                                <div className="card-body little-profile text-center">
                                                    <div className="pro-img">
                                                        <BsPersonCircle size="6em" />
                                                    </div>
                                                    <h3 className="m-b-0">{UserData.userName}</h3>
                                                    <p>Web Designer &amp; Developer</p>
                                                    <button className="m-t-10 waves-effect waves-dark btn btn-primary btn-md btn-rounded" >Follow</button>
                                                    <div className="row text-center m-t-20">
                                                        <div className="col-lg-4 col-md-4 m-t-20">
                                                            <h3 className="m-b-0 font-light">10434</h3><small>Articles</small>
                                                        </div>
                                                        <div className="col-lg-4 col-md-4 m-t-20">
                                                            <h3 className="m-b-0 font-light">434K</h3><small>Followers</small>
                                                        </div>
                                                        <div className="col-lg-4 col-md-4 m-t-20">
                                                            <h3 className="m-b-0 font-light">5454</h3><small>Following</small>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="display" style={{ marginLeft: "-2%", width: "-webkit-fill-available" }}>
                                    <ul style={{
                                        display: "flex",
                                        justifyContent: "center"
                                    }}>
                                        {tweetList.map((tweet) => {
                                            return (
                                                <div className="card text-center" style={{ margin: "5% 0%", width: "60%" }} key={tweet.id}>
                                                    <div className="card-header" style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "space-between"
                                                    }}>
                                                        <BsPersonCircle size="4em" />
                                                        <h5 style={{
                                                            fontWeight: "bold",
                                                            marginLeft: "1%",
                                                            marginRight: "auto"
                                                        }}>{tweet.userName}</h5>
                                                        <button className="btn btn-danger" style={{ width: "auto" }} onClick={() => { deleteTweet(tweet.id); }}>
                                                            <FaTrash />
                                                        </button>
                                                        <br />
                                                        <span style={{
                                                            position: "absolute",
                                                            marginLeft: "8.2%",
                                                            marginTop: "3.5%"
                                                        }}>{tweet.date}</span>
                                                    </div>
                                                    <div className="card-body">
                                                        <h5 className="card-title">tweet id : {tweet.id}</h5>
                                                        <p className="card-text">{tweet.tweet}</p>
                                                        <div style={{
                                                            display: "flex",
                                                            alignItems: "baseline",
                                                            justifyContent: "space-between"
                                                        }}>
                                                            <AddComment tweet={tweet} setCommentList={setCommentList} loggedUser={loggedUser} />
                                                            <button className="btn btn-primary btn-border-width" type="button" onClick={() => { myFunction(tweet.id) }} style={{ width: "auto" }}>
                                                                <AiOutlineComment size="2em" />
                                                            </button>
                                                        </div>
                                                        <div className="collapse" id={tweet.id}>
                                                            <div className="card card-body">
                                                                <Comment commentList={commentList} setCommentList={setCommentList} tweetID={tweet.id} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </ul>
                                </div>
                            </>
                            :
                            <>
                                <div className="clickedUser">
                                    {/* You're in ClickedUser! */}
                                    <div className="padding" style={{
                                        display: "flex",
                                        justifyContent: "center"
                                    }}>
                                        <div className="col-md-8">
                                            <div className="card">
                                                {/* <img className="card-img-top" src="https://i.imgur.com/K7A78We.jpg" alt="Card image cap" /> */}
                                                <div className="card-body little-profile text-center">
                                                    <div className="pro-img">
                                                        <BsPersonCircle size="6em" />
                                                    </div>
                                                    <h3 className="m-b-0">{UserData.userName}</h3>
                                                    <p>Web Designer &amp; Developer</p>
                                                    <button className="m-t-10 waves-effect waves-dark btn btn-primary btn-md btn-rounded" >Follow</button>
                                                    <div className="row text-center m-t-20">
                                                        <div className="col-lg-4 col-md-4 m-t-20">
                                                            <h3 className="m-b-0 font-light">10434</h3><small>Articles</small>
                                                        </div>
                                                        <div className="col-lg-4 col-md-4 m-t-20">
                                                            <h3 className="m-b-0 font-light">434K</h3><small>Followers</small>
                                                        </div>
                                                        <div className="col-lg-4 col-md-4 m-t-20">
                                                            <h3 className="m-b-0 font-light">5454</h3><small>Following</small>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="display" style={{ marginLeft: "-2%", width: "-webkit-fill-available" }}>
                                    <ul style={{
                                        display: "flex",
                                        justifyContent: "center"
                                    }}>
                                        {tweetList.map((tweet) => {
                                            return (
                                                <div className="card text-center" style={{ margin: "5% 0%", width: "60%" }} key={tweet.id}>
                                                    <div className="card-header" style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "space-between"
                                                    }}>
                                                        <BsPersonCircle size="4em" />
                                                        <h5 style={{
                                                            fontWeight: "bold",
                                                            marginLeft: "1%",
                                                            marginRight: "auto"
                                                        }}>{tweet.userName}</h5>
                                                        <button className="btn btn-danger" style={{ width: "auto" }} onClick={() => { deleteTweet(tweet.id); }}>
                                                            <FaTrash />
                                                        </button>
                                                        <br />
                                                        <span style={{
                                                            position: "absolute",
                                                            marginLeft: "8.2%",
                                                            marginTop: "3.5%"
                                                        }}>{tweet.date}</span>
                                                    </div>
                                                    <div className="card-body">
                                                        <h5 className="card-title">tweet id : {tweet.id}</h5>
                                                        <p className="card-text">{tweet.tweet}</p>
                                                        <div style={{
                                                            display: "flex",
                                                            alignItems: "baseline",
                                                            justifyContent: "space-between"
                                                        }}>
                                                            <AddComment tweet={tweet} setCommentList={setCommentList} loggedUser={loggedUser} />
                                                            <button className="btn btn-primary btn-border-width" type="button" onClick={() => { myFunction(tweet.id) }} style={{ width: "auto" }}>
                                                                <AiOutlineComment size="2em" />
                                                            </button>
                                                        </div>
                                                        <div className="collapse" id={tweet.id}>
                                                            <div className="card card-body">
                                                                <Comment commentList={commentList} setCommentList={setCommentList} tweetID={tweet.id} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </ul>
                                </div>
                            </>
                    }
                    {/* Your Profile!! {UserData.userName} */}
                </div> :
                <div className="spinner-border" role="status" style={{
                    display: "flex",
                    margin: "auto"
                }}>
                    <span className="visually-hidden">Loading...</span>
                </div>
            }
        </>
    )
}

export default Profile
