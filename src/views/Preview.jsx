import React from "react";
import { Link } from "react-router-dom";

const Preview = () => {
  return (
    <div className="shane_tm_all_wrap">
      <div className="shane_tm_intro">
        <div className="demo_list" id="demos">
          <div className="container">
            <div className="intro_title">
              <h3>All Ready Demos</h3>
            </div>
            <div className="inner">
              <ul>
                <li data-aos="fade-up" data-aos-duration="1200">
                  <div className="list_inner">
                    <img src="img/intro/1.jpg" alt="demo preview" />
                    <h3>Main Demo (No Animation)</h3>
                    <Link
                      to="/home-one"
                      className="shane_tm_full_link"
                      target="_blank"
                      rel="noreferrer"
                    ></Link>
                  </div>
                </li>
                {/* End list_inner */}

                <li
                  data-aos="fade-up"
                  data-aos-duration="1200"
                  data-aos-detaly="100"
                >
                  <div className="list_inner">
                    <img src="img/intro/2.jpg" alt="demo preview" />
                    <h3>Creative Portfolio</h3>
                    <Link
                      to="/home-two"
                      className="shane_tm_full_link"
                      target="_blank"
                      rel="noreferrer"
                    ></Link>
                  </div>
                </li>
                {/* End list_inner */}

                <li
                  data-aos="fade-up"
                  data-aos-duration="1200"
                  data-aos-detaly="150"
                >
                  <div className="list_inner">
                    <img src="img/intro/3.jpg" alt="demo preview" />
                    <h3>Modern Portfolio</h3>
                    <Link
                      to="/home-three"
                      className="shane_tm_full_link"
                      target="_blank"
                      rel="noreferrer"
                    ></Link>
                  </div>
                </li>
                {/* End list_inner */}

                <li
                  data-aos="fade-up"
                  data-aos-duration="1200"
                  data-aos-detaly="200"
                >
                  <div className="list_inner">
                    <img src="img/intro/4.jpg" alt="demo preview" />
                    <h3>Creative Portfolio 02</h3>
                    <Link
                      to="/home-four"
                      className="shane_tm_full_link"
                      target="_blank"
                      rel="noreferrer"
                    ></Link>
                  </div>
                </li>
                {/* End list_inner */}
              </ul>
            </div>
          </div>
        </div>

        <div className="shane_tm_feature section-separaton">
          <div className="intro_title">
            <h3>Shane All Features</h3>
          </div>
          {/* End .intro_title */}
          <div className="container fluid">
            <div className="row">
              <div
                className="col-3"
                data-aos="fade-up"
                data-aos-duration="1200"
              >
                <div className="single-features">
                  <img src="img/svg/preview/1.svg" alt="icon" />
                  <h4>Latest React 17.0.2</h4>
                  <p>
                    We used latest react vertion ^17.0.2. Its a awesome design
                    made by react.
                  </p>
                </div>
              </div>
              {/* End .single-features */}
              <div
                className="col-3"
                data-aos="fade-up"
                data-aos-duration="1200"
                data-aos-delay="50"
              >
                <div className="single-features">
                  <img src="img/svg/preview/2.svg" alt="icon" />
                  <h4>No Bootstrap!</h4>
                  <p>
                    Made this template no framework dependency.Usage 100% hand
                    made pure CSS.
                  </p>
                </div>
              </div>
              {/* End .single-features */}
              <div
                className="col-3"
                data-aos="fade-up"
                data-aos-duration="1200"
                data-aos-delay="100"
              >
                <div className="single-features">
                  <img src="img/svg/preview/3.svg" alt="icon" />
                  <h4>Perfect Responsive</h4>
                  <p>
                    Shane is fit for all devices like mobile,tablet,desktop even
                    larger device too.
                  </p>
                </div>
              </div>
              {/* End .single-features */}
              <div
                className="col-3"
                data-aos="fade-up"
                data-aos-duration="1200"
                data-aos-delay="150"
              >
                <div className="single-features">
                  <img src="img/svg/preview/4.svg" alt="icon" />
                  <h4>Well Documented</h4>
                  <p>
                    Shane documented organized way and its customization
                    instruction easy for all.
                  </p>
                </div>
              </div>
              {/* End .single-features */}
              <div
                className="col-3"
                data-aos="fade-up"
                data-aos-duration="1200"
              >
                <div className="single-features">
                  <img src="img/svg/preview/5.svg" alt="icon" />
                  <h4>Sass Available</h4>
                  <p>
                    Shane tamplate has Sass available for css. You can Change
                    css by sass
                  </p>
                </div>
              </div>
              {/* End .single-features */}
              <div
                className="col-3"
                data-aos="fade-up"
                data-aos-duration="1200"
                data-aos-delay="50"
              >
                <div className="single-features">
                  <img src="img/svg/preview/6.svg" alt="icon" />
                  <h4>Fast Loading Speed</h4>
                  <p>
                    Shane is faster loading speed.It's create your template so
                    much faster.
                  </p>
                </div>
              </div>
              {/* End .single-features */}
              <div
                className="col-3"
                data-aos="fade-up"
                data-aos-duration="1200"
                data-aos-delay="100"
              >
                <div className="single-features">
                  <img src="img/svg/preview/7.svg" alt="icon" />
                  <h4>Modern Design</h4>
                  <p>
                    It's followed with modern, creative and trendy design for
                    Creative Organization.
                  </p>
                </div>
              </div>
              {/* End .single-features */}
              <div
                className="col-3"
                data-aos="fade-up"
                data-aos-duration="1200"
                data-aos-delay="150"
              >
                <div className="single-features">
                  <img src="img/svg/preview/8.svg" alt="icon" />
                  <h4>24 Support System</h4>
                  <p>
                    We are provide 24 hours support for all clients.You can
                    purchase without hesitation.
                  </p>
                </div>
              </div>
              {/* End .single-features */}
            </div>
          </div>
        </div>
      </div>
      {/* End shame_tm_intro */}

      <div className="shane_tm_section">
        <div
          className="shane_purchase_banner"
          style={{
            backgroundImage: `url(${
              process.env.PUBLIC_URL + "img/patterns/1.png"
            })`,
          }}
        >
          <div className="container">
            <h2 data-aos="fade-up" data-aos-duration="1200">
              Let's go to Purchase
            </h2>
            <div
              className="shane_tm_button"
              data-aos="fade-up"
              data-aos-duration="1200"
              data-aos-delay="100"
            >
              <a
                href="https://themeforest.net/item/shane-react-personal-portfolio-template/32642263"
                rel="noopener noreferrer"
                target="_blank"
              >
                PURCHASE NOW
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="shane_tm_section">
        <div className="shane_tm_copyright">
          <div className="container">
            <div className="inner">
              <p>
                &copy; {new Date().getFullYear()} by{" "}
                <a
                  href="https://themeforest.net/user/ib-themes"
                  target="_blank"
                  rel="noreferrer"
                >
                  ib-themes
                </a>
                . All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
      {/*  /COPYRIGHT */}
    </div>
  );
};

export default Preview;
