import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const CategoryDetail = () => {
    const { id } = useParams();
    const [category, setCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const response = await axios.get(`/api/categories/${id}`);
                setCategory(response.data.data);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch category');
                setLoading(false);
            }
        };

        fetchCategory();
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!category) return <div>Category not found</div>;

    return (
        <div className="container">
            <h2>{category.name}</h2>
            <p>Type: {category.type}</p>
            {category.image?.url && (
                <img
                    src={category.image.url}
                    alt={category.name}
                    className="img-fluid"
                    style={{ maxHeight: '300px' }}
                />
            )}
            <p>Created: {new Date(category.createdAt).toLocaleDateString()}</p>
        </div>
    );
};

export default CategoryDetail;