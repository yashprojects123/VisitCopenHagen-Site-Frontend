import React from 'react'
import './Banner.css'
import { Link } from 'react-router-dom';
import parse from 'html-react-parser';
const Banner = ({ className, image1, image2, mainTitle, caption, subTitle, descriptionTexts, location }) => {
        return (
                <div className={`banner-section-wrapper ${className}`}>
                        <div className="container">

                                <div className='banner-content'>
                                        {(image1 && image2) ?
                                                <div className="images">
                                                        <div>
                                                                <img src={image1} alt={mainTitle} loading='eager'/>
                                                        </div>
                                                        <div>
                                                                <img src={image2} alt={mainTitle} loading='eager' />
                                                        </div>
                                                </div>
                                                :
                                                <div className="banner-image">
                                                        <div>
                                                                <img src={image1} alt={mainTitle} loading='eager' />
                                                        </div>
                                                </div>
                                        }

                                        <div className="banner-title text-center">
                                                <h1>{mainTitle}</h1>
                                                <p><strong style={{ marginRight: ".5rem" }}>Photo:</strong>
                                                        {caption}</p>
                                        </div>

                                        <div className="text-content text-center">
                                                <h2 className='subTitle'>{subTitle}</h2>
                                                <div className='banner-texts'>
                                                        {
                                                                descriptionTexts.map((item, index) => {
                                                                        return <div key={index}>{parse(item)}</div>
                                                                })
                                                        }

                                                </div>

                                        </div>

                                </div>
                        </div>
                        </div>
                        )
}

                        export default Banner
