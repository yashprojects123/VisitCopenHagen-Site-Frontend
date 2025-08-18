import React from 'react';
import Header from '../../Components/Header/Header';
import Footer from '../../Components/Footer/Footer';
import { isRouteErrorResponse, useLocation, useNavigate, useRouteError } from 'react-router-dom';
import './ErrorPage.css';

// A custom illustration component (or you can use an SVG directly)
const ErrorIllustration = () => (
    <svg width="150" height="150" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2Z" stroke="#4a5568" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 16V12" stroke="#4a5568" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 8H12.01" stroke="#4a5568" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);


const ErrorPage = () => {
    const navigate = useNavigate();
    const error = useRouteError();
    let location = useLocation();

    let title = "An unexpected error occurred";
    let message = "We're sorry, something went wrong. Please try refreshing the page or navigating back to the home page.";

    if (isRouteErrorResponse(error)) {
        if (error.status === 404) {
            title = "404 - Page Not Found";
            message = "We couldn't find the page you were looking for. It might have been moved or deleted.";
        } else if (error.status === 401 || error.status === 403) {
            title = `Error ${error.status} - Access Denied`;
            message = "You don't have permission to view this page. Please log in or contact support.";
        } else {
            title = `Error ${error.status}`;
            message = error.statusText || "Something went wrong. Please try again.";
        }
    } else if (error?.response?.data?.message) {
        message = error.response.data.message;
    } else if (error?.message) {
        message = error.message;
    }

    const isUserSite = !location.pathname.includes('admin');

    return (
        <>
            {isUserSite && <Header />}
            <div className="error-page-container">
                <div className="error-page-content">
                    <ErrorIllustration />
                    <h1 className="error-title">{title}</h1>
                    <p className="error-message">{message}</p>
                    <button className="error-button" onClick={() => navigate('/')}>
                        Go back to Homepage
                    </button>
                    <p className="error-help-text">
                        If the problem persists, please contact our support team.
                    </p>
                </div>
            </div>
            {isUserSite && <Footer />}
        </>
    );
};

export default ErrorPage;