interface ClaimOrbProps {
  data: {
    long: number;
    lat: number;
  };
}
export const ClaimOrb = ({ data }: ClaimOrbProps) => {
  return (
    <>
      <div className="p-5 bg-white w-1/2 h-3/4">
        <p>Claim Orb!</p>
        <p>Long: {data.long}</p>
        <p>Lat: {data.lat}</p>
      </div>
    </>
  );
};
