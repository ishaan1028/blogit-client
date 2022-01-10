import { Container, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import CommonContext from '../context/CommonContext';
import Loader from '../components/Loader';
import BlogCard from '../components/BlogCard';

export default function Profile() {

    const { SetIsLoggedIn } = useContext(CommonContext);

    const [user, setUser] = useState();
    const [blogs, setBlogs] = useState([]);

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState();

    //logout operation
    const logoutOperation = () => {
        localStorage.clear();
        SetIsLoggedIn(false);
    }

    useEffect(() => {

        //api call to get user info
        const getData = async () => {
            try {
                setIsLoading(true);
                const token = localStorage.getItem("token");

                const { data: user } = await axios.get(`/users/profile`,
                    { headers: { token } }
                );
                setUser(user);

                const { data: blogs } = await axios.get(`/blogs/own`,
                    { headers: { token } }
                );
                setBlogs(blogs);
                setIsLoading(false);

            }
            catch (err) {
                setIsLoading(false);
                setError(true);
                console.error(err);
            }
        }

        getData();

    }, []);

    return <Loader isLoading={isLoading} error={error}>
        <Container>
            {
                <div className="profileWrapper" >
                    <div className="profileTop">
                        <div className="profileTopLeft">
                            <img src="https://res.cloudinary.com/hiddencloud1111/image/upload/v1634630235/defaultProfilePic_xlwkzb.png"
                                alt="profilepic" className="profileImg" />
                        </div>
                        <div className="profileTopRight">
                            <div className="profileTopRightTop">
                                <span className="profileUsername">{user?.userName}</span>
                                <Link to="/profile/edit">
                                    <Button className="customBtn" >Edit profile</Button>
                                </Link>
                                <div className="logoutDiv">
                                    <Button variant="danger"
                                        onClick={logoutOperation}
                                    >Logout</Button>
                                </div>
                            </div>
                            <div className="profileTopRightMiddle">
                                <span >
                                    <span className="profileTopRightMiddleData">{blogs?.length}</span> blogs</span>
                            </div>
                            <div className="profileTopRightBottom">
                                <p className="profilebio" >{user?.fullName}</p>
                                <p>Member since {(new Date(user?.createdAt)).toDateString()}</p>
                            </div>
                        </div>
                    </div>
                    <div className="profileMiddle">
                        <ul className="profileMiddleList">
                            <li className="profileMiddleListItem">
                                <button
                                    className="profileMiddleListItemBtn active">
                                    My-Blogs
                                </button>
                            </li>
                            <li className="profileMiddleListItem">
                                <Link to="/blogs/create">
                                    <button className="profileMiddleListItemBtn">Create-Blog</button>
                                </Link>

                            </li>
                        </ul>
                    </div>
                    <div className="profileBottom" >
                        {
                            blogs?.length === 0 && <Alert variant='success' className='centerAlign'>
                                You havent posted any blogs yet
                            </Alert>
                        }
                        <div className="blogsList">
                            {
                                blogs?.map(b => <BlogCard key={b._id} blog={b} />)
                            }
                        </div>
                    </div>
                </div>
            }
        </Container>
    </Loader>
}
