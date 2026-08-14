export const PasswordConditions = ({
  conditions,
  errors,
  t,
  errorKey = "password",
}) => {
  const showConditions = errors?.[errorKey]?.length > 0;

  const condTexts = t?.passwordConditions || {
    length: "En az 6 karakter",
    lowerCase: "En az 1 küçük harf",
    upperCase: "En az 1 büyük harf",
    number: "En az 1 rakam",
    special: "En az 1 özel karakter",
    noSpaces: "Boşluk içermemeli",
  };

  return (
    <div
      className={`grid transition-all duration-500 ease-in-out ${
        showConditions
          ? "grid-rows-[1fr] opacity-100 mt-1"
          : "grid-rows-[0fr] opacity-0"
      }`}
    >
      <div className="overflow-hidden flex flex-col gap-0.5">
        <ConditionItem isValid={conditions.length} text={condTexts.length} />
        <ConditionItem
          isValid={conditions.lowerCase}
          text={condTexts.lowerCase}
        />
        <ConditionItem
          isValid={conditions.upperCase}
          text={condTexts.upperCase}
        />
        <ConditionItem isValid={conditions.number} text={condTexts.number} />
        <ConditionItem isValid={conditions.special} text={condTexts.special} />
        <ConditionItem
          isValid={conditions.noSpaces}
          text={condTexts.noSpaces}
        />
      </div>
    </div>
  );
};

const ConditionItem = ({ isValid, text }) => (
  <span
    className={`text-[11px] transition-colors duration-300 ${
      isValid ? "text-green-600" : "text-red-600"
    }`}
  >
    {text}
  </span>
);
