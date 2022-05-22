import React, { useEffect } from "react";
import Routes from "./router/Routes";
import ScrollToTop from "./components/ScrollToTop";
import { Toaster } from 'react-hot-toast';
import AOS from "aos";
import "aos/dist/aos.css";

const App = () => {
  useEffect(() => {
    AOS.init();
  }, []);
  return (
    <div className="shane_tm_all_wrap">
      <Toaster />
      <ScrollToTop />
      <Routes />
    </div>
  );
};

export default App;
