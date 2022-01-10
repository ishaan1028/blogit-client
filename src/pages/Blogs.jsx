import axios from 'axios';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { Alert, Container } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import BlogCard from '../components/BlogCard';
import Features from '../components/Features';
import Loader from '../components/Loader';

export default function Blogs() {

    const [blogs, setBlogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState();

    const location = useLocation();

    useEffect(() => {

        const getData = async () => {
            try {
                setIsLoading(true);
                const { data } = await axios.get(`/blogs/all${location.search}`);
                setBlogs(data);
                setIsLoading(false);
            }
            catch (err) {
                setError(true);
                console.error(err);
                setIsLoading(false);
            }
        }

        getData();

    }, [location.search]);

    return <Container>
        <Features />
        <Loader isLoading={isLoading} error={error}>
            {
                blogs?.length === 0 && <Alert variant='success' className='centerAlign'>
                    No blogs for this category yet :(
                </Alert>
            }
            <div className="blogsList">
                {
                    blogs?.map(b => <BlogCard key={b._id} blog={b} />)
                }
            </div>
        </Loader>
    </Container>
}
