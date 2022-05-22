import React from "react";
import Header from "../../components/header/Header";
import Slider from "../../components/slider/SliderTwo";
import Nodes from "../../components/nodes/Nodes";
import Mission from "../../components/mission/Mission";
import News from "../../components/news/NewsTwo";
import Team from "../../components/team/Team";
import CallToAction from "../../components/calltoactions/CallToActionTwo";
import Footer from "../../components/footer/Footer";

const HomeTwo = () => {

	  return (
	    <div className="home-two">
	      <Header />
	      {/* End Header Section */}
	
	      <Slider />
	      {/* End Slider Section */}
	
	      <Nodes />
	      {/* End About Section */}
	
	      <Mission />
	      {/* End Portfolio Section */}
	      	      
	      <News />
	      {/* End Blog Section */}
	      
	      <Team/>
	      {/* End Blog Section */}
	
	      <CallToAction />
	      {/* End CallToAction */}
	
	      <Footer />
	      {/* End Footer Section */}
	    </div>
	  );
};

export default HomeTwo;