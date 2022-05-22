import React, { useEffect, useState, useContext } from "react";
import ReactDOM from "react-dom";
import ContractAbi from "../../abi/contractAbi.json";
import ContractAbiOld from "../../abi/contractAbiOld.json";
import contractAddress from "../../abi/contractAddress";
import contractAddressOld from "../../abi/contractAddressOld";
import nodeRewardContract from "../../abi/nodeRewardContract";
import nodeRewardContractOld from "../../abi/nodeRewardContractOld";
import NodeManagementAbiOld from "../../abi/NODERewardManagementOld.json";
import { useWeb3React } from "@web3-react/core";
import toast from "react-hot-toast";
import NodeManagementAbi from "../../abi/NODERewardManagement.json";
import Web3 from "web3";
import axios from "axios";
import { ReactReduxContext } from "react-redux";
import { getNodeList } from "../../services/list";
import { getNodeStatus } from "../../services/node_status";
import { formatEther, parseEther } from "ethers/lib/utils";
import { BigNumber } from "@ethersproject/bignumber";
// import NodeList from '../../assets/nodes.json';
import NameList from "../../assets/nebulas_shuffled.json";


//RPC
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css"; // optional
import { CopyToClipboard } from "react-copy-to-clipboard";
import Modal from "react-modal";

let hasRunNodeInfo = false;
//const dateObject = new Date();

