import React, {useEffect, useState} from "react";
import ContractAbi from "../../abi/contractAbi.json";
import contractAddress from "../../abi/contractAddress";
import nodeRewardContract from "../../abi/nodeRewardContract";
import {useWeb3React} from "@web3-react/core";
import toast from "react-hot-toast";
import NODERewardManagementAbi from "../../abi/NODERewardManagement.json";
import Web3 from "web3";
import axios from 'axios';

var nebula = [
  ["Glowing Eye", "NGC 6751", "https://en.wikipedia.org/wiki/NGC_6751"],
  ["Bow-Tie", "NGC 40", "https://en.wikipedia.org/wiki/NGC_40"],
  ["Ghost of Jupiter", "NGC 3242", "https://en.wikipedia.org/wiki/NGC_3242"],
  ["Blinking", "NGC 6826", "https://en.wikipedia.org/wiki/NGC_6826"],
  ["Dumbbell", "NGC 6853", "https://en.wikipedia.org/wiki/Dumbbell_Nebula"],
  ["Eskimo", "NGC 2392", "https://en.wikipedia.org/wiki/Eskimo_Nebula"],
  ["Cat's Eye", "NGC 6543", "https://en.wikipedia.org/wiki/Cat%27s_Eye_Nebula"],
  ["Little Ghost", "NGC 6369", "https://en.wikipedia.org/wiki/Little_Ghost_Nebula"],
  ["Medusa", "NGC 4194", "https://en.wikipedia.org/wiki/Medusa_Nebula"],
  ["Helix", "NGC 7293", "https://en.wikipedia.org/wiki/Helix_Nebula"]
];

