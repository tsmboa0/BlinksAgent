"use client"
import { useState } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import axios from "axios";
import { RegisterAPI } from "../../utils/register/route";


const Register = () => {
  const connection = useConnection();
  const {publicKey, sendTransaction} = useWallet();

  const register = async(e:any)=>{
    e.preventDefault();
    if(!publicKey){alert("Connect your wallet first"); return};
    setIsBuffering(true);

    const res = await RegisterAPI(blinksTitle, blinksDesc, blinksUrl, blinksSource, publicKey, sendTransaction); 
    console.log("res isssss ",res);
    if(res.success == true){
      console.log(true);
      setIsBuffering(false);
      alert("Your Blinks have been successfully added to the database");
    }else{
      console.log(false);
      setIsBuffering(false);
      alert("An error occured while adding your Blinks");
    }

  }
  const [isBuffering, setIsBuffering] = useState(false);
  const [blinksTitle, setBlinksTitle] = useState("");
  const [blinksDesc, setBlinksDesc] = useState("");
  const [blinksUrl, setBlinksUrl] = useState("");
  const [blinksSource, setBlinksSource] = useState(""); 


  return (
    <div className="home">
      <main className="main">
        <h1 className="hero__text">Make Your Blinks More Discoverable on X for Only $1</h1>
        <h3 className="hero_h3">Allow users summon your blinks directly from X by registering your live blinks here.</h3>
        <form onSubmit={register} className="propmt_form" style={{display:"flex", width:"100%", placeContent:"center"}}>
            <div className="form_area">
                <h4>Complete the form below</h4>
                <div className="input_area">
                    <div className="input_div">
                        <label style={{fontSize:"large"}} htmlFor="blinks_title">Blinks Title:</label>
                        <input onChange={(e)=>{setBlinksTitle(e.target.value)}} value={blinksTitle} type="text" className="form_input" name="blinks_title" placeholder="e.g swap $SOL for $USDC" disabled={isBuffering} required/>
                    </div>
                    <div className="input_div">
                        <label style={{fontSize:"large"}} htmlFor="blinks_desc">Description:</label>
                        <textarea onChange={(e)=>{setBlinksDesc(e.target.value)}} value={blinksDesc} className="form_input textarea" name="blinks_desc" placeholder="e.g This blink is used to swap $SOL for $USDC on the jupiter exchange" disabled={isBuffering} required/>
                    </div>
                    <div className="input_div">
                        <label style={{fontSize:"large"}} htmlFor="blinks_url">Url:</label>
                        <input onChange={(e)=>{setBlinksUrl(e.target.value)}} value={blinksUrl} className="form_input" type="text" name="blinks_url" placeholder="e.g https://worker.jup.ag/blinks/swap/sol-usdc" disabled={isBuffering} required/>
                    </div>
                    <div className="input_div">
                        <label style={{fontSize:"large"}} htmlFor="blinks_source">Source:</label>
                        <input onChange={(e)=>{setBlinksSource(e.target.value)}} value={blinksSource} className="form_input" type="text" name="blinks_source" placeholder="e.g Jupiter Exchange" disabled={isBuffering} required/>
                    </div>
                    <button
                    type="submit"
                    className=""
                    style={{width: "100%",padding:"0.5rem",marginTop:"0.7rem", display:"grid",placeContent:"center", backgroundColor:"purple", color:"whitesmoke", height:"40px", borderRadius:"10px"}}
                    disabled={isBuffering}
                    >
                    {isBuffering ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                    ) : (
                        "submit"
                    )}
                    </button>
                </div>
            </div>
        </form>
      </main>
    </div> 
  )
}

export default Register