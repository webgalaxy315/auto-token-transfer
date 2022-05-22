import React, {} from "react";

const CallToActionTwo = () => {
	
  var backgroundImageNumMin = 2;
  var backgroundImageNumMax = 5;
  var backgroundImageNum2 = parseInt(backgroundImageNumMin + (Math.random() * (backgroundImageNumMax-backgroundImageNumMin)));
  const backgroundImage = { backgroundImage: `url(${process.env.PUBLIC_URL + "img/slider/bgpic_" + backgroundImageNum2 + ".jpg"})` };
  
  return (
    <div className="shane_tm_section" id="contact">
      <div className="shane_tm_talk bg_image_props" style={backgroundImage}>
        {/* End background */}

        <div className="talk_inner">
          <div className="text" data-aos="fade-up" data-aos-duration="1200">
            <h3>Passive income for all entities</h3>
          </div>
        </div>
        {/* End talk_inner */}
      </div>
    </div>
  );
};

export default CallToActionTwo;
