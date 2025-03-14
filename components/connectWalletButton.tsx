"use client"


import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import dynamic from "next/dynamic";

const ConnectWalletButton = ()=>{
    const { publicKey } = useWallet();

    return(
        <div>
            <WalletMultiButton style={{backgroundColor:'transparent', border:"2px solid purple", padding:'0.7rem', borderRadius:'0.5rem'}}>{publicKey? (publicKey).toString().substring(0,4)+'...'+(publicKey).toString().substring(40,44): 'Connect Wallet'}</WalletMultiButton>
        </div>
    )
}

export default dynamic(()=> Promise.resolve(ConnectWalletButton), {
    ssr: false
});