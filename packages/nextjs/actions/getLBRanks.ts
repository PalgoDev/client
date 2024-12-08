"use server";

export const fetchLeaderboardRanks = async () => {
  console.log("request to fetch leaderboard ranks");
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/leaderboard/top/10`);
    const res = await response.json();
    console.log(res, "response from fetching leaderboard ranks");
    return res;
  } catch (error) {
    console.error(error, "error from fetching leaderboard ranks");
    return {
      error: "Error fetching leaderboard ranks",
      status: 500,
    };
  }
};
