import React, { useState, useEffect } from 'react'
import { addDoc, collection, getDocs, query, orderBy, doc, deleteDoc, where } from "firebase/firestore";
import { AiOutlineComment } from "react-icons/ai";
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
        }
        getTweet();
    }, []);
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
                                            }}><Link to='/profile' onClick={() => { localStorage.setItem("ClickedProfile", tweet.userID) }} style={{ textDecoration: "none" }} >{tweet.userName}</Link></h5>


                                            {tweet.userID === localStorage.getItem("currentUser") &&
                                                <FaTrash size="1.5em" color="red" type="button" onClick={() => { deleteTweet(tweet.id); }} />
                                            }
                                            {/* {tweet.userID === localStorage.getItem("currentUser") && <button className="btn btn-danger" style={{ width: "auto", background: "black" }} onClick={() => { deleteTweet(tweet.id); }}>
                                                <FaTrash />
                                            </button>} */}
                                            <br />
                                            <span style={{
                                                position: "absolute",
                                                marginLeft: "6%",
                                                marginTop: "3.5%"
                                            }}>{tweet.date}</span>
                                        </div>

                                        <div className="card-body">

                                            <p className="card-text" style={{fontSize:"35px"}}>{tweet.tweet}</p>



                                            <div style={{
                                                display: "flex",
                                                justifyContent: "end",
                                                marginBottom : "1%"
                                            }}>
                                                {/* <AddComment tweet={tweet} setCommentList={setCommentList} loggedUser={loggedUser} /> */}
                                                {/* <span>{tweet.date}</span> */}
                                                {/* <button className="btn btn-primary btn-border-width" type="button" onClick={() => { myFunction(tweet.id) }} style={{ width: "auto", border: "none", background: "white" }}>
                                                    <AiOutlineComment size="2em" color="black" />
                                                </button> */}
                                                <AiOutlineComment size="2em" color="black" type="button" onClick={() => { myFunction(tweet.id) }} />
                                            </div>
                                            <div className="collapse" id={tweet.id}>
                                                <div className="card card-body">
                                                    <AddComment tweet={tweet} setCommentList={setCommentList} loggedUser={loggedUser} />
                                                    <Comment commentList={commentList} setCommentList={setCommentList} tweetID={tweet.id} />
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
