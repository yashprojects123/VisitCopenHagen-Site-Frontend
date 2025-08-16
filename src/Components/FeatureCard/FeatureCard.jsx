import React from 'react'
import './FeatureCard.css'

const FeatureCard = ({ image, title, caption, location }) => {
        return (
                <div className='feature-card'>
                        <img src={image} alt={title} />
                        <div className='title-and-caption-wrapper'>
                                <h2 className="title">{title}</h2>
                                <p className='caption'><strong style={{ marginRight: ".2rem" }}>Photo: </strong>{caption}</p>
                        </div>
                        
                        {location && <p className="location"><span style={{marginRight:".5rem"}}><svg xmlns="http://www.w3.org/2000/svg" version="1.1" x="0" y="0" width="8" className="" viewBox="0 0 488.1 617.5" xml:space="preserve"><path fill="#000000" d="M488.1 237.9c0 117.6-165.7 297-243.7 379.6C219.1 592.1 0 369.9 0 237.9 0 106 110.5 0 244.4 0c135.2 0 243.7 106 243.7 237.9zm-115-2.6c0-67.6-56.5-122.8-125.4-122.8-69.5 0-124.8 55.2-124.8 122.8 0 68.9 55.2 122.8 124.8 122.8 68.8.1 125.4-53.9 125.4-122.8z"></path></svg></span>{location}</p>}
                </div>
        )
}

export default FeatureCard
