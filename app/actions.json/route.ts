
import { createActionHeaders, type ActionsJson } from "@solana/actions";

export const GET = async () => {
  console.log("Inside actions.json...");
  const payload: ActionsJson = {
    rules: [
      {
        pathPattern: "/register",
        apiPath: "/api/action/register",
      },
    //   {
    //     pathPattern: "/register/**",
    //     apiPath: "/api/action/register/**",
    //   },
    ],
  };

  return new Response(JSON.stringify(payload), {
    headers: createActionHeaders(),
  });
};

export const OPTIONS = GET;
