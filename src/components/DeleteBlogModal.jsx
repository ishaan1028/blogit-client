import React, { useState } from 'react';
import { Button, Modal, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function DeleteBlogModal({ blogId, showDeleteBlogModal, setShowDeleteBlogModal }) {

    const history = useHistory();

    const [isLoading, setIsLoading] = useState(false);

    const deleteBlog = async () => {
        try {
            setIsLoading(true);
            await axios.delete(`/blogs/delete/${blogId}`, {
                headers: { "token": localStorage.getItem("token") }
            });

            setShowDeleteBlogModal(false);
            setIsLoading(false);

            history.replace("/blogs");

        }
        catch (err) {
            setIsLoading(false);
            console.error(err);
            setShowDeleteBlogModal(false);
            toast.error("Error deleting blog!");
        }
    }

    return <Modal show={showDeleteBlogModal} onHide={() => setShowDeleteBlogModal(false)}>
        <Modal.Header closeButton>
            <Modal.Title>Deleting blog?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            Are you sure you want to permanently delete this blog?
        </Modal.Body>
        <Modal.Footer>
            <Button variant="danger" onClick={deleteBlog}>
                {isLoading ? <><Spinner animation="border" size="sm" />Deleting...</> : "Delete blog"}
            </Button>
        </Modal.Footer>
    </Modal>
}
