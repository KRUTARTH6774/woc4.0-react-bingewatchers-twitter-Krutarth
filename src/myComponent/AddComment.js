import React,{useState,useEffect} from 'react'
import { MdAddComment } from "react-icons/md";
import { addDoc , getDocs,collection} from "firebase/firestore";
import { db } from "../firebase-config";
const AddComment = ({tweet,setCommentList}) => {
    const [comment, setComment] = useState("");
    
    const commentCollectionRef = collection(db,"comments");
    const handleComment = async (e,tweetid) =>{
        e.preventDefault();
        await addDoc(commentCollectionRef,{
            userID : localStorage.getItem("currentUser"),
            tweetID : tweetid,
            comment : comment
        });
        setComment("");
        const getComment = async () => {
            const data = await getDocs(commentCollectionRef)
            setCommentList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
        }
        getComment();
    }
    useEffect(() => {
        const getComment = async () => {
            const data = await getDocs(commentCollectionRef)
            setCommentList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
        }
        getComment();
    }, [setCommentList])
    return (
        
        <div className="comment" style={{
            display: "flex",
            alignItems: "baseline"
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
