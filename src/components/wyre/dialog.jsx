import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import CircularProgress from '@mui/material/CircularProgress';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { useWeb3React } from "@web3-react/core";
import ContractAbi from "../../abi/contractAbi.json";
import contractAddress from "../../abi/contractAddress";
import { formatEther, parseEther } from "ethers/lib/utils";
import Web3 from "web3";

export default function WyreDialog(props) {
   const { account, library } = useWeb3React();
   const { onClose, open } = props;
   const [nodesNumber, setNodesNumber] = useState(0);
   const [tokensNumber, setTokensNumber] = useState(0);
   const [usdtPrice, setUsdtPrice] = useState('');
   const [activeStep, setActiveStep] = useState(0);
   let contractInstance;

   useEffect(async () => {
      if (library) {
        contractInstance = new library.eth.Contract(ContractAbi, contractAddress);
      }
    }, [
      library,
      nodesNumber,
      tokensNumber,
      usdtPrice,
      activeStep,
      open,
      onClose
    ]);

   const handleClose = () => {
      onClose(usdtPrice);
   };

   const getUsdtNodes = async (val) => {
      setTokensNumber(val * 10);
      setNodesNumber(val)
      console.log(Web3.utils.toWei(
         parseInt(val * 10).toString(),
         "ether"
       ))
      await contractInstance.methods
          .getAmountOutUSD(Web3.utils.toWei(
            parseInt(val * 10).toString(),
            "ether"
          ))
          .call()
          .then((e) => {
            setUsdtPrice(Web3.utils.fromWei(
               parseInt(e[2] + '000000000000').toString(),
               "ether"
             ))
          });
   }

   const OnClickBuyButton = () => {
      setActiveStep(1)
      handleClose()
   }

   const steps = [
      'Buy avax',
      'Swap avax for tokens',
      'Create nodes'
    ];

   return (
      <Dialog 
         fullWidth='true'
         maxWidth='md'
         onClose={handleClose} 
         open={open}
      >
         <Stepper className="stepper-direct-buy" activeStep={0} alternativeLabel>
            <Step key={0}>
               <StepLabel>Buy AVAX</StepLabel>
               <div className="dialog_body">
                  <DialogTitle>Insert the amount of nodes you want</DialogTitle>
                  <input type="number" onChange={(e) => getUsdtNodes(e.target.value)}/>
                  {nodesNumber>0 && (
                     <>
                        <p>{`${nodesNumber} node` + (nodesNumber>1 ? 's':'') + ` = ${tokensNumber} $PXT tokens`}</p>
                        <p>{`${tokensNumber} $PXT tokens = ${usdtPrice}$`}</p>
                        
                     </>
                  )}
                  <button disabled={nodesNumber<0} onClick={OnClickBuyButton}>BUY</button>
               </div>
            </Step>
            <Step key={1}>
               <div className="swap_tokens">
                  <StepLabel>Swap AVAX for PXT</StepLabel>
                  <DialogTitle>Accept the metamask action to swap AVAX for $PXT</DialogTitle>
                  <CircularProgress className="dialog_progress" />
                  <p>This acction is automatic, $PXT tokens will be show soon on your wallet, please wait.</p>
               </div>
            </Step>
            <Step key={2}>
               <StepLabel>Create Nodes</StepLabel>
               
            </Step>
         </Stepper>
      </Dialog>
   );
}

WyreDialog.propTypes = {
   onClose: PropTypes.func.isRequired,
   open: PropTypes.bool.isRequired,
};
