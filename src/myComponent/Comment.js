import React from 'react'
import './Comment.css'
import { FaTrash } from "react-icons/fa";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase-config";

const Comment = ({ commentList, setCommentList, tweetID, loggedUser }) => {

    // var today = new Date(),
    //     time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
    // var myCurrentTime = new Date().toLocaleString();
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var d = new Date(),
        // time =  d.getDay + ' ' + months[d.getMonth()] + ','+d.getFullYear +', '+ d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
        time = d.getDate() + ' ' + months[d.getMonth()] + ', ' + d.getFullYear() + ', ' + (d.getHours()%12)  + ':' + d.getMinutes() + ':' + d.getSeconds();

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

                    // <div key={comment.id}>
                    //     <div className="card-header" style={{ fontSize: "xx-small" }}>
                    //         {tweetID === comment.tweetID && <h6>@{loggedUser.userName}</h6>}
                    //     </div>
                    //     <div className="card-title">
                    //         <h3>
                    //             {tweetID === comment.tweetID && comment.comment}
                    //         </h3>
                    //     </div>
                    //     <p>{time}</p>
                    // </div>

                    // <dl className="row">
                    //     <dt className="col-sm-3">
                    //         {tweetID === comment.tweetID && <>@{loggedUser.userName}</>}
                    //     </dt>
                    //     <dd className="col-sm-9">
                    //         {tweetID === comment.tweetID && comment.comment}
                    //     </dd>
                    // </dl>
                    <>
                    {tweetID === comment.tweetID && <section>
                        <div className="container">
                            <div className="row">
                                <div className="col-sm-5 col-md-6 col-12 pb-4">
                                    <div className="comment mt-4 text-justify float-left">
                                        <img src="https://i.imgur.com/yTFUilP.jpg" alt="" className="rounded-circle" width="40" height="40" />
                                        {comment.userID === localStorage.getItem("currentUser") && <button className="btn btn-danger" style={{ width: "auto" }} onClick={() => { deleteComment(comment.id); }}>
                                            <FaTrash />
                                        </button>}



                                        <h4>{tweetID === comment.tweetID && <>@{loggedUser.userName}</>}</h4>
                                        <span>{tweetID === comment.tweetID && time}</span> <br />
                                        <p>{tweetID === comment.tweetID && comment.comment}</p>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>}
                        </>
                )
            })}

        </ul >

    )
}

export default Comment
