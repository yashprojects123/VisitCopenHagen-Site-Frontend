import React from 'react'
import './CopenhagenSeasonSection.css'
import ContentSectionWrapper from '../ContentSectionWrapper/ContentSectionWrapper'
import summerImg from "../../assets/images/summer.jpg"
import winterImg from "../../assets/images/winter.JPG"
import springImg from "../../assets/images/spring.jpg"
import autumnImg from "../../assets/images/autumn.jpg"
import ImageTitleCard from '../ImageTitleCard/ImageTitleCard'
const CopenhagenSeasonSection = () => {
         const seasonCardData = [
                        {
                                text: "Spring",
                                imageSrc: springImg,
                                link: "/",
                                id: 1
                        },
                        {
                                text: "Summer",
                                imageSrc: summerImg,
                                link: "/",
                                id: 2
                        },
                        {
                                text: "Autumn",
                                imageSrc: autumnImg,
                                link: "/",
                                id: 3
                        },
                        {
                                text: "Winter",
                                imageSrc: winterImg,
                                link: "/",
                                id: 4
                        }
                ];
  return (
   <ContentSectionWrapper title="Copenhagen is buzzing all year around" description="Copenhagen is blessed with four very distinct seasons each with their own special flavour. The Copenhagen weather plays a big part in shaping these seasons, from the vibrant summer vibe to the colourful autumn, cosy winter, and beautiful spring. Copenhagen is incredible no matter the time of year." >
        {seasonCardData && <div className="season-cards image-cards inner-container">
                                {
                                        seasonCardData.map(item => {
                                                return <ImageTitleCard key={item.id} image={item.imageSrc} title={item.text} link={item.link} />
                                        })
                                }
                        </div>}
   </ContentSectionWrapper>
  )
}

export default CopenhagenSeasonSection
