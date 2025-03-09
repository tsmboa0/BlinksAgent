import {
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
  import { Add } from "../../db/route";
  import axios from "axios";
  // import LOGO from "@/public/"
  
  const blockchain = BLOCKCHAIN_IDS.devnet;
  
  const connection = new Connection(clusterApiUrl("devnet"));
  
  const destinationWallet = "3CZsEaQpsRVxtMBEgdmhe7CPtNs3oxictAz3PgtEZJRQ";

  let userProgess = new Map();
  
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
    const LOGO = url.origin+"/blinksAgent/banner.jpg";

    const response: ActionGetResponse = {
      type: "action",
      icon: LOGO,
      label: "Register",
      title: "Register your Blinks on BlinksAgent",
      description:
        "Registering your Blinks on BlinksAgent allows anyone to summon your Blinks on X. For example @blinksAgent, give me a blinks to play RPS by @sendArcade",
      links: {
        actions: [
          {
            type: "transaction",
            href: `/api/action/register?title={title}&desc={desc}&url={url}&source={source}`,
            label: "Register",
            parameters: [
              {
                name: "title",
                label: "Enter your Blink title",
                type: "text",
                required: true
              },
              {
                name: "desc",
                label: "Enter the blinks description",
                type: "textarea",
                required:true
              },
              {
                name: "url",
                label: "Enter the live Blink url",
                type: "url",
                required:true
              },
              {
                name: "source",
                label: "source e.g Jupiter",
                type: "text",
                required:true
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
      const LOGO = url.origin+"/blinksAgent/banner.jpg";
      const request: ActionPostRequest = await req.json();
      const payer = new PublicKey(request.account);
      console.log("payer is: ",payer.toBase58());
      const strategy = url.searchParams.get("strategy") == "complete" ? true :false;
  
        if(!strategy){
            //When there is a new regsitration
            const title = url.searchParams.get("title");
            const desc = url.searchParams.get("desc");
            const imageUrl = url.searchParams.get("url");
            const source = url.searchParams.get("source");

            //store temporarily in map
            const data = {
                title:title,
                desc:desc,
                imageUrl:imageUrl,
                source:source
            }
            userProgess.set(payer.toBase58(), JSON.stringify(data));

            //get live price from Binance price feeds
            const resp = await axios.get("https://api.binance.com/api/v3/ticker/price?symbol=SOLUSDT");
            const price = resp.data?.price;  

            const amount_in_sol = Number((1/price).toFixed(2));
            console.log(`price is: ${price}, and amount in SOL: ${amount_in_sol}`);
        
            const receiver = new PublicKey(destinationWallet);
        
            const transaction = await prepareTransaction(
            connection,
            payer,
            receiver,
            amount_in_sol
            );
        
            const response: ActionPostResponse = {
            type: "transaction",
            transaction: Buffer.from(transaction.serialize()).toString("base64"),
            links: {
                next:{
                    type:'post',
                    href: `/api/action/register?strategy=complete&address=${payer.toBase58()}`
                }
            }
            };
        
            return Response.json(response, { status: 200, headers });
        }else{
            console.log("Inside complete now..");
            const id = url.searchParams.get("address")
            console.log("payer is now", id);

            const data = JSON.parse(userProgess.get(id));
            const formData = new FormData;
            formData.append("title", data.title)
            formData.append("desc", data.desc)
            formData.append("url", data.imageUrl)
            formData.append("source", data.source)

            await Add(formData);
            console.log("added to db");

            userProgess.delete(payer);
            console.log("deleted from map");

            const response :CompletedAction = {
                type: 'completed',
                icon: LOGO,
                title: `Success!`,
                label: `Register`,
                description: `Your Blinks has been successfully added to the database`,
            }

            return Response.json(response, { status: 200, headers });
            
        }
    } catch (error) {
        
      console.error("Error processing request:", error);
      return new Response(JSON.stringify({ error: "Internal server error" }), {
        status: 500,
        headers,
      });
    }
  };
  
  const prepareTransaction = async (
    connection: Connection,
    payer: PublicKey,
    receiver: PublicKey,
    amount: number
  ) => {
    const instruction = SystemProgram.transfer({
      fromPubkey: payer,
      toPubkey: new PublicKey(receiver),
      lamports: amount * LAMPORTS_PER_SOL,
    });
  
    const { blockhash } = await connection.getLatestBlockhash();
  
    const message = new TransactionMessage({
      payerKey: payer,
      recentBlockhash: blockhash,
      instructions: [instruction],
    }).compileToV0Message();

    return new VersionedTransaction(message);
  };