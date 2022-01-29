import React from 'react'
import './Comment.css'
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { FaTrash } from "react-icons/fa";
import { BsPersonCircle } from "react-icons/bs";
import { db } from "../firebase-config";
import { Link } from "react-router-dom";

const Comment = ({ commentList, setCommentList, tweetID }) => {

    const commentCollectionRef = collection(db, "comments");
    const deleteComment = async (commentID) => {

        const commentDoc = doc(db, "comments", commentID)
        await deleteDoc(commentDoc);

        const getComment = async () => {
            const data = await getDocs(commentCollectionRef)
            setCommentList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
        }
        getComment();
    }


    return (

        <ul>
            {commentList.map((comment) => {
                return (
                    <div key={comment.id}>
                        {tweetID === comment.tweetID && <section>
                            <div className="container" >
                                <div className="be-comment-block">
                                    <div className="be-comment" style={{ marginBottom: "-13%" }}>
                                        <div className="be-img-comment">
                                            <BsPersonCircle size="4em" />
                                        </div>
                                        <div className="be-comment-content" style={{ marginBottom: "6%" }}>

                                            <span className="be-comment-name" style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "baseline"
                                            }}>
                                                <h5 style={{ fontWeight: "bold" }}><Link to='/profile' onClick={() => { localStorage.setItem("ClickedProfile", comment.userID) }} style={{ textDecoration: "none" }} >{comment.userName}</Link></h5>

                                                
                                                {comment.userID === localStorage.getItem("currentUser") ?
                                                    <div style={{ width: "auto",marginRight: "-104%" }}>
                                                        <FaTrash size="1.5em" color="red" type="button" onClick={() => { deleteComment(comment.id); }} />
                                                    </div>
                                                    : <div> </div>}
                                            </span>

                                            <span className="be-comment-time" style={{
                                                width: "auto",
                                                marginLeft: "-86%"
                                            }}>
                                                <i className="fa fa-clock-o">
                                                    {comment.date}</i>
                                            </span>

                                            <p className="be-comment-text">
                                                {comment.comment}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>}
                    </div>
                )
            })}

        </ul >

    )
}

export default Comment
