import { useCallback } from "react";
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

  const handleClaim = useCallback(() => {
    if (!session?.user?.email) {
      console.error("No email present in user session. Try to login again.");
      return;
    }

    try {
      notification.info("Claiming ORB...");
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/contract/mint/claimOrb`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: session?.user?.email,
          chainId: 137,
        }),
      });

      notification.success("Claimed ORB!");
      onDismiss();
    } catch (e) {
      console.error("Error while claiming ORB", e);
      notification.error("Error while claiming ORB");
    }
  }, [session?.user?.email]);

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
        </div>

        <div className="mt-10 flex justify-center space-x-2">
          <button className="font-bold bg-purple-700 text-white px-4 py-2 rounded-xl" onClick={handleClaim}>
            Claim
          </button>
          <button className="font-bold bg-gray-700 text-white px-4 py-2 rounded-xl" onClick={onDismiss}>
            Cancel
          </button>
        </div>
      </div>
    </>
  );
};
