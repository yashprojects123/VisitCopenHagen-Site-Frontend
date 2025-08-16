import React from 'react'
import './ContentSectionWrapper.css'
const ContentSectionWrapper = ({className,title,description, children}) => {
  return (
    <section className={`content-section-wrapper ${className}`}>
        <div className="container">
                <div className="content text-center">
                        <h2 className='section-heading'>
                                { title }
                        </h2>
                        <p className='section-description'>
                                { description }
                        </p>
                        {
                                children
                        }
                </div>
        </div>
    </section>
  )
}

export default ContentSectionWrapper
