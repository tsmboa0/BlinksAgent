"use client"
import { useState } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";


const GenerateSalesBlinks = () => {

  const connection = useConnection();
  const {publicKey} = useWallet();

  const register = async(e:any)=>{
    e.preventDefault();
    if(!publicKey) {alert("Connect your wallet first"); return};
    setIsBuffering(true);

    // const res = await fetch("/api/agent", {
    //   method: "POST",
    //   headers: {"Content-Type": "aplication/json"},
    //   body: JSON.stringify(userPrompt)
    // });

    // const result = await res.json();
    // console.log("the result is: ", result);
    // const response = JSON.parse(result);

  }
  const [isBuffering, setIsBuffering] = useState(false);
  const [productTitle, setProductTitle] = useState("");
  const [productDesc, setProductDesc] = useState("");
  const [productUrl, setProductUrl] = useState("");
  const [email, setEmail] = useState("");
  const [support, setSupport] = useState("");
  const [price, setPrice] = useState("");


  return (
    <div className="home">
      <main className="main">
        <h1 className="hero__text">Create a Blink to instantly sell your products onchain directly from X for only $2</h1>
        <h3 className="hero_h3">{`Sell your products, recieve buyer's shipping details and collect payments directly with your unique blink on X.`}</h3>
        <form onSubmit={register} className="propmt_form" style={{display:"flex", width:"100%", placeContent:"center"}}>
            <div className="form_area">
                <h4 style={{textAlign:"center", fontSize:"x-large"}}>Complete the form below to generate your unique sales Blink</h4>
                <div className="input_area">
                    <div className="input_div">
                        <label style={{fontSize:"large"}} htmlFor="blinks_title">Product Name:</label>
                        <input onChange={(e)=>{setProductTitle(e.target.value)}} value={productTitle} type="text" className="form_input" name="blinks_title" placeholder="e.g Nike Sneakers" disabled={isBuffering} required/>
                    </div>
                    <div className="input_div">
                        <label style={{fontSize:"large"}} htmlFor="blinks_desc">Description:</label>
                        <textarea onChange={(e)=>{setProductDesc(e.target.value)}} value={productDesc} className="form_input textarea" name="blinks_desc" placeholder="e.g The new Air Max from Nike" disabled={isBuffering} required/>
                    </div>
                    <div className="input_div">
                        <label style={{fontSize:"large"}} htmlFor="blinks_url">Image Url:</label>
                        <input onChange={(e)=>{setProductUrl(e.target.value)}} value={productUrl} className="form_input" type="text" name="blinks_url" placeholder="e.g https://worker.jup.ag/blinks/swap/sol-usdc" disabled={isBuffering} required/>
                    </div>
                    <div className="input_div">
                        <label style={{fontSize:"large"}} htmlFor="blinks_source">Price (in $USDC):</label>
                        <input onChange={(e)=>{setPrice(e.target.value)}} value={price} className="form_input" type="number" name="blinks_source" placeholder="e.g 500" disabled={isBuffering} required/>
                    </div>
                    <div className="input_div">
                        <label style={{fontSize:"large"}} htmlFor="blinks_source">Email (your orders will be sent here):</label>
                        <input onChange={(e)=>{setEmail(e.target.value)}} value={email} className="form_input" type="email" name="blinks_source" placeholder="e.g you@mail.com" disabled={isBuffering} required/>
                    </div>
                    <div className="input_div">
                        <label style={{fontSize:"large"}} htmlFor="blinks_source">Support Email:</label>
                        <input onChange={(e)=>{setSupport(e.target.value)}} value={support} className="form_input" type="email" name="blinks_source" placeholder="e.g support@mail.com" disabled={isBuffering} required/>
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

export default GenerateSalesBlinks