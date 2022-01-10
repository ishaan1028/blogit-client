import React, { useState } from 'react';
import { Button, Form, FormControl } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { useHistory } from 'react-router-dom';

export default function Features() {

    const categories = ["automotive", "business", "diy", "fashion", "finance", "fitness", "food", "gaming", "lifestyle", "movie", "music", "news", "personal", "pet", "politics", "sports", "technology", "travel", "other"];

    const location = useLocation();
    const history = useHistory();

    const [searchText, setSearchText] = useState((new URLSearchParams(location.search)).get("keyword") || "");

    const [filter, setFilter] = useState((new URLSearchParams(location.search)).get("category") || "");

    const handleFilterChange = ({ target: { value } }) => {
        setFilter(value);
        history.push(`/blogs?category=${value}&keyword=${searchText}`);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        history.push(`/blogs?category=${filter}&keyword=${searchText}`);
    }

    const handleReset = () => {
        setFilter("");
        setSearchText("");
        history.push(`/blogs`);
    }

    return <div className="featuresBody">
        <div className="searchBoxDiv">
            <Form className="d-flex" onSubmit={handleSubmit}>
                <FormControl
                    type="search"
                    placeholder="Search blogs"
                    className="me-2"
                    aria-label="Search"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />
                <Button type='submit' className='customBtn'>Search</Button>
            </Form>
        </div>
        <div className="filterDiv">
            <h5 className='uiBold'>Filter</h5>
            <Form.Select value={filter} onChange={handleFilterChange}>
                <option value="">all</option>
                {
                    categories.map((c, i) => <option key={c + i} value={c}>{c}</option>)
                }
            </Form.Select>
        </div>

        <Button onClick={handleReset} className='customBtn'>Reset Results</Button>
    </div>
}