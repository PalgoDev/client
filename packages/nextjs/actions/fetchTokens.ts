"use server";

interface FetchTokensRequest {
  long: number;
  lat: number;
}

const LIMIT = 1000;

export const fetchTokens = async (request: FetchTokensRequest) => {
  console.log(request, "request to fetch tokens");
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/entity/?longitude=${request.long}&latitude=${request.lat}&limit=${LIMIT}`,
    );
    const res = await response.json();
    // console.log(res, "response");
    return res;
  } catch (error) {
    console.error(error, "error from fetching tokens");
    return {
      error: "Error fetching tokens",
      status: 500,
    };
  }
};
