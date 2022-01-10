import axios from 'axios';
import React, { useState } from 'react';
import { Button, Modal, Spinner } from 'react-bootstrap';
import { AiFillDelete } from "react-icons/ai";
import { toast } from 'react-toastify';

export default function Comment({ comment, comments, setComments }) {

    const [isDeleting, setIsDeleting] = useState(false);

    const user = JSON.parse(localStorage.getItem("user"));

    const [showDeleteComment, setShowDeleteComment] = useState(false);

    const handleDeleteCommentShow = () => setShowDeleteComment(true);

    const handleDeleteCommentClose = () => setShowDeleteComment(false);

    const deleteComment = async () => {
        try {
            setIsDeleting(true);

            await axios.delete(`/comments/delete/${comment._id}`, {
                headers: {
                    "token": localStorage.getItem("token")
                }
            });
            handleDeleteCommentClose();
            setIsDeleting(false);
            setComments(comments.filter(c => c._id !== comment._id));
        }
        catch (err) {
            handleDeleteCommentClose();
            console.error(err);
            toast.error("Error deleting comment");
            setIsDeleting(false);
        }
    }

    return <>
        <div className="commentBody">
            <p className="commentTitlePara">
                <span className="uiBold commentUsername">
                    {comment?.commentBy?.userName}
                </span>
                {
                    comment?.commentBy?._id === user?._id &&
                    <span className="deleteAction" onClick={handleDeleteCommentShow}>
                        <AiFillDelete />
                    </span>
                }
            </p>
            <p className="commentBodyText">
                {comment?.comment}
            </p>
            <p className="commentBodyTimePara">
                {(new Date(comment?.createdAt)).toString().split("").slice(0, -30).join("")}
            </p>
        </div>
        <Modal show={showDeleteComment} onHide={handleDeleteCommentClose}>
            <Modal.Header closeButton>
                <Modal.Title>Deleting comment?</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Are you sure you want to permanently delete this comment?
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={deleteComment}>
                    {isDeleting ? <Spinner animation="border" size="sm" /> : "Delete"}
                </Button>
            </Modal.Footer>
        </Modal>

    </>
}
