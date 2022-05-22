import React, { useState, useEffect } from "react";
import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";
import Scramble from "react-scramble";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

import { setUserWalletAddress } from "../../features/user/userSlice";
import ContractAbi from "../../abi/contractAbi.json";
import contractAddress from "../../abi/contractAddress";
import nodeRewardContract from "../../abi/nodeRewardContract";
import NODERewardManagementAbi from "../../abi/NODERewardManagement.json";
import { injected } from "../wallet/connectors";

const Slider = () => {
  const [totalNodesCreated, setTotalNodesCreated] = useState(0);
  const [myNodes, setMyNodes] = useState(0);
  const [myRewards, setMyRewards] = useState(0);
  const { account, activate, library } = useWeb3React();
  const [allowance, setAllowance] = useState(0);
  const [balance, setBalance] = useState(0);
  const [mintCount, setMintCount] = useState(1);
  const [isCreating, setIsCreating] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [projectAlive, setProjectAlive] = useState(false);
  const dispatch = useDispatch();

  let contractInstance;
  let NODERewardManagementInstance;

  useEffect(async () => {
    if (library) {
      contractInstance = new library.eth.Contract(ContractAbi, contractAddress);
      NODERewardManagementInstance = new library.eth.Contract(
        NODERewardManagementAbi,
        nodeRewardContract
      );
      getNodesInfo();
      await getBalance();
      await getAllowance();
      if (mintCount > 4) {
        //setShowInput(true);
      }
    }
  }, [library, myRewards, myNodes, mintCount, isCreating, balance, allowance]);

  const getAllowance = async () => {
    await contractInstance.methods
      .allowance(account, contractAddress)
      .call()
      .then((r) => setAllowance(r));
  };

  const OnClickApprove = async () => {
    await contractInstance.methods
      .approve(
        contractAddress,
        "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
      )
      .send({ from: account })
      .then((r) => {
        setAllowance(r);
        toast.success(
          "Congratulations! $PXT spend approved, now you can create nodes."
        );
      })
      .catch(() => {
        toast.error(
          "Unabled to approve the $PXT token spend. Are you on the right wallet & network?"
        );
      });
  };

  const getBalance = async () => {
    await contractInstance.methods
      .balanceOf(account)
      .call()
      .then((r) => {
        setBalance(r);
      })
      .catch(() => {
        toast.error(
          "Unabled to get $PXT token balance. Are you on the right wallet & network?"
        );
      });
  };

  const OnClickCreateNodeButton = async () => {
    let count;
    if (parseInt(mintCount) !== 0) {
      count = mintCount;
    } else {
      count = 1;
      setMintCount(1);
    }

    if (balance < 10) {
      toast.error(
        `Unabled to create node with ${balance} $PXT token balance. Are you on the right wallet & network?`
      );
    } else {
      setIsCreating(true);
      console.log(count);
      await contractInstance.methods
        .createNodeWithTokens(count)
        .send({ from: account })
        .then((createNodeResult) => {
          toast.success("Congratulations, node created!");
          setMintCount(1);
          setIsCreating(false);
          window.location.reload();
        })
        .catch((e) => {
          toast.error(
            "Unabled to create node! Check your balance and try again later."
          );
          setIsCreating(false);
        });
    }
  };

  const getNodesInfo = () => {
    contractInstance.methods
      .getTotalNodesCreated()
      .call()
      .then((totalNodes) => {
        setTotalNodesCreated(totalNodes);
      })
      .catch((e) => {
        console.log(e);
        toast.error("Unable to get totals nodes created.");
      });

    contractInstance.methods
      .getNodeNumberOf(account)
      .call()
      .then((myNodes) => {
        setMyNodes(myNodes);
      })
      .catch((e) => {
        toast.error(
          "Unable to get your totals nodes created. Are you on the right wallet & network?"
        );
      });
    if (myNodes > 0) {
      /*
      NODERewardManagementInstance.methods
        ._getRewardAmountOf(account)
        .call()
        .then((availableRewards) => {
          const r = Web3.utils.fromWei(availableRewards);
          setMyRewards(Number(r));
        })
        .catch((e) => {
          console.log({e});
          toast.error(
            "Unable to get your rewards. Are you on the right wallet & network?"
          );
        });

      */
    }
  };

  const subCount = () => {
    if (mintCount > 1) {
      setMintCount(parseInt(mintCount) - 1);
    }
  };

  const addCount = () => {
    if (parseInt(mintCount) + parseInt(myNodes) < 100) {
      setMintCount(parseInt(mintCount) + 1);
    }
  };

  async function connect() {
    try {
      await activate(injected, undefined, true);
      dispatch(setUserWalletAddress(account));
    } catch (ex) {
      toast.error("Unable to connect! Are you on the right network?");
    }
  }

  var backgroundImageNumMin = 2;
  var backgroundImageNumMax = 5;
  var backgroundImageNum1 = parseInt(
    backgroundImageNumMin +
      Math.random() * (backgroundImageNumMax - backgroundImageNumMin)
  );
  const backgroundImage = {
    backgroundImage: `url(${
      process.env.PUBLIC_URL +
      "img/slider/bgpic_" +
      backgroundImageNum1 +
      ".jpg"
    })`,
  };

  return (
    <div className="slider-two">
      <div className="shane_tm_hero" id="home" data-style="one">
        <div className="background">
          <div className="image herobackground" style={backgroundImage}>
          </div>
        </div>
        {/* End .background */}

        <div className="container">
          <div className="content">
            <img
              src="/img/logo/projectxlogo.png"
              id="slideslogo"
              alt="ProjectX"
            />
            
            {/*<div className="name_wrap">
            	<h3>
            	<span className="transparent"><Scramble
                  autoStart
                  text="Waiting "
                  steps={[
                    { roll: 30, action: "+", speed: "slow", type: "all" },
                    { action: "-", speed: "slow", type: "random" },
                  ]}
                /></span><br/>
            	<Scramble
                  autoStart
                  text="for signal"
                  steps={[
                    { roll: 30, action: "+", speed: "slow", type: "all" },
                    { action: "-", speed: "slow", type: "random" },
                  ]}
                />
                </h3>
                <span className="nodecreatenotice uppercase">
                     <Scramble
	                  autoStart
	                  text="Check for time synchronization"
	                  steps={[
	                    { roll: 30, action: "+", speed: "slow", type: "all" },
	                    { action: "-", speed: "slow", type: "random" },
	                  ]}
	                />
                </span>
            </div>*/}
            
            
            	<div className="name_wrap">
	              <h3>
	                <Scramble
	                  autoStart
	                  text={myNodes + " / "}
	                  steps={[
	                    { roll: 25, action: "+", speed: "slow", type: "all" },
	                    { action: "-", speed: "slow", type: "random" },
	                  ]}
	                />
	                <span className="transparent">
	                  <Scramble
	                    autoStart
	                    text="100"
	                    steps={[
	                      { roll: 25, action: "+", speed: "slow", type: "all" },
	                      { action: "-", speed: "slow", type: "random" },
	                    ]}
	                  />
	                </span>
	              </h3>
	            </div>
	            
	            <div className="job_wrap">
	              <span className="job">
	                <Scramble
	                  autoStart
	                  text={totalNodesCreated + " universal nodes initialized"}
	                  steps={[
	                    { roll: 30, action: "+", speed: "slow", type: "all" },
	                    { action: "-", speed: "slow", type: "random" },
	                  ]}
	                />
	              </span>
	              <div className="createnodes">
	                {parseInt(allowance) === 0 && account && (
		              <>
	                  <button
	                    type="button"
	                    disabled={allowance === 0}
	                    onClick={OnClickApprove}
	                    className="glow-on-hover"
	                  >
	                    Approve
	                  </button>
	                  <span className="nodecreatenotice">
	                     <Scramble
		                  autoStart
		                  text="Phase 2: You need to approve the contract"
		                  steps={[
		                    { roll: 30, action: "+", speed: "slow", type: "all" },
		                    { action: "-", speed: "slow", type: "random" },
		                  ]}
		                />
	                  </span>
	                  </>
	                )}
	
	                {parseInt(allowance) > 0 && account && (
	                  <>
	                    <span className="nodecreatecontainer">
	                      {parseInt(allowance) > 0 && !showInput && (
	                        <button className="minus" onClick={subCount}>
	                          -
	                        </button>
	                      )}
	                      <button
	                        onClick={OnClickCreateNodeButton}
	                        disabled={allowance === 0 || isCreating}
	                        className="glow-on-hover"
	                      >
	                        {isCreating ? (
	                          <span>Creating, check wallet...</span>
	                        ) : (
	                          <span>
	                            Create <b>{mintCount}</b> node
	                            {mintCount > 1 && <span>s</span>}
	                          </span>
	                        )}
	                      </button>
	                      {parseInt(allowance) > 0 && !showInput && (
	                        <button className="glow-on-hover plus" onClick={addCount}>
	                          +
	                        </button>
	                      )}
	                      {parseInt(allowance) > 0 && !showInput && (
	                      <span className="nodecreatenotice">
		                     <Scramble
			                  autoStart
			                  text="Phase 3: You can now create nodes for 11 $PXT (You get 1 back instantly!)"
			                  steps={[
			                    { roll: 30, action: "+", speed: "slow", type: "all" },
			                    { action: "-", speed: "slow", type: "random" },
			                  ]}
			                />
		                  </span>
		                  )}
	                    </span>
	                  </>
	                )}
	                {parseInt(allowance) > 0 && showInput && (
	                  <span className="col input-box">
	                    <input
	                      name="name"
	                      required
	                      type="number"
	                      min="1"
	                      autoFocus
	                      value={mintCount}
	                      className="form-control nodecreatecount"
	                      onChange={(e) => setMintCount(e.target.value)}
	                    />
	                    <span className="nodecreatenotice">
	                      Hey there Mr Whale! Enter your desired node count ;)
	                    </span>
	                  </span>
	                )}
	                {!account && (
	                  <>
	                  <button className="glow-on-hover" onClick={connect}>
	                    <Scramble
	                      autoStart
	                      text="Connect"
	                      steps={[
	                        { roll: 25, action: "+", speed: "slow", type: "all" },
	                        { action: "-", speed: "slow", type: "random" },
	                      ]}
	                    />
	                  </button>
	                  <span className="nodecreatenotice">
	                     <Scramble
		                  autoStart
		                  text="Phase 1: You need to connect your wallet"
		                  steps={[
		                    { roll: 25, action: "+", speed: "slow", type: "all" },
		                    { action: "-", speed: "slow", type: "random" },
		                  ]}
		                />
	                  </span>
	                  </>
	                )}
	              </div>
              </div>
          
            

            <div className="shane_tm_down loaded">
              <div className="line_wrapper">
                <div className="line"></div>
              </div>
            </div>
            
            
            
            
          </div>
          {/* End .content */}
          
        </div>
        {/* End .container */}
      </div>
    </div>
  );
};

export default Slider;
