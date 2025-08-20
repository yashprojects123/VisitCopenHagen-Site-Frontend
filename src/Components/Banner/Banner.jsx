import React from 'react'
import './Banner.css'
import { Link } from 'react-router-dom';
import parse from 'html-react-parser';
const Banner = ({ className, images, mainTitle, caption, subTitle, descriptionTexts, location }) => {

        const safeDescriptions = Array.isArray(descriptionTexts)
                ? descriptionTexts
                : descriptionTexts
                        ? [descriptionTexts] // wrap single string in array
                        : [];
        console.log(safeDescriptions)
        return (
                <div className={`banner-section-wrapper ${className}`}>
                        <div className="container">
                                <div className='banner-content'>
                                        {Array.isArray(images) && images.length > 0 ? (
                                                images.length > 1 ? (
                                                        <div className="images">
                                                                {images.map((src, index) => (
                                                                        <div key={index}>
                                                                                <img src={src.startsWith("http") ? src : `${import.meta.env.VITE_BACKEND_URL_FOR_IMAGES}${src}`} alt={mainTitle} loading="eager" />
                                                                        </div>
                                                                ))}
                                                        </div>
                                                ) : (
                                                        <div className="banner-image">
                                                                <div>
                                                                        <img src={images[0].startsWith("http") ? images[0] : `${import.meta.env.VITE_BACKEND_URL_FOR_IMAGES}${images[0]}`} alt={mainTitle} loading="eager" />
                                                                </div>
                                                        </div>
                                                )
                                        ) : null}

                                        <div className="banner-title text-center">
                                                <h1>{mainTitle}</h1>
                                                <p><strong style={{ marginRight: ".5rem" }}>Photo:</strong>
                                                        {caption}</p>
                                        </div>

                                        <div className="text-content text-center">
                                                <h2 className='subTitle'>{subTitle}</h2>
                                                <div className='banner-texts'>
                                                        {
                                                                safeDescriptions.map((item, index) => {
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
