import ColorFilterBox from "./ColorFilterBox";
import ModelFilterBox from "./ModelFilterBox";

const SearchSideBar = ({ t }) => {
  return (
    <div className="flex flex-col justify-between rounded-2xl max-w-40 bg-gray-100 p-3 ring-1 ring-slate-100 shadow-lg">
      <ColorFilterBox t={t}></ColorFilterBox>
      <ModelFilterBox t={t}></ModelFilterBox>
    </div>
  );
};

export default SearchSideBar;
