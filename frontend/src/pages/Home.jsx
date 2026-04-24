import React from 'react';
import Hero from '../components/Hero';
import PurposeSection from '../components/PurposeSection';
import FeaturesSection from '../components/FeaturesSection';
import WorkflowSection from '../components/WorkflowSection';
import ManageSection from '../components/ManageSection';

const Home = () => {
  return (
    <>
      <Hero />
      <PurposeSection />
      <FeaturesSection />
      <WorkflowSection />
      <ManageSection />
    </>
  );
};

export default Home;