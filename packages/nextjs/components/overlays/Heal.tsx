import { useCallback, useState } from "react";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { IMAGE_URL } from "~~/config";
import { notification } from "~~/utils/scaffold-eth";
import { useAtomValue } from "jotai";
import { chainAtom } from "~~/state/chainAtom";

interface HealProps {
  data: {
    type: "POTION" | "SUPER POTION";
    long: number;
    lat: number;
  };
  onDismiss: () => void;
}
export const Heal = ({ data, onDismiss }: HealProps) => {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const chainId = useAtomValue(chainAtom)

  const handleClaim = useCallback(async () => {
    setIsLoading(true);
    if (!session?.user?.email) {
      console.error("No email present in user session. Try to login again.");
      return;
    }

    try {
      notification.info("Claiming potion...");

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contract/mint/claimPotion`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: session?.user?.email,

          chainId,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to claim potion");
      }

      notification.success("Claimed potion!");
      onDismiss();
    } catch (e) {
      console.error("Error while claiming potion", e);
      notification.error("Error while claiming potion");
    } finally {
      setIsLoading(false);
    }
  }, [session?.user?.email]);

  return (
    <>
      <div className="w-[95%] md:w-1/2 h-[60%] rounded-xl bg-white bg-opacity-80 backdrop-blur-md transition-all">
        <div className="flex justify-center -mt-16">
          <img src={IMAGE_URL.Chill_guy} width="104" height="104" className="rounded-full" />
        </div>

        <div className="mt-6">
          <h1 className="font-bold text-center text-3xl font-serif">Heal!</h1>
          <h3 className="text-gray-400 text-sm text-center">
            {data.lat}, {data.long}
          </h3>
        </div>

        <div className="mt-10 flex justify-center space-x-2">
          <button
            className="font-bold bg-green-700 text-white px-4 py-2 rounded-xl"
            onClick={handleClaim}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="animate-spin" />
                Claiming...
              </div>
            ) : (
              "Claim a potion"
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
