import axios from "axios";


export  const solPrice = async()=>{
    const SOL_ID = "So11111111111111111111111111111111111111112";
    const origin = "https://api.jup.ag/price/v2";

    const res = await axios.get(`${origin}?ids=${SOL_ID}`);
    const price = res.data?.data?.[SOL_ID]?.price;

    console.log("the price is : ",price);

    return price
}