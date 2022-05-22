import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="shane_tm_intro shane_error_page">
      <div
        className="hero"
        style={{
          backgroundImage: `url(${
            process.env.PUBLIC_URL + "img/patterns/1.png"
          })`,
        }}
      >
        <div className="content">
          <h1>404!</h1>
          <p>The page you are looking for could not be found.</p>

          <Link className="white-fill-bg btn-outline" to="/">
            BACK TO HOME
          </Link>
          {/* End purchase_button */}
        </div>
      </div>
      {/* End .hero */}
    </div>
  );
};

export default NotFound;
