import { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Star, X, Send } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const ReviewForm = ({ productId, onReviewSubmitted, onClose }) => {
    const { user } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        rating: 0,
        title: '',
        comment: ''
    });
    const [hoveredRating, setHoveredRating] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    const handleRatingClick = (rating) => {
        setFormData(prev => ({ ...prev, rating }));
        setErrors(prev => ({ ...prev, rating: null }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.rating) {
            newErrors.rating = 'Please select a rating';
        }

        if (!formData.comment.trim()) {
            newErrors.comment = 'Please write a review comment';
        } else if (formData.comment.trim().length < 10) {
            newErrors.comment = 'Review must be at least 10 characters long';
        } else if (formData.comment.trim().length > 500) {
            newErrors.comment = 'Review cannot exceed 500 characters';
        }

        if (formData.title.length > 100) {
            newErrors.title = 'Title cannot exceed 100 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('/api/reviews', {
                product: productId,
                rating: formData.rating,
                title: formData.title.trim() || undefined,
                comment: formData.comment.trim()
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            toast.success('Review submitted successfully!');
            onReviewSubmitted(response.data.review);
            onClose();
        } catch (error) {
            console.error('Submit review error:', error);
            toast.error(error.response?.data?.message || 'Failed to submit review');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!user) {
        return (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">
                <p className="text-gray-600 mb-4">Please log in to write a review</p>
                <button
                    onClick={onClose}
                    className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                    Close
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Write a Review</h3>
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Rating Section */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rating *
                    </label>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => handleRatingClick(star)}
                                    onMouseEnter={() => setHoveredRating(star)}
                                    onMouseLeave={() => setHoveredRating(0)}
                                    className="p-1 transition-colors"
                                >
                                    <Star
                                        className={`w-6 h-6 transition-colors ${star <= (hoveredRating || formData.rating)
                                                ? 'text-yellow-400 fill-current'
                                                : 'text-gray-300'
                                            }`}
                                    />
                                </button>
                            ))}
                        </div>
                        <span className="text-sm text-gray-600 ml-2">
                            {formData.rating > 0 && (
                                `${formData.rating} out of 5 stars`
                            )}
                        </span>
                    </div>
                    {errors.rating && (
                        <p className="text-red-500 text-sm mt-1">{errors.rating}</p>
                    )}
                </div>

                {/* Title Section */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Title (Optional)
                    </label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="Summarize your experience..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors"
                        maxLength={100}
                    />
                    <div className="flex justify-between items-center mt-1">
                        {errors.title && (
                            <p className="text-red-500 text-sm">{errors.title}</p>
                        )}
                        <p className="text-gray-400 text-xs ml-auto">
                            {formData.title.length}/100
                        </p>
                    </div>
                </div>

                {/* Comment Section */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Review *
                    </label>
                    <textarea
                        name="comment"
                        value={formData.comment}
                        onChange={handleInputChange}
                        placeholder="Share your thoughts about this product..."
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors resize-none"
                        maxLength={500}
                    />
                    <div className="flex justify-between items-center mt-1">
                        {errors.comment && (
                            <p className="text-red-500 text-sm">{errors.comment}</p>
                        )}
                        <p className="text-gray-400 text-xs ml-auto">
                            {formData.comment.length}/500
                        </p>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex items-center gap-2 px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {isSubmitting ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <Send className="w-4 h-4" />
                        )}
                        {isSubmitting ? 'Submitting...' : 'Submit Review'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ReviewForm;