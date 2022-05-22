import React, { useEffect, useState } from "react";
import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from "@web3-react/injected-connector";
import {
  URI_AVAILABLE,
  UserRejectedRequestError as UserRejectedRequestErrorWalletConnect,
  WalletConnectConnector
} from "@web3-react/walletconnect-connector";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import Scrollspy from "react-scrollspy";
import { NavLink } from "react-router-dom";
import Web3 from "web3";
import Scramble from "react-scramble";
import Modal from "react-modal";
import styled from 'styled-components';
import axios from 'axios';
import contractAddress from "../../abi/contractAddress";
import RouterContractAddress from "../../abi/routerContractAddress";
import ContractAbi from "../../abi/contractAbi.json";
import RouterContractAbi from "../../abi/routerContractAbi.json";
import { injected, walletconnect } from "../wallet/connectors";
import {
  setUserWalletAddress,
  setUserToken,
} from "../../features/user/userSlice";
import Params from "../../abi/chainParams";
import tokenInfo from "../../abi/tokenInfo";
import { auth } from "../../services/auth";
import metamaskicon from '../../assets/img/metamask.png';
import walleticon from '../../assets/img/walletConnectIcon.svg';
import { ReactComponent as Close } from '../../assets/img/x.svg';
import { useWyre } from "react-use-wyre";
import CryptoJS from 'crypto-js'
import WyreDialog from '../wyre/dialog'
/*

Account ID: AC_R4GBFYZH6NZ

TEST-AK-GCPJ4NEY-TB47PAF9-FHQNTYGB-WWBYUZEM
TEST-SK-PYUPQPFJ-93B6YVW4-9B9F9WJJ-C7F69AG8


// 
TEST-AK-BG2PTZHV-G2VJ6BYF-6DCF3CEB-DZAG47FQ
TEST-SK-NB7NMWDN-HV32UNGM-6LACZ9YL-BTJTZQLL

TEST-AK-H3PV7JWD-JEC3THUC-QB2U3UE6-9XZXNTTJ
TEST-SK-DJL2DLMT-4LHU4NLY-7T4HPCGD-99VHZ4XF
*/


