import React, { useState } from 'react'
import './SearchBox.css'
import { useNavigate, useSearchParams } from 'react-router-dom';

const SearchBox = ({closeFun}) => {
        let [searchedData, setSearchedData] = useState("");

        let navigate = useNavigate();
        const searchFun = (e) => {
                e.preventDefault();
                if(searchedData!=""){
                navigate(`/search?q=${encodeURIComponent(searchedData)}`);
                document.body.classList.remove("no-overflow");
                closeSearchFun(true)
                }
        }
        const closeSearchFun = () => {
                closeFun(true);
        }
        return (
                <>
                        <div className="overlay"></div>
                        
                        <div className='search-box-wrapper'>
                                <div className="container">
                                        <form className="search-box" onSubmit={(e) => { searchFun(e) }}>
                                                <input type="text" placeholder='Search' value={searchedData} onChange={(e) => { setSearchedData(e.target.value) }} />
                                                <button type="submit" className='search-button action-button'>
                                                        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 18.508 18.508" width="22"><path d="M 12.264 2.111 C 10.856 0.704 9.164 0 7.188 0 C 5.21 0 3.518 0.704 2.11 2.111 C 0.704 3.52 0 5.211 0 7.187 c 0 1.977 0.704 3.67 2.111 5.077 c 1.408 1.407 3.1 2.111 5.076 2.111 c 1.708 0 3.22 -0.54 4.538 -1.617 l 5.705 5.75 l 1.078 -1.078 l -5.75 -5.705 c 1.078 -1.318 1.617 -2.83 1.617 -4.537 c 0 -1.977 -0.704 -3.67 -2.111 -5.077 Z m -9.12 1.034 C 4.254 2.007 5.6 1.437 7.188 1.437 c 1.588 0 2.943 0.562 4.066 1.685 c 1.123 1.123 1.684 2.478 1.684 4.066 c 0 1.587 -0.561 2.942 -1.684 4.065 c -1.123 1.123 -2.478 1.684 -4.066 1.684 c -1.587 0 -2.942 -0.561 -4.065 -1.684 C 2 10.13 1.437 8.775 1.437 7.187 c 0 -1.587 0.57 -2.934 1.708 -4.042 Z" fill-rule="evenodd" stroke="none" stroke-width="1"></path></svg>

                                                </button>

                                                <button className='close-button action-button' onClick={ closeSearchFun }>
                                                        <svg width="37" height="37" viewBox="0 0 45 45" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><title>Group</title><defs><circle id="path-1" cx="18.5" cy="18.5" r="18.5"></circle><filter x="-18.9%" y="-13.5%" width="137.8%" height="137.8%" filterUnits="objectBoundingBox" id="filter-2"><feOffset dx="0" dy="2" in="SourceAlpha" result="shadowOffsetOuter1"></feOffset><feGaussianBlur stdDeviation="2" in="shadowOffsetOuter1" result="shadowBlurOuter1"></feGaussianBlur><feColorMatrix values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.5 0" type="matrix" in="shadowBlurOuter1"></feColorMatrix></filter></defs><g id="Symbols" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="Icons/Multi/Close-(Mobil)" transform="translate(1.000000, 1.000000)"><g id="Group" transform="translate(3.000000, 1.000000)"><g id="Oval"><use fill="black" fill-opacity="1" filter="url(#filter-2)" xlink:href="#path-1"></use><use fill="#FFFFFF" fill-rule="evenodd" xlink:href="#path-1"></use></g><rect id="Rectangle" fill="#022B52" transform="translate(18.500000, 18.500000) rotate(-45.000000) translate(-18.500000, -18.500000) " x="7.5" y="16.7796936" width="22" height="3.44061279" rx="0.720306"></rect><rect id="Rectangle" fill="#022B52" transform="translate(18.500000, 18.500000) scale(-1, 1) rotate(-45.000000) translate(-18.500000, -18.500000) " x="7.5" y="16.7796936" width="22" height="3.44061279" rx="0.720306"></rect></g></g></g></svg>
                                                </button>
                                        </form>
                                </div>
                        </div>
                        
                </>
        )
}

export default SearchBox
