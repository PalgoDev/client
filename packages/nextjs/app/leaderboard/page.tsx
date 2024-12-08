// pages/leaderboard.tsx
import { FC } from "react";
import { fetchLeaderboardRanks } from "~~/actions/getLBRanks";

interface LeaderboardEntry {
  wins: number;
  losses: number;
  draws: number;
  email: string;
}

const Leaderboard = async () => {
  const ranks = await fetchLeaderboardRanks();

  console.log(ranks, "raRANKSks");

  const sortedRanks = ranks.sort((a: any, b: any) => b.wins - a.wins);

  return (
    <div className="bg-background min-h-screen flex flex-col items-start py-6 px-16">
      <h1 className="text-primary text-2xl font-bold mb-6">Leaderboard</h1>
      <div className="w-full max-w bg-background rounded-lg shadow-sm">
        <div className="flex justify-start text-accent font-semibold border-b border-divider pb-2">
          <span className="mr-5 w-[40%]">Email</span>
          <span className="mr-5 w-[10%]">Wins</span>
          <span className="mr-5 w-[10%]">Losses</span>
          <span className="mr-5 w-[10%]">Draws</span>
        </div>
        <ul>
          {sortedRanks.map((entry: any) => (
            <li key={entry.email} className="flex justify-start py-2 px-1 even:bg-accent/10">
              <span className="mr-5 w-[40%] overflow-hidden text-ellipsis">{entry.email}</span>
              <span className="mr-5 w-[10%]">{entry.wins}</span>
              <span className="mr-5 w-[10%]">{entry.losses}</span>
              <span className="mr-5 w-[10%]">{entry.draws}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Leaderboard;
