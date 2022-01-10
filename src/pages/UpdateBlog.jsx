import { Container, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { useHistory } from 'react-router';
import { useFormik } from 'formik';
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useEffect, useState } from 'react';
import { useRef } from 'react';
import { useParams } from 'react-router-dom';
import Loader from '../components/Loader';

export default function UpdateBlog() {

    const categories = ["automotive", "business", "diy", "fashion", "finance", "fitness", "food", "gaming", "lifestyle", "movie", "music", "news", "personal", "pet", "politics", "sports", "technology", "travel", "other"];

    const history = useHistory();
    const params = useParams();

    const [isLoading, setIsLoading] = useState();
    const [error, setError] = useState();

    const [blog, setBlog] = useState({});

    const [photo, setPhoto] = useState(null);
    const selectRef = useRef();
    const [selectedCategories, setSelectedCategories] = useState([]);

    const initialValues = {
        title: blog?.title || "",
        body: blog?.body || ""
    };

    const validationSchema = Yup.object({
        title: Yup.string()
            .min(3, "minimum 3 characters")
            .max(100, "maximum 100 characters")
            .required('required'),
        body: Yup.string()
            .min(5, "minimum 5 characters")
            .max(20000, "maximum 20000 characters")
            .required('required')
    });

    const onSubmit = ({ title, body: blogBody }) => {

        const formData = new FormData();
        formData.append("file", photo);
        formData.append("upload_preset", process.env.REACT_APP_UPLOAD_PRESET);
        formData.append("cloud_name", process.env.REACT_APP_CLOUDNAME);

        const postData = async () => {
            try {

                const body = {
                    title,
                    body: blogBody,
                    categories: selectedCategories,
                    photo: "",
                    photoId: ""
                };

                setIsLoading(true);

                if (photo) {
                    // post the image direclty to the cloudinary
                    const { data } = await axios.post(process.env.REACT_APP_CLOUDINARY_POST_URL, formData);
                    body.photo = data.secure_url;
                    body.photoId = data.public_id;
                }

                await axios.put(`/blogs/update/${params.id}`, body,
                    {
                        headers: { token: localStorage.getItem("token") }
                    });

                setIsLoading(false);
                history.replace("/");

            }
            catch (err) {
                setIsLoading(false);
                console.error(err);
                toast.error("Error updating blog! Try later.");
            }
        }

        if (selectedCategories.length > 0) {
            postData();
        }
        else {
            toast.error("please select a category for your blog");
        }

    }

    const formik = useFormik({
        initialValues,
        onSubmit,
        validationSchema,
        enableReinitialize: true
    });

    const handleChange = ({ target: { files } }) => {

        setPhoto(files[0]);

    }

    const handleSelect = (e) => {
        const values = [...e.target.selectedOptions].map(opt => opt.value).filter(o => o !== "");
        setSelectedCategories([...values]);
    }

    useEffect(() => {

        const getData = async () => {
            try {
                setIsLoading(true);
                const { data } = await axios.put(`/blogs/get/${params.id}`);
                setBlog(data);
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


    return <Container>
        <Loader isLoading={isLoading} error={error}>
            <div className="wrapper">
                <div className="pageTitleDiv">
                    <h2>Update your blog</h2>
                </div>
                <div className="paddingV1H0">
                    <Form onSubmit={formik.handleSubmit} >
                        <Form.Group className="mb-3">
                            <Form.Label>Select a picture from computer</Form.Label>
                            <Form.Control type="file" name="file" onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Title</Form.Label>
                            <Form.Control type="text" name="title"
                                value={formik.values.title} placeholder="Enter blog title"
                                onChange={formik.handleChange} onBlur={formik.handleBlur} />
                            {
                                formik.errors.title && formik.touched.title ?
                                    <Form.Text className="redColor">
                                        {formik.errors.title}
                                    </Form.Text> : null
                            }
                        </Form.Group>
                        <Form.Group className="mb-3" >
                            <Form.Label>Body</Form.Label>
                            <Form.Control as="textarea" rows={3} name="body"
                                value={formik.values.body} placeholder="Enter blog body"
                                onChange={formik.handleChange} onBlur={formik.handleBlur} />
                            {
                                formik.errors.body && formik.touched.body ?
                                    <Form.Text className="redColor">
                                        {formik.errors.body}
                                    </Form.Text> : null
                            }
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicBio">
                            <Form.Label>Categories <span className='miniText'>(select multiple using ctrl + click)</span></Form.Label>
                            <Form.Select onChange={handleSelect} ref={selectRef} required multiple>
                                {
                                    categories.map((c, i) => <option key={c + i} value={c}>{c}</option>)
                                }
                            </Form.Select>
                        </Form.Group>
                        <Button variant="primary" type="submit" className="customBtn">
                            Submit
                        </Button>
                    </Form>
                </div>
            </div>
        </Loader>
    </Container>
}
