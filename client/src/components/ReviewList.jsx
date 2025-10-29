import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Star, ThumbsUp, Flag, Edit2, Trash2, Calendar } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const ReviewList = ({ productId, refreshTrigger }) => {
    const { user } = useContext(AuthContext);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({});
    const [ratingDistribution, setRatingDistribution] = useState([]);
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState('desc');
    const [currentPage, setCurrentPage] = useState(1);

    const fetchReviews = async (page = 1) => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/reviews/product/${productId}`, {
                params: {
                    page,
                    limit: 10,
                    sort: sortBy,
                    order: sortOrder
                }
            });

            setReviews(response.data.reviews);
            setPagination(response.data.pagination);
            setRatingDistribution(response.data.ratingDistribution);
            setCurrentPage(page);
        } catch (error) {
            console.error('Fetch reviews error:', error);
            toast.error('Failed to load reviews');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (productId) {
            fetchReviews(1);
        }
    }, [productId, sortBy, sortOrder, refreshTrigger]);

    const handleSortChange = (newSort, newOrder) => {
        setSortBy(newSort);
        setSortOrder(newOrder);
        setCurrentPage(1);
    };

    const handlePageChange = (page) => {
        fetchReviews(page);
    };

    const markAsHelpful = async (reviewId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('Please login to mark reviews as helpful');
                return;
            }

            await axios.post(`/api/reviews/${reviewId}/helpful`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Update the review in state
            setReviews(prev => prev.map(review =>
                review._id === reviewId
                    ? { ...review, helpfulVotes: review.helpfulVotes + 1 }
                    : review
            ));

            toast.success('Marked as helpful!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to mark as helpful');
        }
    };

    const reportReview = async (reviewId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('Please login to report reviews');
                return;
            }

            await axios.post(`/api/reviews/${reviewId}/report`, {
                reason: 'inappropriate_content'
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            toast.success('Review reported successfully');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to report review');
        }
    };

    const deleteReview = async (reviewId) => {
        if (!window.confirm('Are you sure you want to delete this review?')) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`/api/reviews/${reviewId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setReviews(prev => prev.filter(review => review._id !== reviewId));
            toast.success('Review deleted successfully');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete review');
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getRatingDistributionPercentage = (rating) => {
        const totalReviews = ratingDistribution.reduce((sum, item) => sum + item.count, 0);
        const ratingCount = ratingDistribution.find(item => item._id === rating)?.count || 0;
        return totalReviews > 0 ? Math.round((ratingCount / totalReviews) * 100) : 0;
    };

    if (loading && currentPage === 1) {
        return (
            <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-gray-100 rounded-lg p-4 animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-16 bg-gray-200 rounded"></div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Rating Summary */}
            {ratingDistribution.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-4">Rating Breakdown</h4>
                    <div className="space-y-2">
                        {[5, 4, 3, 2, 1].map(rating => (
                            <div key={rating} className="flex items-center gap-3">
                                <div className="flex items-center gap-1 w-12">
                                    <span className="text-sm text-gray-600">{rating}</span>
                                    <Star className="w-3 h-3 text-gray-400 fill-current" />
                                </div>
                                <div className="flex-1 bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${getRatingDistributionPercentage(rating)}%` }}
                                    />
                                </div>
                                <span className="text-sm text-gray-600 w-8">
                                    {getRatingDistributionPercentage(rating)}%
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Sort Options */}
            <div className="flex items-center justify-between">
                <h4 className="font-semibold text-gray-900">
                    {pagination.count || 0} Reviews
                </h4>
                <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-600">Sort by:</label>
                    <select
                        value={`${sortBy}-${sortOrder}`}
                        onChange={(e) => {
                            const [sort, order] = e.target.value.split('-');
                            handleSortChange(sort, order);
                        }}
                        className="text-sm border border-gray-300 rounded px-2 py-1"
                    >
                        <option value="createdAt-desc">Newest First</option>
                        <option value="createdAt-asc">Oldest First</option>
                        <option value="rating-desc">Highest Rated</option>
                        <option value="rating-asc">Lowest Rated</option>
                        <option value="helpfulVotes-desc">Most Helpful</option>
                    </select>
                </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
                {reviews.length > 0 ? (
                    reviews.map(review => (
                        <div key={review._id} className="bg-white border border-gray-200 rounded-lg p-6">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                        <span className="text-sm font-medium text-gray-600">
                                            {review.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                                        </span>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h5 className="font-medium text-gray-900">
                                                {review.user?.name || 'Anonymous'}
                                            </h5>
                                            {review.verified && (
                                                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                                    Verified Purchase
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="flex items-center">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`w-4 h-4 ${i < review.rating
                                                                ? 'text-yellow-400 fill-current'
                                                                : 'text-gray-300'
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-sm text-gray-500">
                                                {formatDate(review.createdAt)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Menu */}
                                <div className="flex items-center gap-2">
                                    {user && user._id === review.user._id && (
                                        <button
                                            onClick={() => deleteReview(review._id)}
                                            className="text-red-500 hover:text-red-700 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Review Content */}
                            <div className="mb-4">
                                {review.title && (
                                    <h6 className="font-medium text-gray-900 mb-2">{review.title}</h6>
                                )}
                                <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                            </div>

                            {/* Review Actions */}
                            <div className="flex items-center gap-4 pt-3 border-t border-gray-100">
                                <button
                                    onClick={() => markAsHelpful(review._id)}
                                    className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                                >
                                    <ThumbsUp className="w-4 h-4" />
                                    <span>Helpful ({review.helpfulVotes})</span>
                                </button>

                                {user && user._id !== review.user._id && (
                                    <button
                                        onClick={() => reportReview(review._id)}
                                        className="flex items-center gap-1 text-sm text-gray-600 hover:text-red-600 transition-colors"
                                    >
                                        <Flag className="w-4 h-4" />
                                        <span>Report</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12">
                        <div className="text-gray-400 mb-4">
                            <Star className="w-12 h-12 mx-auto" />
                        </div>
                        <h4 className="text-lg font-medium text-gray-900 mb-2">No Reviews Yet</h4>
                        <p className="text-gray-600">Be the first to share your experience with this product.</p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {pagination.total > 1 && (
                <div className="flex items-center justify-center gap-2 pt-6">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                    >
                        Previous
                    </button>

                    <div className="flex items-center gap-1">
                        {[...Array(Math.min(5, pagination.total))].map((_, i) => {
                            const page = i + 1;
                            return (
                                <button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    className={`px-3 py-2 text-sm rounded-lg transition-colors ${currentPage === page
                                            ? 'bg-gray-900 text-white'
                                            : 'border border-gray-300 hover:bg-gray-50'
                                        }`}
                                >
                                    {page}
                                </button>
                            );
                        })}
                    </div>

                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === pagination.total}
                        className="px-3 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default ReviewList;