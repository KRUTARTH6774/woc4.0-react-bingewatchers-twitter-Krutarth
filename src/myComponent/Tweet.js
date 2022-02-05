import React, { useState, useEffect } from 'react'
import { addDoc, collection, getDocs, query, updateDoc, orderBy, doc, deleteDoc, where, arrayUnion, arrayRemove, getDoc } from "firebase/firestore";
import { AiOutlineComment } from "react-icons/ai";
import { BsHeart } from "react-icons/bs";
import { FcLike } from "react-icons/fc";
import { FaTrash } from "react-icons/fa";
import { BsPersonCircle } from "react-icons/bs";
import { db } from "../firebase-config";
import Comment from "./Comment";
import AddComment from './AddComment';
import { Link } from "react-router-dom";

const Tweet = ({ loggedUser }) => {

    const [tweet, setTweet] = useState("");
    const [Loading, setLoading] = useState(false);
    const tweetCollectionRef = collection(db, "tweet");
    const q = query(tweetCollectionRef, orderBy("date", "desc"));
    const [tweetList, setTweetList] = useState([]);
    const [commentList, setCommentList] = useState([])
    const [Like, setLike] = useState(0);


    var sno = 1;
    var userIdArr = [];
    tweetList.map((user) => {
        return (
            userIdArr.push(user.Id)
        )
    })
    sno = Math.max(...userIdArr) + 1;

    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var d = new Date(),
        time = d.getDate() + ' ' + months[d.getMonth()] + ', ' + d.getFullYear() + ', ' + (d.getHours() % 12) + ':' + d.getMinutes() + ':' + d.getSeconds();

    const handleTweet = async (e) => {
        e.preventDefault();
        if (tweet === "") {
            alert("write some text on it -_-")
        }
        else {
            await addDoc(tweetCollectionRef, {
                Id: sno,
                userID: localStorage.getItem("currentUser"),
                userName: loggedUser.userName,
                tweet: tweet,
                date: time
            });

            setTweet("");
            const getTweet = async () => {
                const data = await getDocs(q);
                setTweetList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
                // console.log(data.data());
                setLoading(true);
            }
            getTweet();
        }
    }

    const commentCollectionRef = collection(db, "comments");

    useEffect(() => {
        const getTweet = async () => {
            const data = await getDocs(q);
            setTweetList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
            setLoading(true);
            // console.log(tweetList);
            const likeUserCollectionRef = doc(db, "users", localStorage.getItem("currentUser"))
            const likeSnap = await getDoc(likeUserCollectionRef)
            data.docs.map((tweet) => {
                for (let i = 0; i < (likeSnap.data().Like ? likeSnap.data().Like.length : 0); i++) {
                    if (tweet.id === likeSnap.data().Like[i]) {
                        document.getElementById("like" + tweet.id).style.display = "block";
                        document.getElementById("unlike" + tweet.id).style.display = "none";
                        break;
                    }
                    else {
                        document.getElementById("like" + tweet.id).style.display = "none";
                        document.getElementById("unlike" + tweet.id).style.display = "block";
                    }
                }

            })
        }

        getTweet();
    }, []);
    const UpdateLikes = async (tweetID) => {
        const likeUserCollectionRef = doc(db, "users", localStorage.getItem("currentUser"))
        await updateDoc(likeUserCollectionRef, {
            Like: arrayUnion(tweetID)
        })
        const likeTweetCollectionRef = doc(db, "tweet", tweetID)
        await updateDoc(likeTweetCollectionRef, {
            Like: arrayUnion(localStorage.getItem("currentUser"))
        })
    }
    const Deletelike = async (tweetID) => {
        const likeUserCollectionRef = doc(db, "users", localStorage.getItem("currentUser"))
        await updateDoc(likeUserCollectionRef, {
            Like: arrayRemove(tweetID)
        })
        const likeTweetCollectionRef = doc(db, "tweet", tweetID)
        await updateDoc(likeTweetCollectionRef, {
            Like: arrayRemove(localStorage.getItem("currentUser"))
        })
    }
    const handleLike = (e, tweetID) => {
        e.preventDefault();
        document.getElementById("like" + tweetID).style.display = "block";
        document.getElementById("unlike" + tweetID).style.display = "none";
        setLike(Like + 1)
        UpdateLikes(tweetID);

    }
    const handleUnLike = (e, tweetID) => {
        e.preventDefault();
        document.getElementById("like" + tweetID).style.display = "none";
        document.getElementById("unlike" + tweetID).style.display = "block";
        setLike(Like - 1)
        Deletelike(tweetID);
    }
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
                <div className="container" style={{
                    display: "flex",
                    justifyContent: "center",
                    flexWrap: "wrap",
                    alignItems: "center",
                    textAlign: "center",
                    width: "auto"
                }}>
                    <div className="form-floating container">
                        <textarea className="form-control" value={tweet} onChange={(e) => { setTweet(e.target.value) }} placeholder="tweet... " id="floatingTextarea" style={{ height: "85px" }}></textarea>
                        <label htmlFor="floatingTextarea" style={{ marginTop: "1%", marginLeft: "1%" }}>Tweet...</label>
                        <button type="button" onClick={handleTweet} className="btn btn-primary">Tweet</button>


                    </div>
                    <div className="display" style={{ marginLeft: "-2%", width: "-webkit-fill-available" }}>
                        <ul >
                            {tweetList.map((tweet) => {
                                return (
                                    <div className="card text-center" style={{ margin: "5% 0%" }} key={tweet.id}>

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
                                            }}>
                                                {tweet.userID === loggedUser.id ?
                                                 <Link to='/profile' onClick={() => { localStorage.setItem("ClickedProfile", tweet.userID) }} style={{ textDecoration: "none" }} >{loggedUser.userName}</Link>
                                                :
                                                <Link to='/profile' onClick={() => { localStorage.setItem("ClickedProfile", tweet.userID) }} style={{ textDecoration: "none" }} >{tweet.userName}</Link>
                                                }

                                            </h5>


                                            {tweet.userID === localStorage.getItem("currentUser") &&
                                                <FaTrash size="1.5em" color="red" type="button" onClick={() => { deleteTweet(tweet.id); }} />
                                            }
                                            <br />
                                            <span style={{
                                                position: "absolute",
                                                marginLeft: "6%",
                                                marginTop: "3.5%"
                                            }}>{tweet.date}</span>
                                        </div>

                                        <div className="card-body">

                                            <p className="card-text" style={{ fontSize: "35px" }}>{tweet.tweet}</p>

                                            <div style={{
                                                display: "flex",
                                                justifyContent: "end",
                                                marginBottom: "1%"
                                            }}>
                                                <div style={{
                                                    display: "flex",
                                                    marginRight: "auto",
                                                    alignItems: "flex-end"
                                                }}>
                                                    <div className="like" id={"like" + tweet.id} style={{ display: "none" }}>
                                                        <FcLike type="button" size="2em" onClick={(e) => { handleUnLike(e, tweet.id) }} />
                                                    </div>
                                                    <div className="unlike" id={"unlike" + tweet.id}
                                                        style={{
                                                            display: "inline-block",
                                                            marginLeft: "5px"
                                                        }}>
                                                        <BsHeart size="1.6em" type="button" onClick={(e) => { handleLike(e, tweet.id) }} />
                                                    </div>
                                                    <div className="totalLikes" style={{ marginLeft: "10px" }}>
                                                        <span id={"totalLikes" + tweet.id}>{tweet.Like ? tweet.Like.length : 0}</span>
                                                    </div>
                                                </div>
                                                <AiOutlineComment size="2em" color="black" type="button" onClick={() => { myFunction(tweet.id) }} />
                                                <span>{commentList.filter(e => e.tweetID === tweet.id).length}</span>
                                            </div>
                                            <div className="collapse" id={tweet.id}>
                                                <div className="card card-body">
                                                    <AddComment tweet={tweet} setCommentList={setCommentList} loggedUser={loggedUser} />
                                                    <Comment commentList={commentList} setCommentList={setCommentList} loggedUser={loggedUser} tweetID={tweet.id} />
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                )
                            })}
                        </ul>
                    </div>



                </div> :
                <div className="spinner-border" role="status" style={{
                    display: "flex",
                    margin: "auto"
                }}>
                    <span className="visually-hidden"></span>
                </div>
            }
        </>
    )
}

export default Tweet
