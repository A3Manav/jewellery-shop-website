import { Link } from 'react-router-dom';

function Card({ category }) {
    return (
        <Link to={`/category/${category._id}`} className="btn text-center p-4">
            <h3 className="text-xl font-semibold">{category.name}</h3>
        </Link>
    );
}

export default Card;