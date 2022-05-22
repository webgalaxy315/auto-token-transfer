import React from "react";

const Mission = () => {
  return (
    <>
      <div className="shane_tm_section" id="team">
      <div className="shane_tm_news bg_red">
      
        <div className="container">
         <h3 className="primarycolour_text">Team X</h3>
        
          {/* End shane_tm_title */}
          <div className="news_list">
            <ul>
              <li >
                <div className="list_inner nohighlight">
                  <img src="/img/team/ceo.jpg" alt="Amir / ProfessorX" />
                  <div className="details">
                    <h3 className="title">CEO: Amir / ProfessorX<br/>(UK)</h3>
                  </div>
                </div>
              </li>
              {/* End single blog */}

              <li data-aos="fade-right" data-aos-duration="1200" data-aos-delay="150">
                <div className="list_inner nohighlight">
                  <img src="/img/team/anon2.jpg" alt="thumb" />
                  <div className="details">
                    <h3 className="title">Team lead: Saladfingers<br/>(UK)</h3>
                  </div>
                </div>
              </li>
              {/* End single blog */}

              <li  data-aos="fade-right" data-aos-duration="1200" data-aos-delay="300">
                <div className="list_inner nohighlight">
                  <img src="/img/team/anon3.jpg" alt="RiddickX/Dicaprio" />
                  <div className="details">
                    <h3 className="title">Community lead: RiddickX/Dicaprio<br/>(Canada)</h3>
                  </div>
                </div>
              </li>

              {/* End single blog */}
            </ul>
          </div>
        </div>

        
        
        
        <div className="container">
          {/* End shane_tm_title */}
          <div className="news_list">
            <ul>
            
            <li  data-aos="fade-right" data-aos-duration="1200" data-aos-delay="300">
                <div className="list_inner nohighlight">
                  <img src="/img/team/paul.jpg" alt="Paul" />
                  <div className="details">
                    <h3 className="title">Tech lead: Paul<br/>(UK)</h3>
                  </div>
                </div>
              </li>

              {/* End single blog */}
              
              <li data-aos="fade-right" data-aos-duration="1200">
                <div className="list_inner nohighlight">
                  <img src="/img/team/paulo.jpg" alt="Paulo" />
                  <div className="details">
                    <h3 className="title">Lead developer: Paulo<br/>(Spain)</h3>
                  </div>
                </div>
              </li>
              {/* End single blog */}

              <li data-aos="fade-right" data-aos-duration="1200" data-aos-delay="150">
                <div className="list_inner nohighlight">
                  <img src="/img/team/dani.jpg" alt="Dani" />
                  <div className="details">
                    <h3 className="title">Co developer: Dani<br/>(Spain)</h3>
                  </div>
                </div>
              </li>
              {/* End single blog */}
              
            </ul>
          </div>
        </div>
      
       </div>
    </div>
    </>
  );
};

export default Mission;