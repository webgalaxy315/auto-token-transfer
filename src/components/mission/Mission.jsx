import React from "react";

const Mission = () => {
  return (
    <>
      <div className="shane_tm_section" id="mission">
        <div className="shane_tm_mission bg_white">
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
                   Sustainable, trustworthy and transparent cryptocurrency-based passive income, allowing anyone to build supplementary wealth.
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
                   Design, build, and operate a healthy and sustainable passive income cryptocurrency, with a highly involved, inclusive and ethical community of global supporters... you, the <b>'X-Collective'</b>.
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