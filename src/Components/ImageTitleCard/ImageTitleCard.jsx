import React from 'react'
import './ImageTitleCard.css'
import { Link } from 'react-router-dom'

const ImageTitleCard = ({ image, title, link }) => {
        return (
                <div className='hobby-card-wrapper'>
                        
                        <div className='card-overlay'>
                                <Link to={link}>
                                <h3 className='title'>
                                        {title}
                                </h3>
                                </Link>
                        </div>
                        
                                <img src={image} alt="image" />
                </div>
        )
}

export default ImageTitleCard
