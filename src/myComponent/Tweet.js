import React, { useState, useEffect } from 'react'
import { addDoc, collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase-config";
const Tweet = ({ loggedUser }) => {

    const [tweet, setTweet] = useState("");
    const tweetCollectionRef = collection(db, "tweet");
    const q = query(tweetCollectionRef, orderBy("Id", "desc"));
    const [tweetList, setTweetList] = useState([])

    var sno = 1;
    var userIdArr = [];
    tweetList.map((user) => {
        return (
            userIdArr.push(user.Id)
        )
    })
    sno = Math.max(...userIdArr) + 1;

    const handleTweet = async (e) => {
        e.preventDefault();
        await addDoc(tweetCollectionRef, {
            Id: sno,
            userID: localStorage.getItem("currentUser"),
            userName : loggedUser.userName,
            tweet: tweet
        });
        setTweet("");
        const getTweet = async () => {
            const data = await getDocs(q)
            setTweetList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
            // console.log(data.data());
        }
        getTweet();
    }
    useEffect(() => {
        const getTweet = async () => {
            const data = await getDocs(q)
            setTweetList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
        }
        getTweet();
    }, [])

    return (
        <div>
            <div className="form-floating container">
                <textarea className="form-control" value={tweet} onChange={(e) => { setTweet(e.target.value) }} placeholder="tweet... " id="floatingTextarea" style={{ height: "85px" }}></textarea>
                <label htmlFor="floatingTextarea" style={{ marginTop: "1%", marginLeft: "1%" }}>Tweet...</label>
                <button type="button" onClick={handleTweet} className="btn btn-primary">Tweet</button>
            </div>
            <div className="display">
                <ul>
                    {tweetList.map((tweet) => {
                        return (
                            <div className="container" key={tweet.id}>
                                <div className="header">
                                    <h1>{tweet.tweet}</h1>
                                </div>
                                <div className="author">
                                    <h4>@{tweet.userName}</h4>
                                    <h5>tweet id : {tweet.id}</h5>
                                </div>
                            </div>

                        )
                    })}
                </ul>
            </div>
        </div>
    )
}

export default Tweet
