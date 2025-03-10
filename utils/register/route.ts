
import axios from "axios";
import { PublicKey, clusterApiUrl, Transaction, SystemProgram, LAMPORTS_PER_SOL, Connection, sendAndConfirmTransaction } from "@solana/web3.js";

const connection = new Connection(clusterApiUrl("devnet"));
const to = new PublicKey("3CZsEaQpsRVxtMBEgdmhe7CPtNs3oxictAz3PgtEZJRQ");


export async function RegisterAPI(title: string, desc:string, url:string, source:string, pubKey:PublicKey, sendTx:any){

    try{
        const response = await axios.get("https://api.binance.com/api/v3/ticker/price?symbol=SOLUSDT");
        const price = response.data?.price;  

        const amount_in_sol = parseFloat((1/price).toFixed(2));
        console.log(`price is: ${price}, and amount in SOL: ${amount_in_sol}`);

        const tx = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: pubKey,
                toPubkey:to,
                lamports: amount_in_sol* LAMPORTS_PER_SOL
            })
        );
        tx.feePayer=pubKey;
        const {blockhash} = await connection.getLatestBlockhash();
        tx.recentBlockhash = blockhash;

        console.log("sending Tx");

        const res = await sendTx(tx, connection);
        console.log("awaiting confirmation")

        await connection.confirmTransaction(res, "confirmed");
        console.log("confirmed");

        const data = {
            title:title,
            desc:desc,
            imageUrl:url,
            source:source
        }

        const register = await fetch('/api/db', {
            method: "POST",
            headers:{"Content-Type": "application/json"},
            body:JSON.stringify(data)
        });

        // const resp = await register.json();
        console.log("res from db ");

        return {success:true};      
    }
    catch(e){
        console.log("the api call in the utils failed");
        return {success:false};
    }
}