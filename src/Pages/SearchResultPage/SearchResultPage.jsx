import React from 'react';
import './SearchResultPage.css';
import { useLocation } from 'react-router-dom';

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const SearchResultPage = () => {
  const query = useQuery().get('q') || '';


  return (
    <div className="results-page">
      <div className="container">
       <div className="search-header">
        <h1 className='page-title'>Search Results</h1>
        <p className="search-query">Showing results for: <span>"{query}"</span></p>
      </div>

      <div className="results-list">
          <p className="no-results">No results found for "{query}".</p>
      </div>
      </div>
    </div>
  );
};

export default SearchResultPage;