const AboutTwo = () => {
  const { account, library } = useWeb3React();
  const [isLoading, setIsLoading] = useState(false);
  const [pendingRewards, setPendingRewards] = useState(0);
  const [totalNodesCanCompound, setTotalNodesCanCompound] = useState(0);
  const [claimableNumberOfNodes, setClaimableNumberOfNodes] = useState(0);
  const [myNodes, setMyNodes] = useState(0);
  const [myOldNodes, setMyOldNodes] = useState(0);
  const [payMonth, setPayMonth] = useState(1);
  const [compoundAmount, setCompoundAmount] = useState(1);
  const [totalPending, setTotalPending] = useState(0);
  const [canClaimAll, setCanClaimAll] = useState(false);
  const [oldRewards, setOldRewards] = useState("");
  // v2.1 migration states, remove after a while
  const [migratedNodes, setMigratedNodes] = useState(true);
  const [migratedTokens, setMigratedTokens] = useState(true);
  const [migratedRewards, setMigratedRewards] = useState(true);
  const [rows, setRows] = useState([]);
  const { store } = useContext(ReactReduxContext);
  const [checked, setChecked] = useState([]);
  let NodeManagementInstance;
  let NodeManagementInstanceOld;
  let contractInstance;
  let contractInstanceOld;
  const dateObject = new Date();
  let lastTime = new Date();
  //RPC MODAL
  const [isRPCOpen, setIsRPCOpen] = useState(false);
  function toggleModalRPC() {
    setIsRPCOpen(!isRPCOpen);
  }

  //SETTING
  const dailyReward = 0.17;
  const pxtPerNodeCreate = 10;

  useEffect(async () => {
    if (library) {
      contractInstance = new library.eth.Contract(ContractAbi, contractAddress);
      contractInstanceOld = new library.eth.Contract(
        ContractAbiOld,
        contractAddressOld
      );
      NodeManagementInstance = new library.eth.Contract(
        NodeManagementAbi,
        nodeRewardContract
      );
      NodeManagementInstanceOld = new library.eth.Contract(
        NodeManagementAbiOld,
        nodeRewardContractOld
      );
      await getNodesInfo();
      await getMigrationInfo();
    }
  }, [
    library,
    isLoading,
    pendingRewards,
    totalNodesCanCompound,
    myNodes,
    myOldNodes,
    canClaimAll,
    rows,
    claimableNumberOfNodes,
    totalPending,
    compoundAmount,
    payMonth,
    checked,
    migratedNodes,
    migratedTokens,
    migratedRewards,
    oldRewards,
  ]);

  const OnClickPayButton = async () => {
    const nodesUser = await NodeManagementInstance.methods
      .nodes(account)
      .call()
      .catch((e) => {
        console.log({ e });
      });
    const tierNodes = await NodeManagementInstance.methods.tiers().call();
    console.log(tierNodes);
    const nodesMantPrices = [];
    if (checked.length > 0) {
      for (let i = 0; i < checked.length; i++) {
        await NodeManagementInstance.methods
          .getAmountOut(
            (
              (tierNodes.find(
                (e) =>
                  e.id === nodesUser.find((e) => e.id === checked[i]).tierIndex
              ).price *
                3) /
              100
            ).toString()
          )
          .call()
          .then((e) => nodesMantPrices.push(e));
      }
    } else {
      for (let i = 0; i < nodesUser.length; i++) {
        await NodeManagementInstance.methods
          .getAmountOut(
            (
              (tierNodes.find((e) => e.id === nodesUser[i].tierIndex).price *
                3) /
              100
            ).toString()
          )
          .call()
          .then((e) => nodesMantPrices.push(e));
      }
    }

    let val = 0;
    nodesMantPrices.map((e) => {
      return (val += parseInt(e));
    });
    val *= payMonth;
    await NodeManagementInstance.methods
      .pay(payMonth, checked.length > 0 ? checked : [])
      .send({ from: account, value: val })
      .then(() => {
        toast.success("Congratulations! Nodes payed successfully.");
        setPayMonth(1);
      })
      .catch((e) => {
        //console.log({ e });
        if (pendingRewards > 0) toast.error("Unable to pay your nodes.");
      });
  };
  const handleCheck = (e) => {
    const id = e.target.value;
    const chk = e.target.checked;
    const pos = checked.indexOf(id);
    if (chk && pos == -1) {
      checked.push(id);
    } else if (!chk && pos > -1) {
      checked.splice(pos, 1);
    }
    setChecked([...checked]);
    //console.log(checked);
  };

  const getNodesInfo = async () => {
    let numberOfNodes = await NodeManagementInstance.methods
      .countOfUser(account)
      .call()
      .then((res) => {
        return res;
      })
      .catch((e) => {
        console.log({ e });
        return false;
      });
    const tierNodes = await NodeManagementInstance.methods
      .tiers()
      .call()
      .catch((e) => {
        console.log({ e });
      });
    if (numberOfNodes == 0) {
      return false;
    }

    if (!hasRunNodeInfo) {
      hasRunNodeInfo = true;
      //let RunNodeInfoAt = dateObject.getMilliseconds();

      //Capture any URL Actions
      const queryParams = new URLSearchParams(window.location.search);
      const action = queryParams.get("action");
      if (action === "migrateNodes") {
        OnClickMigrateNodesButton();
      }

      if (numberOfNodes > 0) {
        setMyNodes(numberOfNodes);
        let totalClaimableNodes = 0;
        var myClaimableSum = 0;
        const nodeElement = [];

        //GET CLAIMABLE
        const nodesUser = await NodeManagementInstance.methods
          .nodes(account)
          .call()
          .catch((e) => {
            console.log({ e });
          });
        await NodeManagementInstance.methods
          .oldRewardsOfUser(account)
          .call()
          .then((e) => setOldRewards(formatEther(e)))
          .catch((e) => {
            console.log({ e });
          });
        const token = store.getState().user.userToken;
        const NodesApi = await getNodeList(token);

        let claimable;
        let oldRewards;
        let claimableParsed;
        let oldRewardsParsed;

        //console.log(NodesApi);
        if (nodesUser) {
          claimable = await NodeManagementInstance.methods
            .claimable(account)
            .call()
            .then((res) => {
              return res;
            })
            .catch((e) => {
              console.log({ e });
            });

          oldRewards = await NodeManagementInstance.methods
            .oldRewardsOfUser(account)
            .call()
            .then((res) => {
              return res;
            })
            .catch((e) => {
              console.log({ e });
            });
          if (oldRewards == 0) {
            //setMigratedRewards(false); //NEW METHOD
          }

          console.log({
            claimable,
            oldRewards,
          });

          //DISPLAY REWARDS TOTAL
          claimableParsed = Web3.utils.fromWei(
            //parseInt(myClaimableSum).toString(),
            parseInt(claimable).toString(),
            "ether"
          );

          oldRewardsParsed = Web3.utils.fromWei(
            //parseInt(myClaimableSum).toString(),
            parseInt(oldRewards).toString(),
            "ether"
          );

          let claimeableAmount = (
            (Number(claimableParsed) + Number(oldRewardsParsed)) /
            nodesUser.length
          ).toFixed(3);

          /*
            const tiers = await NodeManagementInstance.methods
              .tiers()
              .call()
              .catch((e) => {
                console.log({ e });
              });
              */

          for (let i = 0; i < nodesUser.length; i++) {
            let node_status = false;
            let rpcURL = "RPC URL coming soon for this node";
            if (NodesApi[i]) {
              node_status = true; //await getNodeStatus(NodesApi[i].rpc_url);
              rpcURL =
                "https://avax-rpc.projectx.financial/" + NodesApi[i].rpc_url;
            }

            // YES --- now - nodeLastClaimedTime * tiers[0].rewardsPerTime
            // NO  --- now - nodeLastClaimedTime * 0.8

            // (result / tiers claim interval) + nodeLeftOver

            //nodesUser[0].leftover = oldRewards;

            /*
            // last version
            let claimeableAmount = (((new Date().getTime() / 1000 - parseInt(nodesUser[i].claimedTime)) * (parseInt(nodesUser[i].tierIndex) === 0
              ? tiers[0].rewardsPerTime
              : 0.8))
              / tiers[0].claimInterval) + parseInt(i == 0 ? oldRewards : nodesUser[i].leftover);

            myClaimableSum += claimeableAmount;
            */

            /*
            let claimeableAmount = (((new Date().getTime() / 1000 - parseInt(nodesUser[i].claimedTime)) * (parseInt(nodesUser[i].tierIndex) === 0
                  ? tiers[0].rewardsPerTime
                  : 0.8)) 
                  / tiers[0].claimInterval) + parseInt(nodesUser[i].leftover);
            
            myClaimableSum += claimeableAmount;
            */
            const days = Math.floor(
              (nodesUser[i].limitedTime - new Date().getTime() / 1000) / 86400
            );

            const claimablePXTforNode = Web3.utils.fromWei(
              parseInt(claimeableAmount).toString(),
              "ether"
            );

            if (Number(claimeableAmount) > 0.0) {
              if (claimablePXTforNode >= 0) {
                totalClaimableNodes++;
              }

              nodeElement.push(
                <tr key={i}>
                  <td>{NameList[i]}</td>
                  <td>{Number(claimeableAmount).toFixed(3)}</td>
                  <td>Due in {days} days</td>
                  <td>
                    <Tippy
                      allowHTML={true}
                      content={rpcURL}
                      theme={"blue"}
                      interactive={true}
                    >
                      <span
                        className="secondarycolour_text_blue pointer"
                        onClick={toggleModalRPC}
                      >
                        RPC <i className="fa fa-info-circle"></i>{" "}
                        {node_status ? (
                          <i className="fa fa-check-circle"></i>
                        ) : (
                          <i className="fa fa-times-circle"></i>
                        )}
                      </span>
                    </Tippy>
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      onClick={handleCheck}
                      value={nodesUser[i].id ?? ""}
                    />
                  </td>
                  <td>READY</td>
                  {/*<button className="btn nodeclaim" onClick={async (e) => {await claimFromSingleNode(i)}}>CLAIM</button>*/}
                </tr>
              );
            } else {
              nodeElement.push(
                <tr key={i}>
                  <td>{NameList[i]}</td>
                  <td>{Number(claimeableAmount).toFixed(3)}</td>
                  <td>Due in {days} days</td>
                  <td>
                    <Tippy
                      allowHTML={true}
                      content={rpcURL}
                      theme={"blue"}
                      interactive={true}
                    >
                      <span
                        className="secondarycolour_text_blue pointer"
                        onClick={toggleModalRPC}
                      >
                        RPC <i className="fa fa-info-circle"></i>{" "}
                        {node_status ? (
                          <i className="fa fa-check-circle"></i>
                        ) : (
                          <i className="fa fa-times-circle"></i>
                        )}
                      </span>
                    </Tippy>
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      onChange={handleCheck}
                      value={nodesUser[i].id ?? ""}
                    />
                  </td>
                  <td>WAIT 1HR</td>
                  {/*<button className="btn nodeclaim" disabled>ENERGISING</button>*/}
                </tr>
              );
            }
          }
        }

        //BUILD TABLE
        setRows(nodeElement);

        //DISPLAY REWARDS TOTAL
        const r1 = Web3.utils.fromWei(
          //parseInt(myClaimableSum).toString(),
          parseInt(claimable).toString(),
          "ether"
        );

        const r2 = Web3.utils.fromWei(
          //parseInt(myClaimableSum).toString(),
          parseInt(oldRewards).toString(),
          "ether"
        );

        // const r = info.nodes?.length > 0 ? [...info.nodes].map((node) => parseFloat(formatEther(calcRewards(node)))).reduce((a, b) => a + b).toFixed(8) : null
        //console.log(r);
        setPendingRewards(Number(r1) + Number(r2));
        setCompoundAmount(
          parseInt((Number(r1) + Number(r2)) / pxtPerNodeCreate)
        );

        //ENABLE CLAIM BUTTON?
        setClaimableNumberOfNodes(totalClaimableNodes);
        if (Number(r1) + Number(r2) > 0) {
          setCanClaimAll(true);
        }

        //NODES DEBUG
        console.log(
          "Nodes:" +
            numberOfNodes +
            "|Claimable Nodes:" +
            totalClaimableNodes +
            "|Rewards:" +
            (r1 + r2)
        );
      }
    }
  };

  const getMigrationInfo = async () => {
    let userMigrated = await NodeManagementInstance.methods
      .userMigrated(account)
      .call()
      .then((res) => {
        return res;
      })
      .catch((e) => {
        console.log({ e });
        return false;
      });
    if (userMigrated) {
      setMigratedNodes(false);
    }

    let userRewards = await NodeManagementInstance.methods
      .rewardMigrated(account)
      .call()
      .then((res) => {
        return res;
      })
      .catch((e) => {
        console.log({ e });
        return false;
      });
    if (userRewards) {
      setMigratedRewards(false);
    }

    let userHasDoneAirdrop = await contractInstance.methods
      .getUserAirdrop(account)
      .call()
      .then((res) => {
        return res;
      })
      .catch((e) => {
        console.log({ e });
        return false;
      });
    if (!userHasDoneAirdrop) {
      setMigratedTokens(false);
    }
    
    let userOldBalance = await contractInstanceOld.methods
    .balanceOf(account)
    .call()
    .then((res) => {
      return res;
    })
    .catch((e) => {
      console.log({ e });
      return false;
    });

    if (Number(userOldBalance === 0)) {
	    setMigratedTokens(true);
    }
    
    await NodeManagementInstanceOld.methods
      ._getNodeNumberOf(account)
      .call()
      .then((res) => {
        setMyOldNodes(res);
      })
      .catch((e) => {
        console.log({ e });
        return false;
      });
  };

  const OnClickClaimButton = async () => {
    /*
      const node = '{"name":"YOUR_NAME","description":"YOUR_DESCRIPTION"}'
      const response = await axios.post('https://api.chainstack.com/v1', node, {
          headers: {
          'HDR_CT': 'application/json',
          'HDR_AUTH': 'Authorization: Bearer gozjNHMX.JV6ZFDLbKHnb0b8KK9jHFlriSBx70uMz'
          }}).then((response) => {
              return response.data.data.normal.price;
          });

      console.log(response)
      */

    const gasPrice = await axios
      .get("https://api.debank.com/chain/gas_price_dict_v2?chain=avax")
      .then((response) => {
        //console.log("gas: " + response.data.data.fast.price + " " + parseInt(response.data.data.fast.price - ((response.data.data.fast.price/100)*1)));
        return parseInt(response.data.data.normal.price);
      });

    setIsLoading(true);
    NodeManagementInstance.methods
      .claim()
      .send({ from: account, gasPrice: gasPrice })
      .then((claimResult) => {
        toast.success("Congratulations! $PXT claimed successfully.");
        setPendingRewards(0);
        setTotalNodesCanCompound(0);
        setIsLoading(false);
      })
      .catch((e) => {
        console.log({ e });
        //toast.error("Unable to claim your rewards, Are you on the right wallet & network?");
        setIsLoading(false);
      });
  };

  const OnClickCompoundButton = async () => {
    const gasPrice = await axios
      .get("https://api.debank.com/chain/gas_price_dict_v2?chain=avax")
      .then((response) => {
        //console.log("gas: " + response.data.data.fast.price + " " + parseInt(response.data.data.fast.price - ((response.data.data.fast.price/100)*1)));
        return parseInt(response.data.data.normal.price);
      });
    console.log("compound:" + compoundAmount);
    if (compoundAmount > 0) {
      setIsLoading(true);
      NodeManagementInstance.methods
        .compound("basic", compoundAmount)
        .send({ from: account, gasPrice: gasPrice })
        .then(() => {
          toast.success("Congratulations! Nodes compound successfully.");
          setIsLoading(false);
        })
        .catch((e) => {
          console.log({ e });
          setIsLoading(false);
        });
    } else {
      console.log("skip compound");
    }
  };

  const OnClickMigrateNodesButton = async () => {
    const gasPrice = await axios
      .get("https://api.debank.com/chain/gas_price_dict_v2?chain=avax")
      .then((response) => {
        //console.log("gas: " + response.data.data.fast.price + " " + parseInt(response.data.data.fast.price - ((response.data.data.fast.price/100)*1)));
        return parseInt(response.data.data.normal.price);
      });
    console.log(compoundAmount);
    setIsLoading(true);
    NodeManagementInstance.methods
      .migrateNodesFromOldVersion()
      .send({ from: account, gasPrice: gasPrice })
      .then(() => {
        toast.success("Congratulations! Nodes compound successfully.");
        setIsLoading(false);
      })
      .catch((e) => {
        console.log({ e });
        setIsLoading(false);
      });
  };

  const OnClickMigrateRewardsButton = async () => {
    const gasPrice = await axios
      .get("https://api.debank.com/chain/gas_price_dict_v2?chain=avax")
      .then((response) => {
        //console.log("gas: " + response.data.data.fast.price + " " + parseInt(response.data.data.fast.price - ((response.data.data.fast.price/100)*1)));
        return parseInt(response.data.data.normal.price);
      });
    //console.log(compoundAmount)
    setIsLoading(true);
    NodeManagementInstance.methods
      .migrateRewardsFromOldVersion()
      .send({ from: account, gasPrice: gasPrice })
      .then(() => {
        toast.success("Congratulations! Nodes compound successfully.");
        setIsLoading(false);
      })
      .catch((e) => {
        console.log({ e });
        setIsLoading(false);
      });
  };

  const OnClickTokenButton = async () => {
    const gasPrice = await axios
      .get("https://api.debank.com/chain/gas_price_dict_v2?chain=avax")
      .then((response) => {
        //console.log("gas: " + response.data.data.fast.price + " " + parseInt(response.data.data.fast.price - ((response.data.data.fast.price/100)*1)));
        return parseInt(response.data.data.normal.price);
      });
    setIsLoading(true);
    contractInstance.methods
      .tokenAirdrop()
      .send({ from: account, gasPrice: gasPrice })
      .then(() => {
        toast.success("Congratulations! Tokens migrated successfully.");
        setIsLoading(false);
      })
      .catch((e) => {
        console.log({ e });
        setIsLoading(false);
      });
  };

  const calcRewards = (node) => {
    const tier = {
      rewardsPerTime: BigNumber.from("170000000000000000"),
      claimInterval: 86400,
    };
    const now = new Date();
    const diff = now.getTime() - node.claimedTime * 1000;
    if (diff <= 0) return 0;
    let one = parseEther("1"),
      m = parseEther("1");
    if (node.multiplier) {
      const multiplier = BigNumber.from("1000000000000000000");
      m = node.multiplier
        .mul(lastTime.getTime() - node.claimedTime)
        .add(multiplier.mul(now.getTime() - lastTime.getTime()))
        .div(now.getTime() - node.claimedTime);
      m += node.leftover;
    }
    return (
      tier?.rewardsPerTime
        .mul(diff)
        .mul(m)
        .div(one)
        .div(1000)
        .div(tier.claimInterval) ?? 0
    );
  };

  return (
    <>
      <div className="shane_tm_section" id="nodes">
        <div className="shane_tm_about bg_black">
          <div className="container">
            <div className="about_inner">
              <div className="left">
                {myNodes > 0 && <h5>{myNodes} nodes activated:</h5>}
                {myNodes > 0 ? (
                  //<div id="nodelist"> {rows} </div>
                  <div id="nodelist">
                    <table id="nodelist_table">
                      <tbody>{rows}</tbody>
                    </table>
                  </div>
                ) : (
                  <span className="indent">
                    No nodes initialized. <a href="#home">Create some now</a>
                    <p>Maybe your wallet is not connected?</p>
                  </span>
                )}
                <br />
                {/*
	            You can track rewards for multiple wallets{" "}
                <a
                  href="https://my.projectx.financial/"
                  target="_blank"
                  rel="noreferrer"
                >
                  here
                </a>
                */}
                <br />
                <br />
                <>
                  <span className="nodecreatecontainer">
                    <button
                      onClick={() =>
                        setPayMonth(payMonth === 1 ? 1 : payMonth - 1)
                      }
                      className="btn minus"
                    >
                      -
                    </button>
                    <button className="btn" onClick={OnClickPayButton}>
                      <span>
                        Pay {payMonth} Month{payMonth > 1 && "s"} (
                        {checked.length === 0 ? "All" : checked.length})
                      </span>
                    </button>
                    <button
                      onClick={() =>
                        setPayMonth(payMonth === 3 ? 3 : payMonth + 1)
                      }
                      className="btn plus"
                    >
                      +
                    </button>
                  </span>
                </>
              </div>

              {/* End left */}

              <div className="right">
                <div
                  className="shane_tm_title"
                  data-aos="fade-up"
                  data-aos-duration="1200"
                >
                  {pendingRewards ? (
                    <h3>
                      {pendingRewards.toFixed(2)} $PXT
                      <span>claimable reward</span>
                    </h3>
                  ) : (
                    <h3>Loading rewards...</h3>
                  )}
                </div>
                <div
                  className="text"
                  data-aos="fade-up"
                  data-aos-duration="1200"
                >
                  <p>
                    Daily rewards:{" "}
                    <span className="secondarycolour_text">
                      {dailyReward} $PXT
                    </span>
                  </p>
                  <p>
                    Node cost:{" "}
                    <span className="secondarycolour_text">10 $PXT</span>
                  </p>
                  <p>
                    Claim tax: <span className="secondarycolour_text">30%</span>
                  </p>
                  <p>
                    Compound tax:{" "}
                    <span className="secondarycolour_text">0%</span>
                  </p>
                  <p>
                    Sell tax: <span className="secondarycolour_text">0%</span>
                  </p>
                  <p>
                    Pool:{" "}
                    <a
                      href="https://traderjoexyz.com/pool/0x9ADCbba4b79eE5285E891512b44706F41F14CAFd/AVAX"
                      rel="noreferrer"
                      target="_blank"
                    >
                      Earn PXT at Trader Joe Liquidity Pool
                    </a>
                  </p>
                  <p>
                    Ensure you are at:{" "}
                    <a href="https://my.projectx.financial" rel="noreferrer">
                      https://projectx.financial
                    </a>{" "}
                    <i className="fa fa-exclamation-triangle"></i>
                  </p>
                  <br />

                  <button className="btn" onClick={OnClickClaimButton}>
                    CLAIM {pendingRewards.toFixed(2)} $PXT
                  </button>
                  {parseInt(pendingRewards / pxtPerNodeCreate) > 0 ? (
                    <>
                      &nbsp;&nbsp; Or compound&nbsp;&nbsp;
                      <input
                        type="text"
                        name="compoundNumber"
                        id="compoundNumber"
                        size="2"
                        defaultValue={parseInt(
                          pendingRewards / pxtPerNodeCreate
                        )}
                        onChange={(e) => setCompoundAmount(e.target.value)}
                      />
                      &nbsp;&nbsp;
                      <button className="btn" onClick={OnClickCompoundButton}>
                        New Nodes
                      </button>
                    </>
                  ) : (
                    <>
                      &nbsp;&nbsp; You need {(10 - pendingRewards).toFixed(2)}{" "}
                      more PXT to compound.
                    </>
                  )}
                  <br />
                  <br />
                  <hr />
                  <br />
                  <h4>Migration steps:</h4>
                  {myNodes == 0 && myOldNodes > 0 && migratedNodes ? (
                    <>
                      <br />
                      <strong>Step 1:</strong>{" "}
                      <a
                        href="javascript:void(0)"
                        onClick={OnClickMigrateNodesButton}
                      >
                        Migrate Nodes
                      </a>
                    </>
                  ) : (
                    <>
                      <br />
                      <strong>Step 1:</strong> Complete{" "}
                      <i className="fa fa-check"></i>
                    </>
                  )}
                  {myOldNodes > 0 && migratedRewards ? (
                    <>
                      <br />
                      <strong>Step 2:</strong>{" "}
                      <a
                        href="javascript:void(0)"
                        onClick={OnClickMigrateRewardsButton}
                      >
                        Migrate Rewards
                      </a>
                    </>
                  ) : (
                    <>
                      <br />
                      <strong>Step 2:</strong> Complete{" "}
                      <i className="fa fa-check"></i>
                    </>
                  )}
                  {migratedTokens ? (
                    <>
                      <br />
                      <strong>Step 3:</strong> Complete{" "}
                      <i className="fa fa-check"></i>
                    </>
                  ) : (
                    <>
                      <br />
                      <strong>Step 3:</strong>{" "}
                      <a href="javascript:void(0)" onClick={OnClickTokenButton}>
                        Migrate Tokens
                      </a>
                    </>
                  )}
                </div>
              </div>
              {/* End right */}
            </div>
          </div>
          {/* End container */}
        </div>
      </div>

      <Modal
        isOpen={isRPCOpen}
        onRequestClose={toggleModalRPC}
        contentLabel="RPC"
        className="custom-modal"
        overlayClassName="custom-overlay"
        closeTimeoutMS={500}
      >
        <div className="shane_tm_modalbox_news">
          <button className="close-modal" onClick={toggleModalRPC}>
            <img src="/img/svg/cancel.svg" alt="close icon" />
          </button>
          {/* End close modal */}
          <div className="box_inner">
            <div className="description_wrap scrollable">
              <img src="/img/news/rpc-avax.png" alt="thumb" width="500" />
              <br />
              <div className="details">
                <h3 className="title">ProjectX RPC</h3>
              </div>
              {/* End details */}
              <div className="description">
                <p>
                  RPC (Remote Procedure Call) Endpoints are now live for each
                  and every node in the Project X system, deployed to over
                  79,000 nodes. This is a HUGE achievement in our roadmap!
                </p>
                <h5>What is RPC?</h5>
                <p>
                  Every node needs a way to communicate with the blockchain.
                  This connection between the node and blockchain is called RPC.
                  To set this up we need our own routing system that can be
                  linked to these RPCs, and each node has its unique URL.
                </p>
                <h5>Why RPC?</h5>
                <p>
                  Until this point, communication was going through
                  AVAX/MetaMask's public routing. Now each of the nodes in
                  Project X has a private connection using its unique RPC URL
                  (accessed through the Project X website). This should ideally
                  help in potentially reducing transaction fees and provide a
                  faster transaction time and better wallet performance.
                </p>
                <p>
                  With a successful rollout of RPC Endpoints across all the
                  nodes currently in the Project X system, we can say Project X
                  has officially expanded its footprint into Nodes-as-a-Service
                  (NaaS).
                </p>
                <h5>How do I use them?</h5>
                <p></p>
                <p>
                  1. Copy the endpoint <strong>URL</strong> by hovering over the
                  blue RPC link on your node.
                </p>
                <p>
                  2. Go into your MetaMask{" "}
                  <strong>
                    SETTINGS {">"} NETWORKS {">"} AVALANCHE MAINNET
                  </strong>
                  , and <strong>edit</strong> the URL as the RPC endpoint. If
                  you already have an existing URL set up,{" "}
                  <strong>replace</strong> it with the <strong>URL</strong> you
                  copied.
                </p>
                <p>
                  Thank you everyone for your constant support and keep our
                  community growing!
                </p>
                <p>We're just getting started! x</p>
                {/*<h5>How to set up RPC?</h5>*/}
              </div>
              {/* End description */}
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AboutTwo;
