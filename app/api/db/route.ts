"use server"
import { Client } from "@/utils/configs";
const client = await Client.connect();
const collection = client.db("BlinksAgent").collection("blinks");


export async function Add(data:FormData){
    const title = data.get("title");
    const desc = data.get("desc");
    const url = data.get("url");
    const source = data.get("source");

    try{
        const res = await collection.insertOne({title, desc, url, source});
        return {success:true}
        client.close();
    }catch(e){
        console.log("error occured in db",e);
        client.close();
        return {success:true}
    }
}