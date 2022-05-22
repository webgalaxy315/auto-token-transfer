import React, {useEffect, useState,useContext} from "react";
import ContractAbi from "../../abi/contractAbi.json";
import contractAddress from "../../abi/contractAddress";
import nodeRewardContract from "../../abi/nodeRewardContract";
import {useWeb3React} from "@web3-react/core";
import toast from "react-hot-toast";
import NODERewardManagementAbi from "../../abi/NODERewardManagement.json";
import Web3 from "web3";
import axios from 'axios';
import { ReactReduxContext } from 'react-redux'
import { getNodeList } from '../../services/list';
import NodeList from '../../assets/nodes.json';
import NameList from '../../assets/nebulas_shuffled.txt';

let hasRunNodeInfo = false;
//const dateObject = new Date();

const AboutTwo = () => {
    const {account, library} = useWeb3React();
    const [isLoading, setIsLoading] = useState(false);
    const [pendingRewards, setPendingRewards] = useState(0);
    const [claimableNumberOfNodes, setClaimableNumberOfNodes] = useState(0);
    const [myNodes, setMyNodes] = useState(0);
    const [totalPending, setTotalPending] = useState(0);
    const [canClaimAll, setCanClaimAllAll] = useState(false);
    const [rows, setRows] = useState([]);
    const { store } = useContext(ReactReduxContext)
    let NODERewardManagementInstance;
    let contractInstance;
    const dateObject = new Date();
    
    //SETTING
    const dailyReward = 0.17;
    
    console.log(NameList);
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
        canClaimAll,
        rows,
        claimableNumberOfNodes,
        totalPending
    ]);

    // const getNodeListApi = async () => {
    //     const nodes = await getNodeList();
    //     setNodesList(getNodeList());
    //     console.log(nodesList);
    // }

    /*const claimFromSingleNode = async (nodeIndex) => {
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
    }*/
  

    const getNodesInfo = async () => {
    	let isOwner = await NODERewardManagementInstance.methods
            ._isNodeOwner(account)
            .call()
            .then((res) => {
                return res
            })
            .catch((e) => {
                console.log({e});
                return false;
            });
        if (!isOwner) {
        	return false;
    	}
    			
	    if (!hasRunNodeInfo) {
			hasRunNodeInfo = true;
			let RunNodeInfoAt = dateObject.getMilliseconds();
			
	        const numberOfNodes = await NODERewardManagementInstance.methods
                ._getNodeNumberOf(account)
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
	
	        if (numberOfNodes > 0) {
	            setMyNodes(numberOfNodes);
	            let totalClaimableNodes = 0;
				var myClaimableSum = 0;
				const nodeElement = [];
	
	            //Pending Rewards (unclaimable yet) //NOT NEEDED
		        /*const rewardsPendingAllNodes = await NODERewardManagementInstance.methods
	                ._getNodesPendingClaimableAmount(account)
	                .call()
	                .then((amount) => {
	                    return amount
	                })
	                .catch((e) => {
	                    console.log({e});
	                    //console.log("too early to claim");
	                });
	            const myPendingArray = rewardsPendingAllNodes.split("#");
	            var myPendingSum = myPendingArray.reduce(function(a, b){
					return Number(a) + Number(b);
	    		}, 0);
	            console.log('Pending rewards (not claimable yet):'+myPendingSum);
	            */

	            //GET CLAIMABLE
	            const rewardsAllNodes = await NODERewardManagementInstance.methods
	                ._getNodesRewardAvailable(account)
	                .call()
	                .catch((e) => {
	                    console.log({e});
	                });
                const token = store.getState().user.userToken;
                const NodeApi = await getNodeList(token);
                const nodes = NodeList;
                console.log(NodeApi);
                console.log(nodes);
	            if (rewardsAllNodes) {
		            const myClaimableArray = rewardsAllNodes.split("#");
		            for (let i = 0; i < myClaimableArray.length; i++) {
		                myClaimableSum += Number(myClaimableArray[i]);
		                let claimablePXTforNode = Web3.utils.fromWei(myClaimableArray[i].toString(), 'ether');
                        const rand = Math.round(Math.random() * (3 - 0) + 0);
		                if (Number(myClaimableArray[i]) > 0.0) {
			                if (claimablePXTforNode >= 0) {
		                    	totalClaimableNodes ++;
		                    }
		                    nodeElement.push(
		                        <div key={i}>
		                            <span className="indent noderow">Node {i+1}</span>
		                            <span className="indent noderow">@ {Number(claimablePXTforNode).toFixed(2)} $PXT</span>
		                            {/*<span className="indent noderow">{((100 * ((hours) * rPM)) / pxtPerNode).toFixed(1)}% ROI</span>*/}
		                            <span className="indent noderow">READY</span>
		                            {/*<button className="btn nodeclaim" onClick={async (e) => {await claimFromSingleNode(i)}}>CLAIM</button>*/}
		                        </div>
		                    );
		                } else {
		                    nodeElement.push(
		                        <div key={i}>
		                            <span className="indent noderow">Node {i+1}</span>
		                            <span className="indent noderow">@ {Number(claimablePXTforNode).toFixed(2)} $PXT</span>
		                            {/*<span className="indent noderow">{((100 * ((hours) * rPM)) / pxtPerNode).toFixed(1)}% ROI</span>*/}
		                            <span className="indent noderow">ENERGISING - WAIT 1HR</span>
		                            {/*<button className="btn nodeclaim" disabled>ENERGISING</button>*/}
		                        </div>
		                    );
		                }
		            }
		        }
	
	            //BUILD TABLE
	            setRows(nodeElement);
	
	            //DISPLAY REWARDS TOTAL
	            const r = Web3.utils.fromWei(myClaimableSum.toString(), 'ether');
	            setPendingRewards(Number(r));
	
	            //ENABLE CLAIM BUTTON?
	            setClaimableNumberOfNodes(totalClaimableNodes);
	            //console.log(totalClaimableNodes + ' '+ numberOfNodes);
	            //if (Number(totalClaimableNodes) === Number(numberOfNodes)) {
	            //if (Number(totalClaimableNodes) > 0 && r >= 0.17) {
		        if (Number(totalClaimableNodes) > 0) {
	                setCanClaimAllAll(true);
	            }
	
	            //DEBUG
	            console.log('Claimable Nodes:'+totalClaimableNodes+' and Claimable Rewards:'+myClaimableSum);
	            //console.log('Number of node:'+numberOfNodes);
	        }
        }
    };


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
                                
                               <br/>
                               NEW FEATURE!! You can track rewards for multiple wallets <a href="https://my.projectx.financial/" target="_blank" rel="noreferrer">here</a>
                            </div>
                            
                            {/* End left */}

                            <div className="right">
                                <div className="shane_tm_title" data-aos="fade-up" data-aos-duration="1200">
                                    <h3>{pendingRewards.toFixed(2)} $PXT<span>claimable reward</span>
                                    </h3>
                                </div>
                                <div className="text" data-aos="fade-up" data-aos-duration="1200">
                                    <p>Daily rewards: {dailyReward} $PXT</p>
                                    <p>Reward interval: 1hr</p>
                                    <p>$PXT per node creation: 10</p>
                                    <p>Claim tax: 0%</p>
                                    <p>Sell tax: 18% (variable)</p>
                                    <p>Ensure you are at: https://projectx.financial</p>
                                </div>
                                
                                <div data-aos="fade-up" data-aos-duration="1200">
                                    {canClaimAll ? (
                                        <button className="btn" onClick={OnClickClaimButton}>CLAIM FROM ALL NODES</button>
                                    ) : (
                                        <button className="btn" disabled onClick={OnClickClaimButton}>Please wait {claimableNumberOfNodes} of {myNodes} ready</button>
                                    )}
                                </div>
                               
                                
                                {/*<div data-aos="fade-up" data-aos-duration="1200">
                                	Claim disabled until V2 migration complete<br/>See <a href="https://discord.com/invite/projectx" rel="noreferrer">Discord</a> for further details
                                </div>*/}
                                
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