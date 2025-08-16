import React from 'react'
import './StartExploreCard.css'

const StartExploreCard = ({image,title,description}) => {
  return (
    <div className='start-explore-card'>
        <div>
        <img className="scale-animate" src={image} alt={title}/>
        </div>
        <h3 className="title">{title}</h3>
        <p className="description">{description}</p>
    </div>
  )
}

export default StartExploreCard
