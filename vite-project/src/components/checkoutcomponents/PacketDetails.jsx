import { RiStarSFill } from "react-icons/ri";
export const PacketDetails = ({ packet, selected, onSelect }) => {
  return (
    <div
      className={`flex flex-col bg-slate-50 p-3 rounded-xl shadow-lg border-2 cursor-pointer xl:w-1/3 hover:shadow-xl duration-300 ${selected.id === packet.id ? `border-blue-500 scale-[1.02]` : `border-slate-300`} `}
      onClick={onSelect}
    >
      {" "}
      {packet.isRecommended ? (
        <div className="text-green-700 absolute flex ">
          <RiStarSFill /> <p className="text-xs">EN ÇOK TERCİH EDİLEN</p>
        </div>
      ) : (
        ""
      )}
      <h1 className="self-center text-xl font-semibold text-shadow-2xs border-b mt-3.5">
        {packet.name}
      </h1>
      <span className="self-center">
        <b>Günlük / </b>
        {packet.price}₺
      </span>
      <span>{packet.details}</span>
      <ul className="bg-slate-200 shadow-md shadow-blue-100 rounded-md p-1.5 ring-1 ring-blue-100 mt-1.5">
        {packet.features.map((feature, index) => (
          <li key={index}>• {feature}</li>
        ))}
      </ul>
      <button
        className={`mt-auto rounded-2xl cursor-pointer ${
          selected.id === packet.id
            ? "invisible"
            : "bg-green-600 text-white ring ring-green-500 shadow-md"
        }`}
      >
        EKLE
      </button>
    </div>
  );
};

export default PacketDetails;
