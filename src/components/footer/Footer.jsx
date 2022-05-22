import React from "react";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <>
      <div className="shane_tm_section">
        <div className="shane_tm_copyright">
          <div className="container">
            <div className="inner">
              <p>
                {/*<a target="_blank" href="https://coinmarketcap.com/currencies/project-x-nodes/" rel="noreferrer">CoinMarketCap</a> 
                &nbsp; | &nbsp; */}
                <a target="_blank" href="https://twitter.com/projectxfinance" rel="noreferrer">Twitter</a> 
                &nbsp; | &nbsp; 
                <a target="_blank" href="https://discord.gg/projectxfinance" rel="noreferrer">Discord</a> 
                &nbsp; | &nbsp; 
                <a target="_blank" href="https://discord.gg/projectxfinance" rel="noreferrer">Support</a>
                <br/>
                <a target="_blank" href="https://dexscreener.com/avalanche/0x9ADCbba4b79eE5285E891512b44706F41F14CAFd" rel="noreferrer">DEX SCREENER 0x9ADCbba4b79eE5285E891512b44706F41F14CAFd</a>
                <br/>
                
             
				<a href="https://www.avax.network/" target="_blank" rel="noreferrer"><img alt="Powered by Avalanche" src="/img/svg/poweredbyavalanche.svg" height="38" width="113" className="poweredbyavalanche"/></a>
				<a href="https://www.assuredefi.io/projects/projectx/" target="_blank" rel="noreferrer"><img src="/img/kyc/Assure_TransBG_White_crop.png" className="footer_kyc" alt="KYC by Assure DeFi"/></a>
              
              </p>
              <br/>
              <p>© 2022 All rights reserved. (V2.6)</p>
              <p className="smallprint">While cryptocurrencies have the potential for great rewards, they may not be suitable for all investors. Before deciding to trade any cryptocurrency or DeFi protocol you should carefully consider your investment objectives, level of experience, and risk appetite. Daily reward rate is not guaranteed. The information provided on this website does not constitute investment advice, financial advice, trading advice, or any other sort of advice, and you should not treat any of the website's content as such. ProjectX will not accept liability for any loss or damage, including without limitation to, any loss of profit, which may arise directly or indirectly from use of or reliance on such information.</p>
            </div>
            
            {/* End inner */}
          </div>
        </div>
        {/* End shane_tm_copyright */}
      </div>
    </>
  );
};

export default Footer;