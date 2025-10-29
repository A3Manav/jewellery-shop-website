import { useState } from 'react';

function ErrorBoundary({ children }) {
    const [hasError, setHasError] = useState(false);

    if (hasError) {
        return (
            <div className="container mx-auto px-4 pt-20">
                <h1 className="text-2xl font-bold">Something went wrong.</h1>
                <p>Please try refreshing the page or contact support.</p>
            </div>
        );
    }

    try {
        return children;
    } catch (error) {
        setHasError(true);
        return null;
    }
}

export default ErrorBoundary;