const AboutTwo = () => {
    const {account, library} = useWeb3React();
    const [isLoading, setIsLoading] = useState(false);
    const [pendingRewards, setPendingRewards] = useState(0);
    const [claimableNumberOfNodes, setClaimableNumberOfNodes] = useState(0);
    const [myNodes, setMyNodes] = useState(0);
    const [lastTimeClaimString, setLastTimeClaimString] = useState("");
    const [lastTimeClaim, setLastTimeClaim] = useState([]);
    const [canClaimAll, setCanClaimAllAll] = useState(false);
    const [roi, setRoi] = useState(0);
    const [rows, setRows] = useState([]);
    let NODERewardManagementInstance;
    let contractInstance;

    useEffect(async () => {
        if (library) {
            contractInstance = new library.eth.Contract(ContractAbi, contractAddress);
            NODERewardManagementInstance = new library.eth.Contract(
                NODERewardManagementAbi,
                nodeRewardContract
            );
            await getNodesInfo();
        }
    }, [
        library,
        isLoading,
        pendingRewards,
        myNodes,
        lastTimeClaimString,
        lastTimeClaim,
        canClaimAll,
        rows,
        claimableNumberOfNodes
    ]);


    const claimFromSingleNode = async (nodeIndex) => {
        return await contractInstance.methods
            .cashoutReward(nodeIndex)
            .send({from: account})
            .then((result) => {
                // todo refresh all available button
                setClaimableNumberOfNodes(claimableNumberOfNodes - 1)
                return result;
            })
            .catch((e) => {
                console.log({e});
                if (pendingRewards > 0) toast.error("Unable to get your reward data.");
                return e;
            });
    }

    const getNodesInfo = async () => {
        const numberOfNodes = await contractInstance.methods.getNodeNumberOf(account)
            .call()
            .then(async (myNodes) => {
                return myNodes;
            }).catch((e) => {
                return -1;
                console.log({e});
                toast.error(
                    "Unable to get your node data, Are you on the right wallet & network?"
                );
            });
        //console.log(numberOfNodes);

        if (numberOfNodes > 0) {
            setMyNodes(numberOfNodes);
            
            //let totalReward = 0;
            let totalClaimable = 0;
            
            //Pending Rewards (unclaimable yet)
            /*
	        const rewardsPendingAllNodes = await NODERewardManagementInstance.methods
                ._getNodesPendingClaimableAmount(account)
                .call()
                .then((currentNodeAvailableRewards) => {
                    if (currentNodeAvailableRewards > 0) {
                    	totalClaimable += 1;
                    }
                    return currentNodeAvailableRewards
                })
                .catch((e) => {
                    console.log({e});
                    //console.log("too early to claim");
                });
            const myPendingArray = rewardsPendingAllNodes.split("#");
            var myPendingSum = myPendingArray.reduce(function(a, b){
				return Number(a) + Number(b);
    		}, 0);
            console.log('Pending rewards:'+myPendingSum);
            */
            
            //Claimable
            /*const rewardsAllNodes = await NODERewardManagementInstance.methods
                ._getNodesRewardAvailable(account)
                .call()
                .then((currentNodeAvailableRewards) => {
                    if (currentNodeAvailableRewards > 0) {
                    	totalClaimable += 1;
                    }
                    return currentNodeAvailableRewards
                })
                .catch((e) => {
                    console.log({e});
                });
            const myClaimableArray = rewardsAllNodes.split("#");
            var myClaimableSum = myClaimableArray.reduce(function(a, b){
				return Number(a) + Number(b);
    		}, 0);
            console.log('Claimable rewards:'+myClaimableSum);
            */
	        
            /*
            for (let i = 0; i < numberOfNodes; i++) {
                const r = await NODERewardManagementInstance.methods
                    //._getNodeRewardAmountOf(account, i)
                    ._getNodesPendingClaimableAmount(account, i)
                    .call()
                    .then((currentNodeAvailableRewards) => {
	                    if (currentNodeAvailableRewards > 0) {
                        	totalClaimable += 1;
                        }
                        return currentNodeAvailableRewards
                    })
                    .catch((e) => {
                        console.log({e});
                        //console.log("too early to claim");
                    });


                if (!isNaN(r) && Number(r) > 0) {
                    totalReward += Number(r);
                    //console.log(Number(r));
                    //console.log(Number(totalReward));
                }
            }*/
            
            const r = Web3.utils.fromWei(myClaimableSum.toString(), 'ether');
            setPendingRewards(Number(r));
            setClaimableNumberOfNodes(totalClaimable);

            //ENABLE CLAIM BUTTON?
            //console.log(totalClaimable + " " + numberOfNodes + " " + myClaimableSum )
            if (Number(totalClaimable) === Number(numberOfNodes) && myClaimableSum > 100000000000000000) {
                setCanClaimAllAll(true);
            }
        }
    };

    //ROI
    useEffect(async () => {
        const nodeReward = [];
        const nodeElement = [];
        //async function fetchData() {

        const pxtPerNode = 10;

        for (let i = 0; i < myNodes; i++) {
	        const ct = await getNodeCreationTime();
            const rPM = await getRewardsPerMinute();
            const hours = Math.abs((new Date().getTime()) - (ct[i] * 1000)) / 36e5;
            
            const r = await NODERewardManagementInstance.methods
                //._getNodeRewardAmountOf(account, i)
                ._getNodesPendingClaimableAmount(account, i)
                .call()
                .then((currentNodeAvailableRewards) => {
	                const nodeRewardsTotal = Web3.utils.fromWei(currentNodeAvailableRewards.toString(),'ether');
	                
	                if (currentNodeAvailableRewards > 0) {
	                    nodeElement.push(
	                        <div key={i}>
	                            <span className="indent noderow">Node {i+1}</span>
	                            {/*<span className="indent noderow">{nebula[i][0]} @ {Number(nodeRewardsTotal).toFixed(3)}PXT</span>*/}
	                            <span className="indent noderow">@ {Number(nodeRewardsTotal).toFixed(3)} $PXT</span>
	                            {/*<span className="indent noderow">{((100 * ((hours) * rPM)) / pxtPerNode).toFixed(1)}% ROI</span>*/}
	                            <button className="btn nodeclaim" onClick={async (e) => {await claimFromSingleNode(i)}}>CLAIM</button>
	                        </div>
	                    );
                    } else {
	                    nodeElement.push(
	                        <div key={i}>
	                            <span className="indent noderow">Node {i+1}</span>
	                            {/*<span className="indent noderow">{nebula[i][0]} @ {Number(nodeRewardsTotal).toFixed(3)}PXT</span>*/}
	                            <span className="indent noderow">@ {Number(nodeRewardsTotal).toFixed(3)} $PXT</span>
	                            {/*<span className="indent noderow">{((100 * ((hours) * rPM)) / pxtPerNode).toFixed(1)}% ROI</span>*/}
	                            <button className="btn nodeclaim" disabled>ENERGISING</button>
	                        </div>
	                    );
                    }
                    return currentNodeAvailableRewards
                })
                .catch((e) => {
                    nodeElement.push(
                        <div key={i}>
                            <span className="indent noderow">Node {i+1}</span>
	                        {/*<span className="indent noderow">{((100 * ((hours) * rPM)) / pxtPerNode).toFixed(1)}% ROI</span>*/}
                            <button className="btn nodeclaim error" disabled>WAIT</button>
                        </div>
                    );
                    //console.log({e});
                    //console.log("too early to claim");
                });
        }
        


        
        /*for (var i = 0; i < myNodes; i++) {
            const ct = await getNodeCreationTime();
            const rPM = await getRewardsPerMinute();

            const hours = Math.abs((new Date().getTime()) - (ct[i] * 1000)) / 36e5;

            nodeElement.push(
                <div key={i}>
                    <span className="indent noderow">Node_{i + 1}</span>
                    {<span className="indent noderow">
              {((100 * ((hours) * rPM)) / pxtPerNode).toFixed(2)}% ROI
            </span>}
                    <button className="btn small" onClick={async (e) => {
                        const index = Number(e.target.innerText.replace("CLAIM NODE ", ''));
                        await claimFromSingleNode(index - 1)
                    }}>CLAIM NODE {i + 1}
                    </button>
                </div>
            );
        }*/


        setRows(nodeElement);
        //}
        //fetchData();
    }, [myNodes]);

    const getNodeCreationTime = async () => {
        const res = await NODERewardManagementInstance.methods
            ._getNodesCreationTime(account)
            .call()
            .then((creationTime) => {
                return creationTime.split('#');
            })
            .catch((e) => {
                console.log({e});
                if (pendingRewards > 0) toast.error("Unable to get your reward data.");
            });

        return res;
    };
    const getRewardsPerMinute = async () => {
        const res = await NODERewardManagementInstance.methods
            .rewardsPerMinute()
            .call()
            .then((creationTime) => {
                return Web3.utils.fromWei(creationTime);
            })
            .catch((e) => {
                console.log({e});
                if (pendingRewards > 0) toast.error("Unable to get your reward data.");
            });

        return res;
    };


    /*
    //NOT USED ANYMORE, WE JUST CHECK IF THERE ARE REWARDS PRESENT
    useEffect(() => {
      setLastTimeClaim(lastTimeClaimString.split("#"));
    }, [lastTimeClaimString]);

    useEffect(() => {
      lastTimeClaim.map((x, i) => {
        const claimIntervalInMS = 300000; //5 mintues in ms
        if (x > 0) {
            if ((x*1000) < (new Date().getTime() - claimIntervalInMS)) {
              setCanClaim(true);
              //console.log("boom")
            }
        }
        return false;
      });
    }, [lastTimeClaim]);
    */


    const OnClickClaimButton = async () => {
        const gasPrice = await axios.get('https://api.debank.com/chain/gas_price_dict_v2?chain=avax')
            .then((response) => {
                return response.data.data.normal.price;
            });

        setIsLoading(true);
        contractInstance.methods
            .cashoutAll()
            .send({from: account, gasPrice: gasPrice})
            .then((claimResult) => {
                toast.success("Congratulations! $PXT claimed successfully.");
                setPendingRewards(0);
                setIsLoading(false);
            })
            .catch((e) => {
                console.log({e})
                /*
                toast.error(
                  "Unable to claim your rewards, Are you on the right wallet & network?"
                );
                */
                setIsLoading(false);
            });
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
                                    <div id="nodelist"> {rows} </div>
                                ) : (
                                    <span className="indent">
                    No nodes initialized. <a href="#home">Create some now</a>
                    <p>Maybe your wallet is not connected?</p>
                  </span>
                                )}

                                {/*<span className="nodecreatenotice uppercase">Standby for broadcast...</span>*/}
                            </div>
                            {/* End left */}

                            <div className="right">
                                <div className="shane_tm_title" data-aos="fade-up" data-aos-duration="1200">
                                    <h3>{pendingRewards.toFixed(3)} $PXT<span className="secondarycolour_text">rewards</span>
                                    </h3>
                                </div>
                                <div className="text" data-aos="fade-up" data-aos-duration="1200">
                                    <p><span className="secondarycolour_text">Daily rewards:</span> 0.17 $PXT</p>
                                    <p><span className="secondarycolour_text">Reward interval:</span> 1 hour (Older nodes may be 24hrs)</p>
                                    <p><span className="secondarycolour_text">PXT per node creation</span>: 11 (You get 1 PXT reward instantly)</p>
                                    <p><span className="secondarycolour_text">Claim tax</span>: 8%</p>
                                    <p><span className="secondarycolour_text">Ensure you are at:</span> https://projectx.financial</p>
                                </div>
                                <div data-aos="fade-up" data-aos-duration="1200">
                                    {canClaimAll ? (
                                        <button className="btn" onClick={OnClickClaimButton}>CLAIM FROM ALL NODES</button>
                                    ) : (
                                        <button className="btn" disabled onClick={OnClickClaimButton}>Please wait {claimableNumberOfNodes} of {myNodes} ready</button>
                                    )}
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

export default AboutTwo;
