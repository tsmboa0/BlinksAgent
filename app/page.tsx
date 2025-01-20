"use client"

import Image from "next/image";
import { callAgent } from "./api/agent/route";
import { useEffect, useState } from "react";
import { Action, Blink, ActionsRegistry, useAction, Miniblink, useActionsRegistryInterval } from "@dialectlabs/blinks";
import {useActionSolanaWalletAdapter} from "@dialectlabs/blinks/hooks/solana";
import { clusterApiUrl } from "@solana/web3.js";


const Home = () => {
  const isMobile = typeof window !== "undefined" && window.innerWidth <= 550

  const summon = async(e:any)=>{
    e.preventDefault();
    setIsBuffering(true);

    const res = await callAgent(userPrompt);
    const result = JSON.parse(res);
    if (result.status == true){
      setActionApiUrl(`solana-action:${result.blink_url}`);
      setResponseText(result.text);
      setIsBuffering(false);
    }else{
      console.log("The status of the result is false");
      setIsBuffering(false);
      setResponseText(result.text);
    }
  }
  const [isBuffering, setIsBuffering] = useState(false);

  const [actionApiUrl, setActionApiUrl] = useState("solana-action:https://70dd-105-113-117-61.ngrok-free.app/api/index");
  const {action, isLoading}: any = useAction({url:actionApiUrl});
  const connection = clusterApiUrl("mainnet-beta");
  const {adapter} = useActionSolanaWalletAdapter(connection);
  const [userPrompt, setUserPrompt] = useState("");
  const [responseText, setResponseText] = useState("")


  return (
    <div className="home">
      <nav className="home__nav">
        <div className="logo_text">Blinks <span style={{color:"whitesmoke"}}>Agent</span></div>
        <div className="nav__links">
          <div>About</div>
          <div> Contact</div>
        </div>
      </nav>
      <main className="main">
        <h1 className="hero__text">Summon a Blink to perform any Solana transaction with a prompt</h1>
        <h3 className="hero_h3">For example: Give me a blink to play Rock Paper Scissors by SendArcade games</h3>
        <form onSubmit={summon} className="propmt_form" style={{display:"flex", width:"100%", placeContent:"center"}}>
          <div className="input__section">
            <input className="text_input" type="text" placeholder="Enter your prompt here" onChange={(e)=>setUserPrompt(e.target.value)} value={userPrompt} disabled={isBuffering} required/>
            <button
              type="submit"
              className="send_button"
              disabled={isBuffering} // Disable button while loading
            >
              {isBuffering ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              ) : (
                "→"
              )}
            </button>
          </div>
        </form>
        {responseText ? (
          <div className="response">{responseText}</div>
        ):""}
        <div style={{width:"90%", marginTop:"3rem"}}>
          {action ? (
            <Blink stylePreset="x-dark" adapter={adapter} action={action}/>
          ): ""
          }
        </div>
      </main>
    </div> 
  )
}

export default Home