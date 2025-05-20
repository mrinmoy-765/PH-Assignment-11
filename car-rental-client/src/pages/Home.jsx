import React from "react";
import Banner from "./Banner";
import WhyChooseUs from "./WhyChooseUs";
import RecentListings from "./RecentListings";
import AnimeSection from "./AnimeSection";
import Recharts from "./Recharts";

const Home = () => {
  return (
    <div>
      <Banner></Banner>
      <RecentListings></RecentListings>
      <Recharts></Recharts>
      <AnimeSection></AnimeSection>
      <WhyChooseUs></WhyChooseUs>
    </div>
  );
};

export default Home;
