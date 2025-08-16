import React from 'react'
import './FeatureSection.css'
import ContentSectionWrapper from '../ContentSectionWrapper/ContentSectionWrapper'
import featureImg1 from "../../assets/images/feature1.jpg"
import featureImg2 from "../../assets/images/feature2.jpg"
import featureImg3 from "../../assets/images/feature3.jpg"
import FeatureCard from '../FeatureCard/FeatureCard'

const FeatureSection = () => {
        const featureCardData = [
                {
                        title: "Safety in Copenhagen",
                        image: featureImg1,
                        caption: "Rasmus Hjortshøj",
                        id:1
                },
                  {
                        title: "Sustainability guide",
                        image: featureImg2,
                        caption: "Guiseppe Liverino",
                        id:2
                },
                  {
                        title: "World Capital of Architecture",
                        image: featureImg3,
                        caption: "VisitCopenhagen",
                        location: "The Tietgen Residence Hall",
                        id:3
                },

        ]
  return (
        <ContentSectionWrapper className="feature-section" title="It's in everything we do" description="Copenhagen strives to be a city that is not only a cool place to visit but also a great place to live. This is why we take sustainability, livability, and safety very seriously." >
               <div className='feature-list inner-container'>
                {
                        featureCardData.map(item =>{
                                return <FeatureCard key={item.id} image={item.image} title={item.title} caption={item.caption} location={item.location}/>
                        })
                }
                </div>
        </ContentSectionWrapper>
  )
}

export default FeatureSection
