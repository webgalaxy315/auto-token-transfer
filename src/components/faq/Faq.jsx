import React from "react";

const Mission = () => {
  return (
    <>
      <div className="shane_tm_section" id="faq">
        <div className="shane_tm_mission bg_red">
          <div className="container">
            <div className="about_inner">
            
              <div className="left">
                <div
                  className="shane_tm_title"
                  data-aos="fade-up"
                  data-aos-duration="1200"
                >
                  <h3 className="primarycolour_text">Vision</h3>
                  <p>
                   Reliable, trustworthy cryptocurrency-based passive income allowing anyone, anywhere with a smartphone or PC to build generational wealth.
                  </p>
                </div>
              </div>
              {/* End left */}

              <div className="right">
              <div
                  className="shane_tm_title"
                  data-aos="fade-up"
                  data-aos-duration="1200"
                >
                <h3 className="primarycolour_text">Mission</h3>
                <p>
                   Build, nurture, and operate a sustainable passive income cryptocurrency with an inclusive and ethical community of global supporters.
                </p>
                </div>
              
              </div>
              {/* End right */}
              
            </div>
          </div>
          {/* End container */}
        </div>
      </div>
    </>
  );
};

export default Mission;