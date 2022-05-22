import React, {} from "react";
import Modal from "react-modal";

Modal.setAppElement("#root");

const NewsTwo = () => {

  function openStoryOne() {
    window.open(
      "https://projectxnodes.medium.com/welcome-to-project-x-9f176d7b760f",
      "_blank",
      "noopener,noreferrer"
    );
  }
  function openStoryTwo() {
    /*window.open(
      "https://twitter.com/avalancheavax?ref_src=twsrc%5Egoogle%7Ctwcamp%5Eserp%7Ctwgr%5Eauthor",
      "_blank",
      "noopener,noreferrer"
    );*/
  }
  function openStoryThree() {
    window.open(
      "https://www.assuredefi.io/projects/projectx/",
      "_blank",
      "noopener,noreferrer"
    );
  }
  
  
  return (
    <div className="shane_tm_section" id="news">
      <div className="shane_tm_news bg_white">
        <div className="container">
          {/* End shane_tm_title */}
          <div className="news_list">
            <ul>
              <li data-aos="fade-right" data-aos-duration="1200">
                <div className="list_inner">
                  <div className="image" onClick={openStoryOne}>
                    <img src="/img/placeholders/4-3.jpg" alt="thumb" />
                    <div
                      className="main"
                      style={{
                        backgroundImage: `url(${
                          process.env.PUBLIC_URL + "img/news/medium.jpg"
                        })`,
                      }}
                    ></div>
                  </div>
                  {/* End image */}

                  <div className="details" onClick={openStoryOne}>
                    <h3 className="title">Vision</h3>
                  </div>
                  {/* End details */}
                </div>
              </li>
              {/* End single blog */}

              <li
                data-aos="fade-right"
                data-aos-duration="1200"
                data-aos-delay="150"
              >
                <div className="list_inner">
                  <div className="image" onClick={openStoryTwo}>
                    <img src="/img/placeholders/4-3.jpg" alt="thumb" />
                    <div
                      className="main"
                      style={{
                        backgroundImage: `url(${
                          process.env.PUBLIC_URL + "img/news/newlogo.png"
                        })`,
                      }}
                    ></div>
                  </div>
                  {/* End image */}

                  <div className="details">
                    <h3 className="title" onClick={openStoryTwo}>
                      We've got a new logo!
                    </h3>
                  </div>
                  {/* End details */}
                </div>
                {/* End list inner */}
              </li>
              {/* End single blog */}

              <li
                data-aos="fade-right"
                data-aos-duration="1200"
                data-aos-delay="300"
              >
                <div className="list_inner">
                  <div className="image" onClick={openStoryThree}>
                    <img src="/img/placeholders/4-3.jpg" alt="thumb" />
                    <div
                      className="main"
                      style={{
                        backgroundImage: `url(${
                          process.env.PUBLIC_URL + "img/news/assure_kyc.png"
                        })`,
                      }}
                    ></div>
                  </div>

                  <div className="details">
                    <h3 className="title" onClick={openStoryThree}>
                      KYC Approved by Assure
                    </h3>
                  </div>
                </div>
              </li>

              {/* End single blog */}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsTwo;
