import { Container, Form, Button } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from "yup";
import Loader from '../components/Loader';
import { toast } from 'react-toastify';

export default function UpdateProfile() {

    const [user, setUser] = useState();

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState();
    const history = useHistory();
    const token = localStorage.getItem("token");

    useEffect(() => {

        //api call to get user info
        const getUser = async () => {

            try {
                setIsLoading(true);
                const { data } = await axios.get(`/users/profile`,
                    { headers: { token } }
                );

                setUser(data);
                setIsLoading(false);
            }
            catch (err) {
                setIsLoading(false);
                setError(true);
                console.error(err);
            }
        }

        getUser();

    }, [token]);

    const initialValues = {
        fullName: user?.fullName || "",
        userName: user?.userName || "",
    };

    const validationSchema = Yup.object({
        fullName: Yup.string()
            .min(4, "minimum 4 characters")
            .max(50, "maximum 50 characters"),
        userName: Yup.string()
            .min(3, "minimum 3 characters")
            .max(12, "maximum 12 characters"),
    });

    const onSubmit = async ({ fullName, userName }) => {

        try {
            setIsLoading(true);

            const body = { fullName, userName };

            await axios.put(`/users/update`, body,
                {
                    headers: { token }
                });

            setIsLoading(false);
            history.push(`/profile`);
        }
        catch (err) {
            setIsLoading(false);
            toast.error(err?.response?.data || "Something went wrong");
            console.error(err);
        }

    }

    const formik = useFormik({
        initialValues,
        onSubmit,
        validationSchema,
        enableReinitialize: true
    });

    return <Loader isLoading={isLoading} error={error}>
        <Container>
            <div className="wrapper">
                <div className="pageTitleDiv">
                    <h2>Update profile</h2>
                </div>
                <div className="paddingV1H0">
                    <Form onSubmit={formik.handleSubmit} >
                        <Form.Group className="mb-3" >
                            <Form.Label>Full name</Form.Label>
                            <Form.Control type="text" name="fullName"
                                value={formik.values.fullName} placeholder="Enter full name"
                                onChange={formik.handleChange} onBlur={formik.handleBlur} />
                            {
                                formik.errors.fullName && formik.touched.fullName ?
                                    <Form.Text className="redColor">
                                        {formik.errors.fullName}
                                    </Form.Text> : null
                            }
                        </Form.Group>
                        <Form.Group className="mb-3" >
                            <Form.Label>User name</Form.Label>
                            <Form.Control type="text" name="userName"
                                value={formik.values.userName} placeholder="Enter user name"
                                onChange={formik.handleChange} onBlur={formik.handleBlur} />
                            {
                                formik.errors.userName && formik.touched.userName ?
                                    <Form.Text className="redColor">
                                        {formik.errors.userName}
                                    </Form.Text> : null
                            }
                        </Form.Group>
                        <Button variant="primary" type="submit" className="customBtn">
                            Submit
                        </Button>
                    </Form>
                </div>
            </div>
        </Container>
    </Loader>

}
