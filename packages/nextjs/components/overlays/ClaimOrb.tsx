import { IMAGE_URL } from "~~/config";

interface ClaimOrbProps {
  data: {
    long: number;
    lat: number;
  };
  onDismiss: () => void;
}
export const ClaimOrb = ({ data, onDismiss }: ClaimOrbProps) => {
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
          <button className="font-bold bg-purple-700 text-white px-4 py-2 rounded-xl" onClick={onDismiss}>
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
