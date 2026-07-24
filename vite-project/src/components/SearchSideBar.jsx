import ColorFilterBox from "./ColorFilterBox";
import BrandFilterBox from "./BrandFilterBox";
import ModelFilterBox from "./ModelFilterBox";
import BodyTypeFilterBox from "./BodyTypeFilterBox";
import DoorsFilterBox from "./DoorsFilterBox";
import FuelTypeFilterBox from "./FuelTypeFilterBox";
import GearTypeFilterBox from "./GearTypeFilterBox";
import MinAgeFilterBox from "./MinAgeFilterBox";

const SearchSideBar = ({
  t,
  filters,
  brands,
  models,
  colors,
  bodyTypes,
  doors,
  fuelTypes,
  gearTypes,
  minAges,
  onFilterChange,
}) => {
  return (
    <div className="flex flex-col rounded-2xl max-w-40 max-h-fit bg-gray-100 p-3 ring-1 ring-slate-100 shadow-sm sticky top-3">
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
      <GearTypeFilterBox
        t={t}
        gearTypes={gearTypes}
        filters={filters}
        onFilterChange={onFilterChange}
      />
      <MinAgeFilterBox
        t={t}
        minAges={minAges}
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
    </div>
  );
};

export default SearchSideBar;
