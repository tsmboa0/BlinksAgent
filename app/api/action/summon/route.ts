

import {
  Action,
    ActionGetResponse,
    ActionPostRequest,
    ActionPostResponse,
    ACTIONS_CORS_HEADERS,
    BLOCKCHAIN_IDS,
    CompletedAction,
  } from "@solana/actions";
  
  import {
    Connection,
    PublicKey,
    LAMPORTS_PER_SOL,
    SystemProgram,
    TransactionMessage,
    VersionedTransaction,
    clusterApiUrl,
  } from "@solana/web3.js";
  import axios from "axios";
  // import LOGO from "@/public/"
  
  const blockchain = BLOCKCHAIN_IDS.devnet;

  
  const headers = {
    ...ACTIONS_CORS_HEADERS,
    "x-blockchain-ids": blockchain,
    "x-action-version": "2.4",
  };
  
  export const OPTIONS = async () => {
    return new Response(null, { headers });
  };
  
  export const GET = async (req: Request) => {
    const url = new URL(req.url);
    console.log("the origin is: ",url.origin);
    const LOGO = url.origin+"/blinksAgent/summon.png";

    const response: ActionGetResponse = {
      type: 'action',
      icon: LOGO,
      label: "Summon",
      title: "Summon a Blink with a prompt",
      description:
        "Summon a Blink to perform any solana action. For example, give me a Blinks to play RPS by sendArcade",
      links: {
        actions: [
          {
            type: 'post',
            href: `/api/action/summon?prompt={prompt}&strategy=next`,
            label: "Summon",
            parameters: [
              {
                name: "prompt",
                label: "Enter your prompt",
                type: "textarea",
                required: true
              },
            ],
          },
        ],
      },
    };
  
    return new Response(JSON.stringify(response), {
      status: 200,
      headers,
    });
  };
  


  export const POST = async (req: Request) => {
    try {
      const url = new URL(req.url);
      const strategy = url.searchParams.get("strategy");
      const LOGO = url.origin+"/blinksAgent/banner.jpg";
  
      const prompt = url.searchParams.get("prompt") as string;

      if(strategy=="next"){

        const response: ActionPostResponse = {
          type:'post',
          links:{
            next:{
              type:'post',
              href:`/api/action/summon?prompt=${prompt}&strategy=complete`
            }
          }
        }
        return Response.json(response, { status: 200, headers });

      }else{
        const payload:any = await invokeLLM(
          prompt, url.origin+"/api/agent"
          );
      
    
          if(payload.payload.status == true){
            console.log("the status is true");
            console.log("the blink data is: ",payload.blinkData.links);

            const response :Action = payload.blinkData;
    
            return Response.json(response, { status: 200, headers });
            
          }else{
            console.log('the status is false');
            const response:CompletedAction = {
              type: 'completed',
              icon: LOGO,
              title: `Not Found!`,
              label: `Not Found`,
              description: `The requested Blink is not found on our database. If you are the developer, kind register your blink on our database. you can use this blink to find the register Blink by passing in the required prompt`,
            }
    
            return Response.json(response, { status: 200, headers });
          }
      }



      

    } catch (error) {
        
      console.error("Error processing request:", error);
      return new Response(JSON.stringify({ error: "Internal server error" }), {
        status: 500,
        headers,
      });
    }
  };
  
  const invokeLLM = async (
    prompt:string,
    url:string
  ) => {
    const res = await fetch(url, {
        method:'POST',
        headers:{"Content-Type": "application/json"},
        body:JSON.stringify(prompt)
    });

    const payload = await res.json();
    console.log("the status is: ",JSON.parse(payload).status);
    console.log("the agent res is: ",payload);

    if(JSON.parse(payload).status == true){
      const blink_json = await axios.get(JSON.parse(payload).blink_url);
      console.log("the blinks json is: ",blink_json.data.title);

      return {payload:JSON.parse(payload), blinkData:blink_json.data};
    }

    return {payload:JSON.parse(payload)};
  };