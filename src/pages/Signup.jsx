import { Container, Form, Button, Alert, Spinner } from "react-bootstrap";
import { Link, useHistory, Redirect } from "react-router-dom";
import { useFormik } from 'formik';
import * as Yup from "yup";
import axios from "axios";
import { useContext, useState } from "react";
import CommonContext from "../context/CommonContext";
import { toast } from "react-toastify";

export default function Signup() {

    const [isLoading, setIsLoading] = useState();
    const [errors, setErrors] = useState();
    const { isLoggedIn } = useContext(CommonContext);

    const history = useHistory();

    const initialValues = {
        fullName: "",
        email: "",
        userName: "",
        password: ""
    }

    const validationSchema = Yup.object({
        fullName: Yup.string()
            .required('Required')
            .min(4, "minimum 4 characters")
            .max(50, "maximum 50 characters"),
        userName: Yup.string()
            .required('Required')
            .min(3, "minimum 3 characters")
            .max(12, "maximum 12 characters"),
        email: Yup.string()
            .email('Invalid email format')
            .required('Required'),
        password: Yup.string()
            .required('Required')
            .min(6, "minimum 6 characters")
            .max(100, "maximum 100 characters")
    });

    const onSubmit = async ({ fullName, userName, email, password }) => {
        try {
            setIsLoading(true);
            await axios.post(`/auth/register`, {
                fullName,
                userName,
                email,
                password
            });
            setIsLoading(false);
            toast.success("Registered successfully!");
            history.replace("/login");
        }
        catch (err) {
            setIsLoading(false);
            setErrors(err?.response?.data);
            console.error(err);
        }
    }

    const formik = useFormik({
        initialValues,
        onSubmit,
        validationSchema
    });

    return (
        isLoggedIn ? <Redirect to="/" /> :
            <Container>
                <div className="register">
                    <div className="loginBody">
                        <div className="loginBodyTop">
                            <div className="loginLogo">
                                <div className="logo">
                                    Register
                                </div>
                            </div>
                            {
                                errors && <Alert variant="danger" className="centerAlign">
                                    {errors}
                                </Alert>
                            }
                            <Form onSubmit={formik.handleSubmit} >
                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control type="email" name="email" placeholder="Enter email"
                                        onChange={formik.handleChange} value={formik.values.email}
                                        onBlur={formik.handleBlur}
                                    />
                                    {
                                        formik.errors.email && formik.touched.email ?
                                            <Form.Text className="redColor">
                                                {formik.errors.email}
                                            </Form.Text> : null
                                    }
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label>Full name</Form.Label>
                                    <Form.Control type="text" name="fullName" value={formik.values.fullName} placeholder="Enter full name" onChange={formik.handleChange} onBlur={formik.handleBlur} />
                                    {
                                        formik.errors.fullName && formik.touched.fullName ?
                                            <Form.Text className="redColor">
                                                {formik.errors.fullName}
                                            </Form.Text> : null
                                    }
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formBasicUn">
                                    <Form.Label>User name</Form.Label>
                                    <Form.Control type="text" name="userName" value={formik.values.userName} placeholder="Enter username" onChange={formik.handleChange} onBlur={formik.handleBlur} />
                                    {
                                        formik.errors.userName && formik.touched.userName ?
                                            <Form.Text className="redColor">
                                                {formik.errors.userName}
                                            </Form.Text> : null
                                    }
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formBasicPassword">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control type="password" name="password"
                                        value={formik.values.password} placeholder="Min 6 characters" onChange={formik.handleChange} onBlur={formik.handleBlur} />
                                    {
                                        formik.errors.password && formik.touched.password ?
                                            <Form.Text className="redColor">
                                                {formik.errors.password}
                                            </Form.Text> : null
                                    }
                                </Form.Group>
                                <Button type="submit" className="customBtn">
                                    {isLoading ? <Spinner animation="border" size="sm" /> : "Register"}
                                </Button>
                            </Form>
                        </div>
                        <div className="loginBodyBottom">
                            <p>Have an account already?
                                <Link to="/login">
                                    <Button className="customBtnOutline" variant="outline-primary">Log in</Button>
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </Container>
    )
}