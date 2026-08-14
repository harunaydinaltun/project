import ExtraDetails from "../ExtraDetails";

export const Extra = ({
  extras,
  setSelectedExtras,
  selectedExtras,
  daysDiff,
}) => {
  const handleExtraToggle = (extra) => {
    setSelectedExtras((prevExtras) => {
      const isAlreadySelected = prevExtras.some((item) => item.id === extra.id);

      if (isAlreadySelected) {
        return prevExtras.filter((item) => item.id !== extra.id);
      } else {
        return [...prevExtras, extra];
      }
    });
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {extras.map((extra) => (
        <ExtraDetails
          key={extra.id}
          extra={extra}
          daysDiff={daysDiff}
          selectedExtras={selectedExtras}
          onSelect={handleExtraToggle}
        />
      ))}
    </div>
  );
};

export default Extra;
