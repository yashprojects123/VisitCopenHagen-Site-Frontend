import React from 'react'
import './TourInterestSection.css'
import ContentSectionWrapper from '../ContentSectionWrapper/ContentSectionWrapper'
import choiceImage1 from "../../assets/images/choice1.jpg";
import choiceImage2 from "../../assets/images/choice2.jpg";
import choiceImage3 from "../../assets/images/choice3.jpg";
import choiceImage4 from "../../assets/images/choice4.jpg";
import ImageTitleCard from '../ImageTitleCard/ImageTitleCard';


const TourInterestSection = () => {
        const choices = [
                {
                        text: "I'm considering travelling to Copenhagen",
                        imageSrc: choiceImage1,
                        link: "/",
                        id: 1
                },
                {
                        text: "I'm travel planning",
                        imageSrc: choiceImage2,
                        link: "/",
                        id: 2
                },
                {
                        text: "I want inspiration for today",
                        imageSrc: choiceImage3,
                        link: "/",
                        id: 3
                },
                {
                        text: "I want to check out events",
                        imageSrc: choiceImage4,
                        link: "/",
                        id: 4
                }
        ]

        return (
                <ContentSectionWrapper className="tour-interest-section" title="Tell us what you're looking for" description="Are you already in Copenhagen? Are you planning your trip or looking to get inspired to what to do today? We got you covered.">
                        {choices && <div className="image-cards inner-container">
                                {
                                        choices.map(item => {
                                                return <ImageTitleCard key={item.id} image={item.imageSrc} title={item.text} link={item.link} />
                                        })
                                }
                        </div>}

                </ContentSectionWrapper>
        )
}

export default TourInterestSection
