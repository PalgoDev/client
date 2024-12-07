// pages/leaderboard.tsx
import { FC } from "react";

interface LeaderboardEntry {
  rank: number;
  name: string;
  score: number;
}

const leaderboardData: LeaderboardEntry[] = [
  { rank: 1, name: "Jay", score: 1500 },
  { rank: 2, name: "Alice", score: 1400 },
  { rank: 3, name: "Bob", score: 1300 },
  { rank: 4, name: "Charlie", score: 1200 },
  { rank: 5, name: "Dana", score: 1100 },
];

const Leaderboard: FC = () => {
  return (
    <div className="bg-background min-h-screen flex flex-col items-start py-6 px-20">
      <h1 className="text-primary text-2xl font-bold mb-6">Leaderboard</h1>
      <div className="w-full max-w bg-background rounded-lg shadow-sm">
        <div className="flex justify-start text-accent font-semibold border-b border-divider pb-2">
          <span className="mr-5 min-w-[33%]">Rank</span>
          <span className="mr-5 min-w-[33%]">Name</span>
          <span className="mr-5 min-w-[33%]">Score</span>
        </div>
        <ul>
          {leaderboardData.map(entry => (
            <li key={entry.rank} className="flex justify-start py-2 px-1 even:bg-accent/10">
              <span className="mr-5 min-w-[33%]">{entry.rank}</span>
              <span className="mr-5 min-w-[33%] truncate">{entry.name}</span>
              <span className="mr-5 min-w-[33%]">{entry.score}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Leaderboard;
