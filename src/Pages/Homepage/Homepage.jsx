import React, { lazy, Suspense } from 'react'

const Banner = lazy(() => import('../../Components/Banner/Banner'));
import image1 from "../../assets/images/homepage_banner_1.jpg";
import image2 from "../../assets/images/homepage_banner_2.jpg";
import TourInterestSection from '../../Components/TourInterestSection/TourInterestSection';
import StartExploringSection from '../../Components/StartExploringSection/StartExploringSection';
import CopenhagenSeasonSection from '../../Components/CopenhagenSeasonSection/CopenhagenSeasonSection';
import FeatureSection from '../../Components/FeatureSection/FeatureSection';
import SingleBanner from '../../Components/SingleBanner/SingleBanner';
import singleBannerImg from "../../assets/images/single-banner.jpg"

const Homepage = () => {
  let descriptionTexts = [
    `<p>The buzzing capital of Denmark mixes <a className="link-internal" data-entity-type="node" data-entity-uuid="3d82ffe2-afd3-46f9-9abe-ba9aa0159c3a" data-entity-substitution="canonical" title="Experience world-class modern architecture" href="/copenhagen/activities/experience-world-class-architecture-and-design">modern architecture</a> and <a className="link-internal" data-entity-type="node" data-entity-uuid="4afafbe9-735f-476f-bf98-9cdda4dd6740" data-entity-substitution="canonical" title="See and do" href="/copenhagen/activities/see-and-do">culture </a>with <a className="link-internal" data-entity-type="node" data-entity-uuid="8c5c1a23-45b4-496b-b270-b86745baac23" data-entity-substitution="canonical" title="A sustainability guide to Copenhagen" href="/copenhagen/activities/green-sustainability-guide">sustainable living</a>, <a className="link-internal" data-entity-type="node" data-entity-uuid="01642282-dd53-4812-99a4-cdb44c2429f7" data-entity-substitution="canonical" title="The royal and historic Copenhagen" href="/copenhagen/activities/royal-and-historic-copenhagen">royal history</a>, and a mouthwatering <a className="link-internal" data-entity-type="node" data-entity-uuid="88b8db61-c17f-43b4-a519-e9dc5ebe9884" data-entity-substitution="canonical" title="Restaurants in Copenhagen" href="/best-restaurants-copenhagen">restaurant scene</a>. Get to know the city, do your planning, and find all your questions answered right here.</p>`,
    `<p>To get a daily dose of inspiration, please follow <a className="link-external" target="_blank" rel="noopener" href="https://www.instagram.com/visitcopenhagen/">@VisitCopenhagen</a> on Instagram.</p>
                                                </div>`
  ];

  return (
    <div className="homepage-content">

      {/* Banner Section  */}

      <Suspense fallback={<div className="skeleton-banner">
        <div className="container">
          <div className='images'>
            <div className="skeleton-image" />
            <div className="skeleton-image" />
          </div>
        </div>
      </div>}>

        <Banner className="homepage-banner" mainTitle="Get to know Copenhagen, the capital of Denmark" caption="Mark Tanggaard & Astrid Maria Rasmussen"
          subTitle="Your guide to the perfect Copenhagen experience" descriptionTexts={descriptionTexts} image1={image1} image2={image2} />

      </Suspense>

      {/* Tour interest Section  */}
      <TourInterestSection />

      {/* Single Banner Section */}
      <SingleBanner image={singleBannerImg} title="CopenPay" subTitle="Copenhagen attractions reward conscious actions. Join the movement." />

      {/* Start Exploring Section */}
      <StartExploringSection />

      {/* Copenhagen Season section */}
      <CopenhagenSeasonSection />

      {/* Feature section */}
      <FeatureSection />

    </div>
  )
}

export default Homepage
