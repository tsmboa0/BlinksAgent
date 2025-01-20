"use client"
import { useState } from "react";
import { Blink, useAction } from "@dialectlabs/blinks";
import {useActionSolanaWalletAdapter} from "@dialectlabs/blinks/hooks/solana";
import { clusterApiUrl } from "@solana/web3.js";
import { useSearchParams } from "next/navigation";


const Home = () => {

  const summon = async(e:any)=>{
    e.preventDefault();
    setIsBuffering(true);

    const res = await fetch("/api/agent", {
      method: "POST",
      headers: {"Content-Type": "aplication/json"},
      body: JSON.stringify(userPrompt)
    });

    const result = await res.json();
    console.log("the result is: ", result);
    const response = JSON.parse(result);

    if (response.status == true){
      setActionApiUrl(`solana-action:${response.blink_url}`);
      setResponseText(response.text);
      setIsBuffering(false);
    }else{
      console.log("The status of the result is false");
      setIsBuffering(isLoading);
      setResponseText(response.text);
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
              disabled={isBuffering}
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
        <section className="blink_section">
          <div style={{width:"90%", marginTop:"3rem"}}>
            {action ? (
              <Blink stylePreset="x-dark" adapter={adapter} action={action}/>
            ): ""
            }
          </div>
        </section>
      </main>
    </div> 
  )
}

export default Home