const Header = () => {
  const [click, setClick] = useState(false);
  const handleClick = () => setClick(!click);
  const [navbar, setNavbar] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentTokenPriceInAvax, setCurrentTokenPriceInAvax] = useState(0);
  const [currentTokenPriceInUSDC, setCurrentTokenPriceInUSDC] = useState(0);
  const { connector, account, activate, deactivate, chainId, library, error } =
    useWeb3React();
  const [activatingConnector, setActivatingConnector] = useState();
  const { wyre } = useWyre();
  const [open, setOpen] = useState(false);


  const dispatch = useDispatch();
  const ContractAddress = contractAddress;
  let contractInstance;
  let routerContractInstance;

  useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined);
    }
  }, [activatingConnector, connector]);

  //OTC MODAL
  const [isOTCOpen, setIsOTCOpen] = useState(false);
  function toggleModalOTC() {
    setIsOTCOpen(!isOTCOpen);
  }





  const changeBackground = () => {

    if (window.scrollY >= 80) {
      setNavbar(true);
    } else {
      setNavbar(false);
    }
  };

  window.addEventListener("scroll", changeBackground);

  function getErrorMessage(error) {
    if (error instanceof NoEthereumProviderError) {
      return "No Ethereum browser extension detected, install MetaMask on desktop or visit from your wallet browser on mobile.";
    } else if (error instanceof UnsupportedChainIdError) {
      return "You're connected to an unsupported network.";
    } else if (
      error instanceof UserRejectedRequestErrorInjected ||
      error instanceof UserRejectedRequestErrorWalletConnect
    ) {
      return "Please authorize this website to access your Ethereum account.";
    } else {
      //console.error(error);
      //return "An unknown error occurred. Check the console for more details.";
    }
  }

  useEffect(async () => {
    if (window.ethereum) {
      if (window.ethereum.enable()) {
        if (localStorage.getItem("connector") == 'injected') {
          connectMetamaks();
        } else if (localStorage.getItem("connector") == 'walletConnect') {
          connectWalletConnect();
        }
      }
      
      /*window.ethereum.on('accountsChanged', function (accounts) {
       window.location.reload(); //DONT USE THIS IT CAUSES CRAZY REFRESH
      })*/

      //PRE-LIVE
      /*if (window.ethereum.chainId !== "0xa869") {
        setChainIdToAvax('0xa869'); //FUJI
      }*/

      //LIVE
      if (window.ethereum.chainId !== "0xa86a") {
        setChainIdToAvax("0xa86a"); //MAINNET
      }
    } else {
	    if (error instanceof NoEthereumProviderError || error instanceof UnsupportedChainIdError || error instanceof UserRejectedRequestErrorInjected || error instanceof UserRejectedRequestErrorWalletConnect) {
		    toast.error(getErrorMessage(error));
	    }
    }
    async function setChainIdToAvax(id) {
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: id }],
        });
      } catch (switchError) {
        if (switchError.code === 4902) {
          try {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [Params],
            });
          } catch (addError) {
            toast.error(getErrorMessage(error));
          }
        }
        // rejected
        if (switchError.code === 4001) {
        }
      }
    }
  }, []);

  useEffect(async () => {
    if (library && window.ethereum.chainId === "0xa86a") {
      contractInstance = new library.eth.Contract(ContractAbi, ContractAddress);
      routerContractInstance = new library.eth.Contract(
        RouterContractAbi,
        RouterContractAddress
      );

      const tokenPriceInAvaxWei = await getTokenPriceInAvax(
        "0x9ADCbba4b79eE5285E891512b44706F41F14CAFd",
        routerContractInstance
      );
      const tokenPriceInAvax = Web3.utils.fromWei(
        tokenPriceInAvaxWei.toString(),
        "ether"
      );
      setCurrentTokenPriceInAvax(Number(tokenPriceInAvax));

      let avaxPriceInUsdc = await getAVAXPriceInUSDC(
        "0x9ADCbba4b79eE5285E891512b44706F41F14CAFd",
        routerContractInstance
      );
      avaxPriceInUsdc = Number(avaxPriceInUsdc / 1000000);
      setCurrentTokenPriceInUSDC(
        ((avaxPriceInUsdc * tokenPriceInAvax) / 1 + 0.2).toFixed(1)
      );

      contractInstance.events
        .Transfer(
          {
            fromBlock: "latest",
          },
          function (error, event) {
            //console.log("event");
            //console.log(event);
          }
        )
        .on("data", async function (event) {
          //console.log(event) // same results as the optional callback above

          const tokenPriceInAvaxWei = await getTokenPriceInAvax(
            "0x9ADCbba4b79eE5285E891512b44706F41F14CAFd",
            routerContractInstance
          );
          const tokenPriceInAvax = Web3.utils.fromWei(
            tokenPriceInAvaxWei.toString(),
            "ether"
          );
          setCurrentTokenPriceInAvax(Number(tokenPriceInAvax));

          let avaxPriceInUsdc = await getAVAXPriceInUSDC(
            "0x9ADCbba4b79eE5285E891512b44706F41F14CAFd",
            routerContractInstance
          );
          avaxPriceInUsdc = Number(avaxPriceInUsdc / 1000000);
          setCurrentTokenPriceInUSDC(
            ((avaxPriceInUsdc * tokenPriceInAvax) / 1 + 0.2).toFixed(1)
          );
        })
        .on("changed", (event) => {
          //remove event from local database
          console.log(event); // same results as the optional callback above
        })
        .on("error", (error) => {
          console.log(error); // same results as the optional callback above
        });
    }
  }, [library, currentTokenPriceInAvax, currentTokenPriceInUSDC]);
  useEffect(() => {
    if (account !== undefined) {
      getCredentials();
    }
  }, [account]);
  const getCredentials = async () => {
    const res = await auth(account);
    dispatch(setUserToken(res.token));
    dispatch(setUserWalletAddress(account));
  };

  React.useEffect(() => {
    const logURI = (uri) => {
      console.log("WalletConnect URI", uri);
    };
    walletconnect.on(URI_AVAILABLE, logURI);

    return () => {
      walletconnect.off(URI_AVAILABLE, logURI);
    };
  }, []);

  async function connectMetamaks() {
    try {
      setActivatingConnector("injected");
      await activate(injected, undefined, true);
      setShowModal(false);
      localStorage.setItem("connector", "injected")
    } catch (ex) {
      toast.error("Please log into your wallet and select the Avalanche-C network");
    }
  }
  async function connectWalletConnect() {
    try {
      setActivatingConnector("walletconnect");
      await activate(walletconnect, undefined, true);
      setShowModal(false);
      localStorage.setItem("connector", "walletConnect")
    } catch (ex) {
      //toast.error("Unable to connect! Are you on the right network?");
    }
  }

  // use example: const price = await getTokenPrice("0x40064CE057Fb99a5c8e34F61365cC5996E59aB57");
  async function getTokenPriceInAvax(tokenAddress, routerInstance) {
    const path = await getPathTokenForAvax(tokenAddress);

    let price = await routerInstance.methods
      .getAmountsOut("1000000000000000000", path)
      .call()
      .then((result) => {
        return result;
      })
      .catch((e) => {
        return 0;
      });
    return price[1];
  }

  async function getAVAXPriceInUSDC(tokenAddress, routerInstance) {
    const path = await getPathAvaxForTokens(tokenAddress);

    let price = await routerInstance.methods
      .getAmountsOut("1000000000000000000", path)
      .call()
      .then((result) => {
        return result;
      })
      .catch((e) => {
        return 0;
      });
    return price[1];
  }

  async function getPathAvaxForTokens(tokenAddress) {
    return ["0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7", tokenAddress];
  }

  async function getPathTokenForAvax(tokenAddress) {
    return [tokenAddress, "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7"];
  }

  async function disconnect() {
    try {
      deactivate();
      localStorage.removeItem('connector');
    } catch (ex) {
      toast.error("Unable to disconnect!");
    }
  }

  const signature = (url, data) => {
    const dataToSign = url + data
    // @ts-ignore
    const token = CryptoJS.enc.Hex.stringify(CryptoJS.HmacSHA256(dataToSign.toString(CryptoJS.enc.Utf8), 'TEST-SK-DJL2DLMT-4LHU4NLY-7T4HPCGD-99VHZ4XF'))
    return token
  }

  const handleClose = (value) => {
    setOpen(false);
    console.log(value)
    clickBuyButton(value);
  };

  const clickBuyButton = async (value) => {

    const userData = {
      "referrerAccountId": "AC_R4GBFYZH6NZ",
      "dest": "ethereum:0xfbAA3c716dA6378A0840754185BFf6A05a20e1C8",
      "destCurrency": 'ETH',
      "paymentMethod": "debit-card",
      "amount": value.toString()
    }
    const {data} = await wyre(
      {
        url: "v3/orders/reserve",
        method: "post",
        data: {
          "referrerAccountId": "AC_R4GBFYZH6NZ",
          "dest": "ethereum:0xfbAA3c716dA6378A0840754185BFf6A05a20e1C8",
          "destCurrency": 'ETH',
          "paymentMethod": "debit-card",
          "amount": value.toString()
        },
        headers: {
          'X-Api-Signature': signature('https://api.testwyre.com/v3/orders/reserve', userData),
        }
      },
    );
    console.log(data)

    // eslint-disable-next-line no-undef
    var widget = new Wyre({
      env: 'test',
      reservation: data.reservation,
/*A reservation id is mandatory. In order for the widget to open properly you must use a new, unexpired reservation id. Reservation ids are only valid for 1 hour. A new reservation must also be made if a transaction fails.*/
      operation: {
          type: 'debitcard-hosted-dialog'
      }
    });
    console.log(widget)
    widget.open();
    widget.on("paymentSuccess", function (e) {
      console.log("paymentSuccess", e );
    });
    widget.on("close", function (e) {
      console.log("close", e );
    });
    widget.on("removeComponent", function (e) {
      console.log("close", e );
    });
  }

  const addTokenToMetamask = async () => {
    try {
      // wasAdded is a boolean. Like any RPC method, an error may be thrown.
      const wasAdded = await window.ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20", // Initially only supports ERC20, but eventually more!
          options: {
            address: tokenInfo.address, // The address that the token is at.
            symbol: tokenInfo.symbol, // A ticker symbol or shorthand, up to 5 chars.
            decimals: tokenInfo.decimals, // The number of decimals in the token
            image: tokenInfo.image, // A string url of the token logo
          },
        },
      });

      if (wasAdded) {
        console.log("Thanks for your interest!");
      } else {
        console.log("Your loss!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  return (
    <>
      <div className="shane_tm_topbar">
        <div className={navbar ? "topbar_inner opened" : "topbar_inner"}>
          <div className="logo">
            <NavLink to="/">
              <img
                src="/img/logo/projectx-logo-3-letters-onblack.png"
                alt="projectx"
                height="60"
              />
            </NavLink>
          </div>
          {/* End logo */}
          <div className="menu">
            <Scrollspy
              className="anchor_nav"
              items={[
                "price",
                "home",
                "nodes",
                "mission",
                "buy",
                "store",
                "xlist",
                "connect",
              ]}
              currentClassName="current"
              offset={-200}
            >
              <li>
                {/* {account && (
                  <a
                    href="https://coinmarketcap.com/currencies/project-x-nodes/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Scramble
                      autoStart
                      text={"$" + currentTokenPriceInUSDC.toString()}
                      steps={[
                        { roll: 5, action: "+", speed: "slow", type: "all" },
                        { action: "-", speed: "slow", type: "random" },
                      ]}
                    />
                  </a>
                )} */}
                <a
                  href="https://dexscreener.com/avalanche/0x9ADCbba4b79eE5285E891512b44706F41F14CAFd"
                  className="buy"
                  target="_blank"
                  rel="noreferrer"
                >
                  Chart
                </a>
              </li>
              <li className="hide">
                <a href="#home"></a>
              </li>
              <li>
                <a href="#nodes">
                  <Scramble
                    autoStart
                    text={"Nodes"}
                    steps={[
                      { roll: 10, action: "+", speed: "slow", type: "all" },
                      { action: "-", speed: "slow", type: "random" },
                    ]}
                  />
                </a>
              </li>
              <li>
                <a href="#mission">
                  <Scramble
                    autoStart
                    text={"Vision"}
                    steps={[
                      { roll: 15, action: "+", speed: "slow", type: "all" },
                      { action: "-", speed: "slow", type: "random" },
                    ]}
                  />
                </a>
              </li>
              <li>
                <a
                  href="https://projectxbook.gitbook.io/projectx/"
                  className="wp"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Scramble
                    autoStart
                    text={'WP'}
                    steps={[
                      { roll: 15, action: "+", speed: "slow", type: "all" },
                      { action: "-", speed: "slow", type: "random" },
                    ]}
                  />
                </a>
              </li>
              <li>
                {/* <a
                  href="https://app.bogged.finance/avax/swap?tokenIn=AVAX&tokenOut=0x9ADCbba4b79eE5285E891512b44706F41F14CAFd"
                  className="buy"
                  target="_blank"
                  rel="noreferrer"
                > */}
                <span
                  className="buy_btn"
                  onClick={handleClickOpen}
                >
                  <Scramble
                    autoStart
                    text={"Buy $PXT"}
                    steps={[
                      { roll: 20, action: "+", speed: "slow", type: "all" },
                      { action: "-", speed: "slow", type: "random" },
                    ]}
                  />
                </span>
                {/* </a> */}
              </li>
              <li>
                <a
                  href="https://projectxgaming.gg"
                  className="store"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Scramble
                    autoStart
                    text={"eSports"}
                    steps={[
                      { roll: 20, action: "+", speed: "slow", type: "all" },
                      { action: "-", speed: "slow", type: "random" },
                    ]}
                  />
                </a>
              </li>
              <li>
                <a
                  href="https://xlist.app"
                  className="xlist"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Scramble
                    autoStart
                    text={"X-LIST"}
                    steps={[
                      { roll: 20, action: "+", speed: "slow", type: "all" },
                      { action: "-", speed: "slow", type: "random" },
                    ]}
                  />
                </a>
              </li>
              {/*<li>
                <a
                  href="#"
                  className="buy"
                  rel="noreferrer"
                  onClick={toggleModalOTC}
                >
                  <Scramble
                    autoStart
                    text={"OTC"}
                    steps={[
                      { roll: 15, action: "+", speed: "slow", type: "all" },
                      { action: "-", speed: "slow", type: "random" },
                    ]}
                  />
                </a>
              </li>
              */}
              {/*<li>
                <a
                  className="buy"
                  rel="noreferrer"
                  onClick={addTokenToMetamask}
                >
                  ADD TO METAMASK
                </a>
              </li>*/}
              <li>
                <a
                  href="https://twitter.com/projectxfinance"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img
                    className="svg svg_white"
                    src={`/img/svg/social/twitter.svg`}
                    alt="twitter"
                  ></img>
                </a>
              </li>
              <li>
                <a
                  href="https://discord.gg/projectxfinance"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img
                    className="svg"
                    src={`/img/svg/social/discord.svg`}
                    alt="discord"
                  ></img>
                </a>
              </li>

              <li>
                {account ? (
                  <button className="btn" onClick={disconnect}>
                    {"0x..." + account.slice(37)}
                  </button>
                ) : (
                  <button className="btn" onClick={() => setShowModal(true)}>
                    <Scramble
                      autoStart
                      text={"Connect"}
                      steps={[
                        { roll: 20, action: "+", type: "all" },
                        { action: "-", speed: "slow", type: "random" },
                      ]}
                    />
                  </button>
                )}
              </li>
            </Scrollspy>
          </div>
          {/* End menu */}
        </div>
      </div>
      {/* End shane_tm_topbar */}

      {/* Start shane mobile menu */}
      <div className="shane_tm_mobile_menu">
        <div className="topbar_inner">
          <div className="container bigger">
            <div className="topbar_in">
              <div className="logo">
                <NavLink to="/">
                  <img
                    src="/img/logo/projectx-logo-3-letters-onwhite.png"
                    alt="projectx"
                    height="40"
                  />
                </NavLink>
              </div>
              {/* End logo */}
              <div className="my_trigger" onClick={handleClick}>
                <div
                  className={
                    click
                      ? "hamburger hamburger--collapse-r is-active"
                      : "hamburger"
                  }
                >
                  <div className="hamburger-box">
                    <div className="hamburger-inner"></div>
                  </div>
                </div>
                {/* End hamburger menu */}
              </div>
            </div>
          </div>
        </div>
        <div className={click ? "dropdown active" : "dropdown"}>
          <div className="container">
            <span className="close_menu" onClick={handleClick}>
              close
            </span>
            <div className="dropdown_inner">
              <ul className="anchor_nav">
                <li>
                  {/* {account && (
                    <a
                      target="_blank"
                      href="https://coinmarketcap.com/currencies/project-x-nodes/"
                      rel="noreferrer"
                    >
                      {"$" + currentTokenPriceInUSDC.toString(2)}
                    </a>
                  )} */}
                  <a
                    href="https://dexscreener.com/avalanche/0x9ADCbba4b79eE5285E891512b44706F41F14CAFd"
                    className="buy"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Chart
                  </a>
                </li>
                <li className="current">
                  <a href="#home" onClick={handleClick}>
                    Home
                  </a>
                </li>
                <li>
                  <a href="#nodes" onClick={handleClick}>
                    Nodes
                  </a>
                </li>
                <li>
                  <a href="#mission" onClick={handleClick}>
                    Vision
                  </a>
                </li>
                <li>
                  <a href="https://projectxbook.gitbook.io/projectx/" target="_blank" rel="noreferrer">
                    WP
                  </a>
                </li>
                <li>
                  <a
                    href="https://app.bogged.finance/avax/swap?tokenIn=AVAX&tokenOut=0x9ADCbba4b79eE5285E891512b44706F41F14CAFd"
                    className="buy"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Buy $PXT
                  </a>
                </li>
                <li>
                  <a
                    href="https://projectxgaming.gg"
                    className="store"
                    target="_blank"
                    rel="noreferrer"
                  >
                    ESPORTS
                  </a>
                </li>
                <li>
                  <a
                    href="https://xlist.app"
                    className="xlist"
                    target="_blank"
                    rel="noreferrer"
                  >
                    X-LIST
                  </a>
                </li>
                {/*<li>
                  <a
                    href="https://forms.gle/hf7QfxytJYRzYrn58"
                    className="otc"
                    target="_blank"
                    rel="noreferrer"
                  >
                    OTC
                  </a>
                </li>*/}
                <li>
                  <a
                    href="https://twitter.com/ProjectXNodes"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img
                      className="svg svg_white"
                      src={`/img/svg/social/twitter.svg`}
                      alt="twitter"
                    ></img>
                  </a>
                </li>
                <li>
                  <a
                    href="https://discord.com/invite/projectx"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img
                      className="svg"
                      src={`/img/svg/social/discord.svg`}
                      alt="discord"
                    ></img>
                  </a>
                </li>

                <li>
                  {account ? (
                    <button className="btn" onClick={disconnect}>
                      0x...{account.slice(37)}
                    </button>
                  ) : (
                    <button className="btn" onClick={() => setShowModal(true)}>
                      Connect
                    </button>
                  )}
                </li>

                {/*
                <li>
                	<br/>
                    <button
                      className="btn"
                    >
                      Connect soon
                    </button>
                </li>
                */}
              </ul>

              {/* End social share */}
            </div>
          </div>
          {/* End container */}
        </div>
      </div>
      {/* End shane mobile menu */}

      <Modal
        isOpen={showModal}
        onRequestClose={() => setShowModal(false)}
        contentLabel="Connect"
        className="custom-modal connect"
        overlayClassName="custom-overlay"
        closeTimeoutMS={500}
        minHeight={false}
        maxHeight={90}
      >
        <div className="shane_tm_modalbox_news connectWallet">
          <div onClick={() => setShowModal(false)} className="div-close">
            <Close />
          </div>
          <h3>Connect a wallet</h3>
          <div className="modal_body">
            <div className="inner_body">
              <button onClick={connectMetamaks}>
                <div className="metamask">
                  Metamask
                </div>
                <div className="icon">
                  <img height={20} width={20} src={metamaskicon} alt="connect with metamask" />
                </div>
              </button>
              <button onClick={connectWalletConnect}>
                <div className="walletconnect">
                  WalletConnect
                </div>
                <div className="icon">
                  <img height={20} width={20} src={walleticon} alt="connect with walletConnect" />
                </div>
              </button>
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isOTCOpen}
        onRequestClose={toggleModalOTC}
        contentLabel="OTC"
        className="custom-modal"
        overlayClassName="custom-overlay"
        closeTimeoutMS={500}
      >
        <div className="shane_tm_modalbox_news">
          <button className="close-modal" onClick={toggleModalOTC}>
            <img src="/img/svg/cancel.svg" alt="close icon" />
          </button>
          {/* End close modal */}
          <div className="box_inner">
            <div className="description_wrap scrollable">
              <div className="details">
                <h3 className="title">Over the Counter Requests</h3>
              </div>
              {/* End details */}
              <div className="description">
                <p>
                  Our OTC service is managed in our{" "}
                  <a href="https://discord.gg/a9bwpTCP" target="_blank">
                    Discord channel.
                  </a>
                  <br />
                  Please file a{" "}
                  <a href="https://discord.gg/a9bwpTCP" target="_blank">
                    service desk ticket with Discord
                  </a>{" "}
                  to submit your request.
                </p>
                <h5>How do OTC trades work?</h5>
                <p>There are 2 Methods for OTC:</p>
                <h5>Method 1: OTC Swap</h5>
                <p>
                  1. We will pair you with another individual who also wants to
                  make a buy or sell order at approximately the same $ amount.
                </p>
                <p>
                  2. To facilitate the OTC, we will be using the team wallet
                  (verify address before sending) which is currently owned by
                  the Team. The wallet and transactions will be shared and
                  publicly available to both parties.
                </p>
                <p>
                  3. The Buyer and seller will send agreed upon payment method
                  and amount to the team wallet (verify address before sending)
                  and a team member will distribute the respective funds to each
                  party.
                </p>
                <p>
                  Note: We are not charging any fees for facilitating this
                  transaction
                </p>
                <h5>Method 2: Team Swap</h5>
                <p>
                  We (X Oracle) will assist with buying or selling from our Team
                  Wallets.
                </p>
              </div>
              {/* End description */}
            </div>
          </div>
        </div>
      </Modal>
      <WyreDialog 
        open={open}
        onClose={handleClose}
      />
    </>
  );
};

export default Header;
