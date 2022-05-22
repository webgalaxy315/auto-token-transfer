import React, {useState, useEffect} from "react";
import ContractAbi from "../../abi/vestingAbi.json";
import vestingAddress from "../../abi/vestingAddress";
import vestingWalletAddress from "../../abi/vestingWalletAddress";
import {useWeb3React} from "@web3-react/core";
import toast from "react-hot-toast";
import NODERewardManagementAbi from "../../abi/NODERewardManagement.json";
import Web3 from "web3";

const Vesting = () => {
    const {account, library} = useWeb3React();
    const [lastTimeClaim, setLastTimeClaim] = useState(0);
    const [timesClaimed, setTimesClaimed] = useState(0);
    const [totalClaimedAmount, setTotalClaimedAmount] = useState(0);
    const [hasVesting, setHasVesting] = useState(false);
    let vestingInstance;

    useEffect(async () => {
        if (library) {
            vestingInstance = new library.eth.Contract(ContractAbi, vestingAddress);
            setHasVesting(vestingWalletAddress.includes(account));
            await getNodesInfo();
        }
    }, [library, timesClaimed, lastTimeClaim, totalClaimedAmount, hasVesting]);

    useEffect(() => {
        setHasVesting(vestingWalletAddress.includes(account));
    }, [account]);


    const getNodesInfo = async () => {
        if (hasVesting) {
            vestingInstance.methods
                .totalClaimedAmount(account)
                .call()
                .then((amount) => {
                    setTotalClaimedAmount(amount);
                })
                .catch((e) => {
                    toast.error(
                        "Unable to get your totals claimed amount. Are you on the right wallet & network?"
                    );
                });
            vestingInstance.methods
                .lastTimeClaim(account)
                .call()
                .then((lastTimes) => {
                    setLastTimeClaim(lastTimes);
                    //console.log(lastTimeClaim);
                })
                .catch((e) => {
                    toast.error(
                        "Unable to get your totals claimed amount. Are you on the right wallet & network?"
                    );
                });
            vestingInstance.methods
                .timesClaimed(account)
                .call()
                .then((times) => {
                    setTimesClaimed(times);
                })
                .catch((e) => {
                    toast.error(
                        "Unable to get your totals claimed amount. Are you on the right wallet & network?"
                    );
                });
        }
    };

    const OnClickClaimButton = () => {
        vestingInstance.methods
            .claim()
            .send({from: account})
            .then(async () => {
                toast.success("Congratulations! $PXT claimed successfully.");
                await getNodesInfo();
            })
            .catch((e) => {
                console.log("{e}");
                console.log({e});
                /*
                toast.error(
                  "Unable to claim your rewards, Are you on the right wallet & network?"
                );
                */
            });
    };

    return (
        <>
            {hasVesting && (<div className="shane_tm_section" id="nodes">
                <div className="shane_tm_about bg_red">
                    <div className="container">
                        <div className="about_inner">
                            <div className="left">
                                <h5>Presale only area</h5>
                                <br/>
                                <p>This area is visible to presale members only</p>
                                <p>Until further notice, vesting claims will be paid daily manually</p>
                            </div>
                            <div className="right">

                                {/*
	            <div
                  className="shane_tm_title"
                  data-aos="fade-up"
                  data-aos-duration="1200"
                >
                  <h3>Total claimed { Web3.utils.fromWei(totalClaimedAmount.toString(), 'ether') } $PXT</h3>
                </div>
                
               
                <div
                  className="text"
                  data-aos="fade-up"
                  data-aos-duration="1200"
                >
                  <p>Daily claim amount: 100 PXT</p>
                  <p>You have claimed: {timesClaimed} times</p>
                  <p>Last time claimed: {lastTimeClaim > 0 ? new Date(lastTimeClaim*1000).toLocaleString('en-UK') : 'Never'}</p>
                </div>
                <div data-aos="fade-up" data-aos-duration="1200">
                  <button
                    className="btn"
                    // disabled={lastTimeClaim < 1}
                    onClick={OnClickClaimButton}
                  >
                    CLAIM 100 PXT
                  </button>
                </div>
                */}

                            </div>
                            {/* End right */}
                        </div>
                    </div>
                    {/* End container */}
                </div>
            </div>)}
        </>
    );
};

export default Vesting;
