"use server"

import {ChatGroq} from "@langchain/groq";
import {ChatPromptTemplate} from "@langchain/core/prompts";
// import { SystemMessage, AIMessage, HumanMessage, BaseMessage } from "@langchain/core/messages";
// import { RunnableLambda, RunnableParallel, RunnableBranch } from "@langchain/core/runnables";
// import { ChatOpenAI} from "@langchain/openai";
// import {Client, embeddings, vectorStore} from "@/utils/configs";
import {StringOutputParser} from "@langchain/core/output_parsers";

// const collection = Client.db("BlinksAgent").collection("blinks");
// import {blinksList} from "@/utils/liveblinks";
import { Client } from "@/utils/configs";

const client = await Client.connect();
const collection = client.db("BlinksAgent").collection("blinks");
const blinksList = await collection.find({}).toArray();

const model = new ChatGroq({
    model:"llama-3.3-70b-versatile",
    temperature:0,
    apiKey: process.env.GROQ_API_KEY
});

const example_response = {
    text: "GM! Here is a blink to swap $SOL for $USDC",
    blink_url: "https://theblinkurlhere",
    status: true
}


const prompt_context :any = ChatPromptTemplate.fromMessages([
    ["system",

        `You are BlinkAgent, an intelligent assistant designed to help users find specific "blinks" that match their requests. A "blink" is a structured object containing metadata such as a summary of what the blinks does, a name, description, source, and URL for performing Solana-based tasks. 

        Your task is to:
        1. Understand the user's request and identify the most relevant blink from a provided list. Make sure you carefully go through the list and understand it accurately. Do not hallucinate when the blinks requested is not present in the list. Do not say it is not present when it clearly is.
        2. Return the blink's "blink_url" along with a brief explanation of why it matches their request.
        3. If no blink matches the request, inform the user politely, indicating that the blink is not available and tell them that the "create new blink" functionality will be added soon.
        Make sure that you check the lists of blinks provided thoroughly to ensure you provide the accurate blink. You must adapt to the user request as much as you can. Do not say the blinks is not available when it is. give answers based on your best judgment.
        Here is the format of a blink object:

        "summary": "A short summary of the blink including metadata.",
        "blink_name": "Name of the blink",
        "blink_desc": "Description of what the blink does",
        "blinks_url": "URL where the blink is located",
        "blinks_source": "The source of the blink"

        You will be given a list of such blinks and a user request. Match the request to a blink based on keywords, intent, or any other relevant information provided in the request.

        Examples:
        1. If the user says, "Give me a blink to swap USDC for SOL," find the blink that facilitates USDC-SOL swaps.
        2. If the user says, "I want to play rock paper scissors game by sendArcade," look for blinks related to that game from SendArcade.
        3. If the user says, "Show me a blink for staking SOL," locate the blink related to staking.

        If multiple blinks match the request, provide the best match based on relevance and user intent.

        Output only the blink_url and the reason for your choice, such as:
        "GM! Here is a blink to swap $SOL for $USDC."
        or 
        "Here is a blink to play rock paper scissors from SendArcade"

        only use the above output response message if the requested blink is availabel. else, tell them it is unavailable in a polite, friendly and professional way

        Your final response should be in a json format containing the text, the url and the status (staus wil be either true or false. If the url is availabe, the status is true and otherwise) e.g:
        {example_response}

        Always prioritize user satisfaction and accuracy in your responses. 

        The list of Blinks are {blinks_list}
    
    `],
    ["human", 
        `{user_prompt}`
    ]
]);

export async function POST(req: Request){

    const user_promt = await req.json();
    console.log("The agent has been called! The prompt is: ",user_promt);

    try{
        const chain = prompt_context.pipe(model).pipe(new StringOutputParser());
        const response = await chain.invoke({"example_response":example_response, "blinks_list":blinksList, "user_prompt":user_promt})

        console.log(response);

        return new Response(JSON.stringify(response), {status:200});
    }catch(e){
        console.log(e);
        return new Response("Internal server error", {status:500});
    }
}