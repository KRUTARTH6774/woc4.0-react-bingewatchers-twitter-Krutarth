import React from 'react'
import './Comment.css'
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { FaTrash } from "react-icons/fa";
import { BsPersonCircle } from "react-icons/bs";
import { db } from "../firebase-config";

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
                                {/* <div className="row">
                                    <div className="col-sm-5 col-md-6 col-12 pb-4">
                                        <div className="comment mt-4 text-justify float-left">
                                            <div style={{
                                                    position: "relative",
                                                    display: "inline-flex",
                                                    width: "200%",
                                                    justifyContent: "space-evenly",
                                                    alignItems: "center"
                                            }}>
                                                <BsPersonCircle size="4em"/>
                                                <h4 style={{
                                                    fontWeight: "bold",
                                                    marginRight: "auto",
                                                    fontFamily: "sans-serif",
                                                    marginLeft: "2%"
                                                }}> {comment.userName}</h4>
                                                {comment.userID === localStorage.getItem("currentUser") ? <button className="btn btn-danger" style={{ width: "auto" }} onClick={() => { deleteComment(comment.id); }}>
                                                    <FaTrash />
                                                </button> : <div> </div>}
                                            </div>
                                            <br />
                                                <span style={{
                                                        position: "absolute",
                                                        marginLeft: "-17%",
                                                        marginTop : "-1%",
                                                        marginRight: "auto"
                                                }}>{comment.date}</span>

                                            <p style={{
                                                    fontSize: "xx-large",
                                                    position: "absolute",
                                                    marginLeft: "5.6%",
                                                    marginTop : "1%"
                                            }}>{comment.comment}</p>

                                        </div>
                                    </div>
                                </div> */}
                                <div className="be-comment-block">
                                    <div className="be-comment" style={{    marginBottom: "-13%"}}>
                                        <div className="be-img-comment">
                                            <BsPersonCircle size="4em" />
                                        </div>
                                        <div className="be-comment-content" style={{    marginBottom:"6%"}}>

                                            <span className="be-comment-name" style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "baseline"
                                            }}>
                                                {comment.userName}
                                                {comment.userID === localStorage.getItem("currentUser") ? <button className="btn btn-danger" style={{ width: "auto",marginRight: "-104%" }} onClick={() => { deleteComment(comment.id); }}>
                                                    <FaTrash />
                                                </button> : <div> </div>}
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
