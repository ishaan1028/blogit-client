import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { Button, Container, Form, FormControl, Spinner } from 'react-bootstrap'
import { AiFillDelete } from 'react-icons/ai';
import { FaRegEdit } from 'react-icons/fa';
import { useHistory } from 'react-router-dom';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';
import { toast } from 'react-toastify';
import Comment from '../components/Comment';
import DeleteBlogModal from '../components/DeleteBlogModal';
import Loader from '../components/Loader';
import CommonContext from '../context/CommonContext';

export default function ReadBlog() {

    const [blog, setBlog] = useState({});
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState("");
    const user = JSON.parse(localStorage.getItem("user"));

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState();

    const params = useParams();
    const history = useHistory();

    const { isLoggedIn } = useContext(CommonContext);

    const redirectToBlogs = (category) => {
        history.push(`/blogs?category=${category}`);
    }

    const redirectToBlogUpdate = (id) => {
        history.push(`/blogs/update/${id}`);
    }

    useEffect(() => {

        const getData = async () => {
            try {
                setIsLoading(true);

                const { data: blog } = await axios.put(`/blogs/get/${params.id}`);
                setBlog(blog);

                const { data: comments } = await axios.get(`/comments/ofblog/${params.id}`, {
                    headers: { "token": localStorage.getItem("token") }
                });
                setComments(comments);

                setIsLoading(false);
            }
            catch (err) {
                setError(true);
                console.error(err);
                setIsLoading(false);
            }
        }

        getData();

    }, [params.id]);

    const handleCommentSubmit = (e) => {

        e.preventDefault();

        const postComment = async () => {
            try {
                setIsSubmitting(true);

                const { data } = await axios.post(`/comments/create`, {
                    comment: commentText?.trim(), ofBlog: blog?._id
                }, { headers: { "token": localStorage.getItem("token") } });

                setComments([...comments, data]);
                setCommentText("");
                setIsSubmitting(false);
            }
            catch (err) {
                setError(true);
                console.error(err);
                setIsSubmitting(false);
            }
        }

        if (!isLoggedIn) history.push("/login")
        else if (commentText.length && commentText.length <= 200) postComment()
        else toast.error("Comment shouldnt be empty and less than 200 chars", { position: "bottom-right" });

    }

    const [showDeleteBlogModal, setShowDeleteBlogModal] = useState(false);
    const handleDeleteBlogModalShow = () => setShowDeleteBlogModal(true);

    return <Container>
        <Loader isLoading={isLoading} error={error}>
            <div className="wrapper">
                <div className="readBlogBody">
                    <div className="readBlogTitleDiv">
                        <p className="readBlogTitle">
                            {blog?.title}
                        </p>
                        {
                            blog?.blogBy?._id === user._id &&
                            <p className="blogActions">
                                <span className="updateAction" onClick={() => redirectToBlogUpdate(blog?._id)}>
                                    <FaRegEdit />
                                </span>
                                <span className="deleteAction" onClick={handleDeleteBlogModalShow}>
                                    <AiFillDelete />
                                </span>
                            </p>
                        }

                    </div>

                    <div className="readBlogDetails">
                        <p className="readBlogDetailsPara">
                            <span className="readBlogDetailsParaElement">
                                <span className="customUiBold">
                                    Blog by:
                                </span>
                                <span >
                                    {blog?.blogBy?.userName}
                                </span>
                            </span>
                            <span className="readBlogDetailsParaElement">
                                <span className="customUiBold">
                                    Views:
                                </span>
                                <span >
                                    {blog?.views}
                                </span>
                            </span>
                            <span className="readBlogDetailsParaElement">
                                <span className="customUiBold">
                                    Created:
                                </span>
                                <span >
                                    {(new Date(blog?.createdAt)).toDateString()}
                                </span>
                            </span>
                            <span className="readBlogDetailsParaElement">
                                <span className="customUiBold">
                                    Last updated:
                                </span>
                                <span >
                                    {(new Date(blog?.updatedAt)).toDateString()}
                                </span>
                            </span>
                        </p>
                    </div>
                    <div className="readBlogImgDiv">
                        <img src={blog?.photo} alt="blogpic" className="readBlogImg" />
                    </div>
                    <div className="readBlogCategories">
                        <ul className="readBlogCategoriesList">
                            {
                                blog?.categories?.map((c, i) => <li key={c + i}
                                    onClick={() => redirectToBlogs(c)}
                                    className="readBlogCategoriesListItem">
                                    {c}
                                </li>)
                            }
                        </ul>
                    </div>
                    <div className="readBlogBodyDiv">
                        <p className="readBlogBodyDivText">
                            {blog?.body}
                        </p>
                    </div>
                </div>
                <div className="CommentsSection">
                    <div className="commentSectionTitle">
                        <h2>{comments?.length + " "} Comments </h2>
                    </div>
                    <Form className="d-flex commentForm" onSubmit={handleCommentSubmit} >
                        <FormControl
                            type="input"
                            placeholder="Add a comment"
                            className="me-2"
                            aria-label="Search"
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                        />
                        <Button type='submit' className='customBtn'>
                            {isSubmitting ? <Spinner animation="border" size="sm" /> : "Comment"}
                        </Button>
                    </Form>
                    <div className="commentsListDiv">
                        {
                            comments?.map(c => <Comment
                                key={c._id}
                                comment={c}
                                comments={comments}
                                setComments={setComments}
                            />)
                        }
                    </div>
                </div>
            </div>
        </Loader>
        <DeleteBlogModal
            blogId={blog?._id}
            showDeleteBlogModal={showDeleteBlogModal}
            setShowDeleteBlogModal={setShowDeleteBlogModal}
        />
    </Container>
}
