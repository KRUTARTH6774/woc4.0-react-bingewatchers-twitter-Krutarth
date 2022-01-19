import React,{useState,useEffect} from 'react'
import { MdAddComment } from "react-icons/md";
import { addDoc ,query, orderBy, getDocs,collection} from "firebase/firestore";
import { db } from "../firebase-config";
const AddComment = ({tweet,setCommentList,loggedUser}) => {
    const [comment, setComment] = useState("");

    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var d = new Date(),
    time = d.getDate() + ' ' + months[d.getMonth()] + ', ' + d.getFullYear() + ', ' + (d.getHours() % 12) + ':' + d.getMinutes() + ':' + d.getSeconds();

    const commentCollectionRef = collection(db,"comments");
    const q  = query(commentCollectionRef,orderBy("date","desc"));
    const handleComment = async (e,tweetid) =>{
        e.preventDefault();
        await addDoc(commentCollectionRef,{
            userID : localStorage.getItem("currentUser"),
            tweetID : tweetid,
            comment : comment,
            userName : loggedUser.userName,
            date : time
        });
        setComment("");
        const getComment = async () => {
            const data = await getDocs(q)
            setCommentList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
        }
        getComment();
    }
    useEffect(() => {
        const getComment = async () => {
            const data = await getDocs(q)
            setCommentList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
        }
        getComment();
    }, [])
    return (
        
        <div className="comment" style={{
            display: "flex",
            alignItems: "baseline",
            width : "90%"
        }}>
            <input type="text" 
            name={tweet.id}
            className="form-control" placeholder="Add your comment..." value={comment} onChange={(e)=> {setComment(e.target.value)}} 
            />
            <button className="btn btn-dark"  style={{ width: "auto" }}
            onClick={(e)=>{handleComment(e,tweet.id)}}><MdAddComment size="2.5em" /></button>
        </div>
    )
}

export default AddComment
