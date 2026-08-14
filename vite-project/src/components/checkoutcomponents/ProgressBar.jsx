export const ProgressBar = ({ step }) => {
  return (
    <div className="bg-white p-1 rounded-md mb-2 gap-3 pl-7 pr-10 border">
      <span className={step === "packet" ? `font-bold` : ``}>
        Packet <span className="font-medium">⟫</span>{" "}
      </span>
      <span className={step === "extra" ? `font-bold` : ``}>
        Extra <span className="font-medium">⟫</span>{" "}
      </span>
      <span className={step === "credit" ? `font-bold` : ``}>
        {" "}
        Payment <span className="font-medium">⟫</span>{" "}
      </span>
      <span className={step === "confirm" ? `font-bold` : ``}>Confirm </span>
    </div>
  );
};

export default ProgressBar;
