import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { IMAGE_URL } from "~~/config";
import { notification } from "~~/utils/scaffold-eth";

interface ClaimOrbProps {
  data: {
    long: number;
    lat: number;
  };
  onDismiss: () => void;
}
export const ClaimOrb = ({ data, onDismiss }: ClaimOrbProps) => {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const handleClaim = async () => {
    setIsLoading(true);
    if (!session?.user?.email) {
      console.error("No email present in user session. Try to login again.");
      return;
    }

    try {
      notification.info("Claiming ORB...");

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contract/mint/claimOrb`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: session?.user?.email,
          chainId: 137,
        }),
      });

      console.log("res while claiming orb", res);

      if (!res.ok) {
        throw new Error("Failed to claim ORB");
      }

      notification.success("Claimed ORB!");
      onDismiss();
    } catch (e) {
      console.error("Error while claiming ORB", e);
      notification.error("Error while claiming ORB");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="w-[95%] md:w-1/2 h-1/2 rounded-xl bg-white bg-opacity-80 backdrop-blur-md transition-all">
        <div className="flex justify-center -mt-16">
          <img src={IMAGE_URL.orb} width="124" height="124" />
        </div>

        <div>
          <h1 className="font-bold text-center text-3xl font-serif">Claim ORB</h1>
          <h3 className="text-gray-400 text-sm text-center">
            {data.lat}, {data.long}
          </h3>
          <div className="mt-3 flex justify-center gap-2">
            <span className="badge badge-secondary">+10 Health</span>
            <span className="badge badge-secondary">+3 Attack</span>
            <span className="badge badge-secondary">+1 Defense</span>
          </div>
        </div>

        <div className="mt-10 flex justify-center space-x-2">
          <button
            className="font-bold bg-purple-700 text-white px-4 py-2 rounded-xl flex items-center gap-2"
            onClick={handleClaim}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" />
                Claiming...
              </>
            ) : (
              "Claim"
            )}
          </button>
          <button className="font-bold bg-gray-700 text-white px-4 py-2 rounded-xl" onClick={onDismiss}>
            Cancel
          </button>
        </div>
      </div>
    </>
  );
};
