"use server"

import { Client } from "@/utils/configs";
import { NextRequest, NextResponse } from "next/server";



export async function POST(req:NextRequest){

    const {title, desc, imageUrl, source} = await req.json();
    const client = await Client.connect();
    const collection = client.db("BlinksAgent").collection("blinks");

    try{
        const res = await collection.insertOne({title, desc, imageUrl, source});
        client.close();
        console.log("saved!!")
        return new NextResponse(JSON.stringify({success:true}))
    }catch(e){
        console.log("error occured in db",e);
        client.close();
        console.log("db err");
        return new NextResponse(JSON.stringify({success:false}))
    }
}