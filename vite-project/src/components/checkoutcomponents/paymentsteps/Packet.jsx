import PacketDetails from "../PacketDetails";

export const Packet = ({
  daysDiff,
  packets,
  setSelectedPacket,
  selectedPacket,
}) => {
  return (
    <div className="flex flex-col xl:flex-row gap-4">
      {packets.map((packet) => (
        <PacketDetails
          key={packet.id}
          packet={packet}
          daysDiff={daysDiff}
          selected={selectedPacket}
          onSelect={() => setSelectedPacket(packet)}
        />
      ))}
    </div>
  );
};

export default Packet;
