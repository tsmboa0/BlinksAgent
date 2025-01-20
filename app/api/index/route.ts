//This serves as an entry point to the application. It opens stream connections to X and await responses.
"use server"

import { streamClient } from "@/utils/configs";
// import { ETwitterStreamEvent, TTweetv2TweetField } from "twitter-api-v2";
// import { callAgent } from "../agent/route";


export async function GET(req: Request){
    console.log("GET received");

    const response = {
        name:"Hello Blinks agent",
    }
    
    return new Response(JSON.stringify(response), {status: 200});
}
export async function POST(req: Request){
    console.log("POST received");

    // startPolling()

    return new Response("success!", {status: 200});
}

const rClient = streamClient.readOnly

const fetchMentions = async () => {
    console.log("starting fetch...");
    try {
        // Perform the search
        const mentions : any = await rClient.v2.userMentionTimeline("1831747022832975872");

        console.log("The mention is: ", mentions);

        if (mentions.data && mentions.data.length){
            for (const tweet of mentions){
                const tweetText = tweet.text;
                console.log(tweetText);
            }
        }

    } catch (error:any) {
        console.error('Error fetching mentions:', error.code, error.data || error.message);
    }

    fetchMentions();

 
};

// Poll every 30 seconds
// const startPolling = async ()=>{
//     console.log("Starting long polling...");
//     setInterval(fetchMentions, 60000);
// };