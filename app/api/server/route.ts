//This serves as an endpoint to store the details of a blinks to our database

// import { OpenAIEmbeddings } from "@langchain/openai";
import { Client, vectorStore } from "@/utils/configs";
import { Document } from "@langchain/core/documents";



async function POST(req: Request){
    const data = req.json();

    const blink = {
        summary: "Betlify collaborates with QuickNode to integrate streaming capabilities, aiming to enhance user experience (UX) by 20% or more. This initiative, named 'Betlify x QuickNode,' showcases the potential impact of QuickNode Streams on Betlify's performance and engagement. Explore and participate in this innovation via Betlify.Fun.",
        blink_name:"Betlify x QuickNode",
        blink_desc: "Will the integration of of QuickNode stream into belify increase the UX by 20% or more",
        blinks_url:"https://www.betlify.fun/play?id=H4c4DvKe6Jj6rG6H5ssQmLjEAcDXsFN1Lf6zxktKns8u",
        blinks_source: "Betlify.Fun"
    }

    await Client.db("BlinksAgent").collection("blinks").insertOne(blink)

    const documents : Document[] = [
        {
            pageContent: "some page content here like the description of the blinks",
            metadata: {
                blinks_name: "Name of the blinks goes in here",
                blinks_description: "Description of the blinks here",
                blinks_url: "the live url of the blinks",
                blinks_source: "the source/owner of the blinks"
            }
        }
    ]

    try{
        await vectorStore.addDocuments(documents, {ids:[(new Date().getTime()).toString()]});
        return new Response("Success", {status: 200})
    }catch(e){
        console.log(`an error occured: ${e}`)
        return new Response("Internal server error", {status:500})
    }

}