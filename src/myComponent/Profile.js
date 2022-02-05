import React, { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import { collection, getDocs, getDoc, query, orderBy, updateDoc, doc, deleteDoc, where, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "../firebase-config";
import { BsPersonCircle } from "react-icons/bs";
import { RiEditLine } from "react-icons/ri";
import { MdCancel } from "react-icons/md";
import Comment from "./Comment";
import AddComment from './AddComment';
import { AiOutlineComment } from "react-icons/ai";
import { FaTrash } from "react-icons/fa";

const Profile = ({ isAuth, loggedUser }) => {
    let navigate = useNavigate();

    const [Loading, setLoading] = useState(false);
    const [UserData, setUserData] = useState([])

    if (!isAuth) {
        navigate("/");
    }

    const [Followers, setFollowers] = useState(0)
    const [Following, setFollowing] = useState(0)

    useEffect(() => {
        if (!isAuth) {
            navigate("/");
        }
        else {
            const setUserProfile = async () => {

                const data = await getDocs(q);
                setTweetList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
                
                const userRef = doc(db, "users", localStorage.getItem("ClickedProfile"));
                const docSnap = await getDoc(userRef);
                setUserData({ ...docSnap.data(), id: localStorage.getItem("ClickedProfile") });
                setLoading(true);

                setFollowers(docSnap.data().Followers ? docSnap.data().Followers.length : 0);
                setFollowing(docSnap.data().Following ? docSnap.data().Following.length : 0);

                if (localStorage.getItem("currentUser") !== localStorage.getItem("ClickedProfile")) {

                    for (let i = 0; i < (docSnap.data().Followers ? docSnap.data().Followers.length : 0); i++) {

                        if (localStorage.getItem("currentUser") === docSnap.data().Followers[i]) {
                            let Follow = document.getElementById("Follow");
                            Follow.style.display = "none";
                            let unFollow = document.getElementById("UnFollow")
                            unFollow.style.display = "block";
                            break;
                        }
                        else {
                            let Follow = document.getElementById("Follow");
                            Follow.style.display = "block";
                            let unFollow = document.getElementById("UnFollow")
                            unFollow.style.display = "none";
                        }
                    }
                }
            }
            setUserProfile();
        }
    }, [])
    

    if (localStorage.getItem("currentUser")) {
        var LoggedUserRef = doc(db, "users", localStorage.getItem("currentUser"));
        var userRef = doc(db, "users", localStorage.getItem("ClickedProfile"));
    }

    const UpdateFollowUser = async () => {
        await updateDoc(LoggedUserRef, {
            Following: arrayUnion(UserData.id)
        });
        await updateDoc(userRef, {
            Followers: arrayUnion(localStorage.getItem("currentUser"))
        });
    }
    const DeleteFollowUser = async () => {
        await updateDoc(LoggedUserRef, {
            Following: arrayRemove(UserData.id)
        });
        await updateDoc(userRef, {
            Followers: arrayRemove(localStorage.getItem("currentUser"))
        });
    }
    const [userName, setUserName] = useState("");
    const ToggleToInputUpdateUserName = async () => {
        document.getElementById("username").style.display = "none";
        document.getElementById("editname").style.display = "inline-flex";

    }
    const changeUserName = async (e) => {
        e.preventDefault();
        const userCollectionRef = doc(db, "users", localStorage.getItem("currentUser"))
        await updateDoc(userCollectionRef, {
            userName: userName
        })
        document.getElementById("nameText").innerHTML = userName;
        tweetList.filter((e)=>{
            e.userName = userName
        })

        document.getElementById("username").style.display = "flex";
        document.getElementById("editname").style.display = "none";

    }

    const handleFollowers = (e) => {
        e.preventDefault();
        localStorage.setItem("Follow", "true")
        let Follow = document.getElementById("Follow");
        let unFollow = document.getElementById("UnFollow")
        Follow.style.display = "none";
        unFollow.style.display = "block";

        setFollowers(Followers + 1);
        UpdateFollowUser();
    }

    const handleUnFollow = (e) => {
        e.preventDefault();
        localStorage.setItem("Follow", "false")
        let Follow = document.getElementById("Follow");
        let unFollow = document.getElementById("UnFollow")
        Follow.style.display = "block";
        unFollow.style.display = "none";
        setFollowers(Followers - 1);
        DeleteFollowUser();
    }
    const tweetCollectionRef = collection(db, "tweet");
    let q = query(tweetCollectionRef, where("userID", "==", localStorage.getItem("ClickedProfile")));
    const [tweetList, setTweetList] = useState([]);
    const [commentList, setCommentList] = useState([])
    //time

    const commentCollectionRef = collection(db, "comments");
    const deleteTweet = async (tweetID) => {
        const tweetDoc = doc(db, "tweet", tweetID)
        await deleteDoc(tweetDoc);
        const q2 = query(commentCollectionRef, where("tweetID", "==", tweetID))

        const querySnapshot = await getDocs(q2);
        querySnapshot.forEach((doc1) => {

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
                                                    <div id="username" style={{
                                                        display: "flex",
                                                        justifyContent: "center",
                                                        alignItems: "baseline"
                                                    }}>
                                                        <h3 className="m-b-0" id="nameText">{UserData.userName}</h3>

                                                        <RiEditLine size="1.2em" type="button" onClick={() => { ToggleToInputUpdateUserName() }} />
                                                    </div>
                                                    <div id="editname" style={{
                                                        display: "none",
                                                        justifyContent: "center",
                                                        alignItems: "baseline",
                                                        width: "60%"
                                                    }}>
                                                        {/* <div class="input-group"> */}
                                                        <input type="text" className="form-control" placeholder="Enter Username" name="username" aria-label="Recipient's username with two button addons" value={userName} onChange={(e) => { setUserName(e.target.value) }}
                                                            style={{
                                                                width: "330%",
                                                                display: "block",
                                                                padding: "0.375rem 0.75rem",
                                                                color: "#212529",
                                                                backgroundColor: "#fff",
                                                                backgroundClip: "padding-box",
                                                                border: "1px solid #ced4da",
                                                                borderRadius: "0.25rem",
                                                                transition: "border-color .15s ease-in-out,box-shadow .15s ease-in-out",
                                                                background:"white"
                                                            }} />
                                                        <button className="btn btn-outline-secondary" type="button" onClick={(e)=>changeUserName(e)}>edit</button>
                                                        <button className="btn btn-outline-secondary" onClick={() => { document.getElementById("username").style.display = "flex"; document.getElementById("editname").style.display = "none"; setUserName("") }} type="button">cancel</button>
                                                    </div>
                                                    <div className="row text-center m-t-20">
                                                        <div className="col-lg-4 col-md-4 m-t-20">
                                                            <h3 className="m-b-0 font-light">{tweetList.length}</h3><small>Tweets</small>
                                                        </div>
                                                        <div className="col-lg-4 col-md-4 m-t-20">
                                                            <h3 className="m-b-0 font-light">{Followers}</h3><small>Followers</small>
                                                        </div>
                                                        <div className="col-lg-4 col-md-4 m-t-20">
                                                            <h3 className="m-b-0 font-light">{Following}</h3><small>Following</small>
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
                                        justifyContent: "center",
                                        flexWrap: "wrap"
                                    }}>
                                        {tweetList.map((tweet) => {
                                            return (
                                                <div className="card text-center" style={{ margin: "5% 0%", width: "60%", marginBottom: "-2%" }} key={tweet.id}>
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
                                                        }}>{UserData.userName}
                                                        </h5>
                                                        <FaTrash size="1.5em" color="red" type="button" onClick={() => { deleteTweet(tweet.id); }} />
                                                        <br />
                                                        <span style={{
                                                            position: "absolute",
                                                            marginLeft: "7%",
                                                            marginTop: "3.5%"
                                                        }}>{tweet.date}</span>
                                                    </div>
                                                    <div className="card-body">
                                                        <p className="card-text">{tweet.tweet}</p>
                                                        <div style={{
                                                            display: "flex",
                                                            justifyContent: "end",
                                                            marginBottom: "1%"
                                                        }}>
                                                            <AiOutlineComment size="2em" color="black" type="button" onClick={() => { myFunction(tweet.id) }} />

                                                        </div>
                                                        <div className="collapse" id={tweet.id}>
                                                            <div className="card card-body">
                                                                <AddComment tweet={tweet} setCommentList={setCommentList} loggedUser={loggedUser} />
                                                                <Comment commentList={commentList} setCommentList={setCommentList} tweetID={tweet.id} loggedUser={loggedUser}/>
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
                                                    {/* <p>Web Designer &amp; Developer</p> */}
                                                    <button className="m-t-10 waves-effect waves-dark btn btn-primary btn-md btn-rounded" id="Follow" onClick={(e) => { handleFollowers(e) }} >Follow</button>
                                                    <button className="m-t-10 waves-effect waves-dark btn btn-primary btn-md btn-rounded" style={{ display: "none", backgroundColor: "red" }} id="UnFollow" onClick={(e) => { handleUnFollow(e) }} >Unfollow</button>
                                                    <div className="row text-center m-t-20">
                                                        <div className="col-lg-4 col-md-4 m-t-20">
                                                            <h3 className="m-b-0 font-light">{tweetList.length}</h3><small>Tweets</small>
                                                        </div>
                                                        <div className="col-lg-4 col-md-4 m-t-20">
                                                            <h3 className="m-b-0 font-light" id="FsV">{Followers}</h3><small>Followers</small>
                                                        </div>
                                                        <div className="col-lg-4 col-md-4 m-t-20">
                                                            <h3 className="m-b-0 font-light">{Following}</h3><small>Following</small>
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
                                        justifyContent: "center",
                                        flexWrap: "wrap"
                                    }}>
                                        {tweetList.map((tweet) => {
                                            return (
                                                <div className="card text-center" style={{ margin: "5% 0%", width: "60%", marginBottom: "-2%" }} key={tweet.id}>
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
                                                        <br />
                                                        <span style={{
                                                            position: "absolute",
                                                            marginLeft: "7%",
                                                            marginTop: "3.5%"
                                                        }}>{tweet.date}</span>
                                                    </div>
                                                    <div className="card-body">
                                                        <p className="card-text">{tweet.tweet}</p>
                                                        <div style={{
                                                            display: "flex",
                                                            justifyContent: "end",
                                                            marginBottom: "1%"
                                                        }}>
                                                            <AiOutlineComment size="2em" color="black" type="button" onClick={() => { myFunction(tweet.id) }} />

                                                        </div>
                                                        <div className="collapse" id={tweet.id}>
                                                            <div className="card card-body">
                                                                <AddComment tweet={tweet} setCommentList={setCommentList} loggedUser={loggedUser} />
                                                                <Comment commentList={commentList} setCommentList={setCommentList} tweetID={tweet.id} loggedUser={loggedUser}/>
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
