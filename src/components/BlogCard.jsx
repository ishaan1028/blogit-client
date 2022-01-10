import React from 'react';
import { Card } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';

export default function BlogCard({ blog }) {

    const history = useHistory();

    const handleRedirect = (id) => {
        history.push(`/blogs/${id}`);
    }

    return <Card className='cardBody' style={{ width: '18rem' }}>
        <Card.Img variant="top" src={blog.photo} onClick={() => handleRedirect(blog._id)} className='hoverPointer' />
        <Card.Body>
            <Card.Title className='hoverPointer' onClick={() => handleRedirect(blog._id)}>{blog.title}</Card.Title>
            <Card.Text>
                {blog.body.split(" ").slice(0, 20).join(" ")}
                {blog.body.split(" ").length > 20 && " ..."}
            </Card.Text>
        </Card.Body>
        <Card.Footer>
            <Link className='linkEntity' to={`/blogs/${blog._id}`}>Read more</Link>
        </Card.Footer>
    </Card>
}
