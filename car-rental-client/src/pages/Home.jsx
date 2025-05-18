import React from "react";
import Banner from "./Banner";
import WhyChooseUs from "./WhyChooseUs";
import RecentListings from "./RecentListings";
import AnimeSection from "./AnimeSection";

const Home = () => {
  return (
    <div>
      <Banner></Banner>
      <WhyChooseUs></WhyChooseUs>
      <RecentListings></RecentListings>
      <AnimeSection></AnimeSection>
    </div>
  );
};

export default Home;
