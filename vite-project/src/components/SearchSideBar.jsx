import BrandFilterBox from "./filtercomponents/BrandFilterBox";
import ModelFilterBox from "./filtercomponents/ModelFilterBox";
import TrimFilterBox from "./filtercomponents/TrimFilterBox";
import EngineSizeFilterBox from "./filtercomponents/EngineSizeFilterBox";
import ColorFilterBox from "./filtercomponents/ColorFilterBox";
import BodyTypeFilterBox from "./filtercomponents/BodyTypeFilterBox";
import DoorsFilterBox from "./filtercomponents/DoorsFilterBox";
import FuelTypeFilterBox from "./filtercomponents/FuelTypeFilterBox";
import GearTypeFilterBox from "./filtercomponents/GearTypeFilterBox";
import MinAgeFilterBox from "./filtercomponents/MinAgeFilterBox";
import PriceFilterBox from "./filtercomponents/PriceFilterBox";
import DateAndLocationFilterBox from "./filtercomponents/DateAndLocationFilterBox";

const SearchSideBar = ({
  t,
  filters,
  brands,
  models,
  trims,
  engineSizes,
  colors,
  bodyTypes,
  doors,
  fuelTypes,
  gearTypes,
  onFilterChange,
  setIsPoppedUp,
}) => {
  return (
    <div className="flex flex-col rounded-2xl max-w-40 max-h-fit bg-gray-100 p-3 ring-1 ring-slate-100 shadow-sm sticky top-3">
      <DateAndLocationFilterBox setIsPoppedUp={setIsPoppedUp} />
      <BrandFilterBox
        t={t}
        brands={brands}
        filters={filters}
        onFilterChange={onFilterChange}
      />
      <ModelFilterBox
        t={t}
        models={models}
        filters={filters}
        onFilterChange={onFilterChange}
      />
      <TrimFilterBox
        t={t}
        trims={trims}
        filters={filters}
        onFilterChange={onFilterChange}
      />
      <EngineSizeFilterBox
        t={t}
        engineSizes={engineSizes}
        filters={filters}
        onFilterChange={onFilterChange}
      />
      <GearTypeFilterBox
        t={t}
        gearTypes={gearTypes}
        filters={filters}
        onFilterChange={onFilterChange}
      />
      <ColorFilterBox
        t={t}
        colors={colors}
        selectedColor={filters?.color}
        onFilterChange={onFilterChange}
      />
      <BodyTypeFilterBox
        t={t}
        bodyTypes={bodyTypes}
        filters={filters}
        onFilterChange={onFilterChange}
      />
      <DoorsFilterBox
        t={t}
        doors={doors}
        filters={filters}
        onFilterChange={onFilterChange}
      />
      <FuelTypeFilterBox
        t={t}
        fuelTypes={fuelTypes}
        filters={filters}
        onFilterChange={onFilterChange}
      />
      <MinAgeFilterBox
        t={t}
        userAge={filters.userAge}
        onFilterChange={onFilterChange}
      />
      <PriceFilterBox
        t={t}
        maxPrice={filters.maxPrice}
        onFilterChange={onFilterChange}
      />
    </div>
  );
};

export default SearchSideBar;
