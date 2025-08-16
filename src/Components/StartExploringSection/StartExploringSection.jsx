import React from 'react'
import './StartExploringSection.css'
import ContentSectionWrapper from '../ContentSectionWrapper/ContentSectionWrapper'
import img1 from '../../assets/images/explore1.jpg'
import img2 from '../../assets/images/explore2.jpg'
import img3 from '../../assets/images/explore3.jpg'
import StartExploreCard from '../StartExploreCard/StartExploreCard'
const StartExploringSection = () => {
        let exploringData = [
                {
                        image: img1,
                        title: "The essential guide: Summer in Copenhagen",
                        description: "Spending summer in Copenhagen? Enjoy the long days and bright summer nights by hanging out with the locals in some of the many parks, urban spaces and city beaches in Copenhagen or join in the variety of activities offered along the harbour front.",
                        id: 1
                },
                {
                        image: img2,
                        title: "Editor's Choice",
                        description: "In the Copenhagen Unfolded newsletter, the editors at VisitCopenhagen take turns recommending their personal activities for the coming month. Discover cultural activities, food, events, and insights and go beneath the surface with Copenhagener local's point of view"
                        , id: 2
                },
                {
                        image: img3,
                        title: "Podcast: Insider's guide to Copenhagen",
                        description: "Whether you're a Copenhagen local or visiting, you will discover plenty of new spots in this podcast! Radio and television host Esben Bjerre joins different Copenhageners in their favourite activities, places to eat, where they bring their friends, and many hidden gems around the city."

                        , id: 3
                }
        ]
        return (
                <ContentSectionWrapper className="start-exploring-section" title="Start exploring" description="Any season is a good season to explore Copenhagen, whether on foot, on bike or sailing your own electric boat through the canals. " >
                        <div className="explore-cards inner-container">
                                {
                                        exploringData.map((item) => {
                                                return <StartExploreCard key={item.id} image={item.image} title={item.title} description={item.description} />
                                        })
                                }
                        </div>
                </ContentSectionWrapper>
        )
}

export default StartExploringSection
