import React from "react";
import Banner from "./Banner";
import WhyChooseUs from "./WhyChooseUs";
import RecentListings from "./RecentListings";
import AnimeSection from "./AnimeSection";
import Recharts from "./Recharts";
import Offer from "./Offer";

const Home = () => {
  return (
    <div>
      <Banner></Banner>
      <RecentListings></RecentListings>
      <Recharts></Recharts>
      <Offer></Offer>
      <AnimeSection></AnimeSection>
      <WhyChooseUs></WhyChooseUs>
    </div>
  );
};

export default Home;
