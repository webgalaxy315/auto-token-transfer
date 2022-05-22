import ReactDOM from "react-dom";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Web3ReactProvider } from '@web3-react/core';
import store from './app/store';
import { Provider } from 'react-redux';
import "./assets/scss/style.scss";
import Web3 from 'web3';
import SendWyre from "react-use-wyre";

function getLibrary(provider, connector) {
  return new Web3(provider)
}

ReactDOM.render(
  <Web3ReactProvider getLibrary={getLibrary}>
    <Provider store={store}>
      <SendWyre
        apiKey='TEST-AK-H3PV7JWD-JEC3THUC-QB2U3UE6-9XZXNTTJ'
        secretKey='TEST-SK-DJL2DLMT-4LHU4NLY-7T4HPCGD-99VHZ4XF'
        partnerId='AC_R4GBFYZH6NZ'
        // baseUrl="https://api.testwyre.com"
      >
        <App />
      </SendWyre>
    </Provider>
  </Web3ReactProvider>,
  document.getElementById("root"),
  document.body.classList.add("loaded")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
