import { useContext, useState } from "react";
import { Container, Form, Button, Alert, Spinner } from "react-bootstrap";
import { Link, Redirect } from "react-router-dom";
import { useFormik } from 'formik';
import * as Yup from "yup";
import axios from "axios";
import CommonContext from "../context/CommonContext";

export default function Login() {

    const { isLoggedIn, SetIsLoggedIn } = useContext(CommonContext);

    const [isLoading, setIsLoading] = useState();
    const [errors, setErrors] = useState();

    const initialValues = {
        email: "test@user.com",
        password: "test123"
    };

    const validationSchema = Yup.object({
        email: Yup.string()
            .email('Invalid email format')
            .required('Required'),
        password: Yup.string()
            .required('Required')
            .min(6, "minimum 6 characters")
            .max(100, "maximum 100 characters")
    });

    const onSubmit = async ({ email, password }) => {

        try {

            setIsLoading(true);

            const { data } = await axios.post(`/auth/login`, {
                email,
                password
            });

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            setIsLoading(false);
            SetIsLoggedIn(true);

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
            <Container >
                <div className="login">
                    <div className="loginBody">
                        <div className="loginBodyTop">
                            <div className="loginLogo">
                                <div className="logo">
                                    Login
                                </div>
                            </div>
                            {
                                errors && <Alert variant="danger" className="centerAlign">
                                    {errors}
                                </Alert>
                            }
                            <Form onSubmit={formik.handleSubmit} >
                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                    <Form.Label>Email address</Form.Label>
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
                                    {isLoading ? <Spinner animation="border" size="sm" /> : "Log in"}
                                </Button>
                            </Form>
                        </div>
                        <div className="loginBodyBottom">
                            <p>Dont have an account?
                                <Link to="/signup">
                                    <Button className="customBtnOutline" variant="outline-primary">Sign up</Button>
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </Container>
    )
}
