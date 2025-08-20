import React, { lazy, Suspense, useEffect } from 'react'
const Banner = lazy(() => import('../../Components/Banner/Banner.jsx'));
import image1 from "../../assets/images/homepage_banner_1.jpg";
import image2 from "../../assets/images/homepage_banner_2.jpg";
import TourInterestSection from '../../Components/TourInterestSection/TourInterestSection.jsx';
import StartExploringSection from '../../Components/StartExploringSection/StartExploringSection.jsx';
import CopenhagenSeasonSection from '../../Components/CopenhagenSeasonSection/CopenhagenSeasonSection.jsx';
import FeatureSection from '../../Components/FeatureSection/FeatureSection.jsx';
import SingleBanner from '../../Components/SingleBanner/SingleBanner.jsx';
import singleBannerImg from "../../assets/images/single-banner.jpg"
import { publicApi } from '../../Services/axiosInstance.js';
import toast from 'react-hot-toast';
import { data } from 'react-router-dom';
const Homepage = () => {
  let [pageData, setPageData] = React.useState({
    loading: true,
    data: [],
    error:false
  });
  let [pageError, setPageError] = React.useState("");

  useEffect(() => {
      console.log("Page Data:", pageData);
  },[pageData]);
  useEffect(() => {
    
  async function fetchHomepageContent(){
    let response = await publicApi.get('/api/page/homepage');
    if(response.data.success){
      setPageData({
        loading: false,
        data: response.data.page,
        error: false
      });
      console.log(response.data.page);
      
      
      // Process the homepage content as needed
    } else {
      console.error("Error fetching homepage content:", response.data.message);
      setPageData({
        loading: false,
        data: null,
        error: true
      });
      setPageError(response.data.message);
    }
  }
fetchHomepageContent()
},[]);
const sections = Array.isArray(pageData?.data?.sections) ? pageData.data.sections : [];

  let descriptionTexts = [
    `<p>The buzzing capital of Denmark mixes <a className="link-internal" data-entity-type="node" data-entity-uuid="3d82ffe2-afd3-46f9-9abe-ba9aa0159c3a" data-entity-substitution="canonical" title="Experience world-class modern architecture" href="/copenhagen/activities/experience-world-class-architecture-and-design">modern architecture</a> and <a className="link-internal" data-entity-type="node" data-entity-uuid="4afafbe9-735f-476f-bf98-9cdda4dd6740" data-entity-substitution="canonical" title="See and do" href="/copenhagen/activities/see-and-do">culture </a>with <a className="link-internal" data-entity-type="node" data-entity-uuid="8c5c1a23-45b4-496b-b270-b86745baac23" data-entity-substitution="canonical" title="A sustainability guide to Copenhagen" href="/copenhagen/activities/green-sustainability-guide">sustainable living</a>, <a className="link-internal" data-entity-type="node" data-entity-uuid="01642282-dd53-4812-99a4-cdb44c2429f7" data-entity-substitution="canonical" title="The royal and historic Copenhagen" href="/copenhagen/activities/royal-and-historic-copenhagen">royal history</a>, and a mouthwatering <a className="link-internal" data-entity-type="node" data-entity-uuid="88b8db61-c17f-43b4-a519-e9dc5ebe9884" data-entity-substitution="canonical" title="Restaurants in Copenhagen" href="/best-restaurants-copenhagen">restaurant scene</a>. Get to know the city, do your planning, and find all your questions answered right here.</p>`,
    `<p>To get a daily dose of inspiration, please follow <a className="link-external" target="_blank" rel="noopener" href="https://www.instagram.com/visitcopenhagen/">@VisitCopenhagen</a> on Instagram.</p>
                                                </div>`
  ];

  return (
    <div className="homepage-content">
<div className="sections">
  {sections &&
    sections.map(({ type, data }, index) =>
      type === 'banner' ? (
        <Suspense
          key={index}
          fallback={
            <div className="skeleton-banner">
              <div className="container">
                <div className="images">
                  <div className="skeleton-image" />
                  <div className="skeleton-image" />
                </div>
              </div>
            </div>
          }
        >
          <Banner
            className="homepage-banner"
            mainTitle={data.topic}
            caption={data.caption}
            subTitle={data.subTopic}
            descriptionTexts={data.description}
            images={data.images.urls}
          />
        </Suspense>
      ):null
    )
  }
</div>
      
     

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

export default Homepage;
