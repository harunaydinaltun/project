export const PasswordConditions = ({ conditions, errors, t }) => {
  const showConditions = errors?.password?.length > 0;

  return (
    <div
      className={`grid transition-all duration-500 ease-in-out ${
        showConditions
          ? "grid-rows-[1fr] opacity-100 mt-1"
          : "grid-rows-[0fr] opacity-0"
      }`}
    >
      <div className="overflow-hidden flex flex-col gap-0.5">
        <ConditionItem
          isValid={conditions.length}
          text={t.passwordConditions.length}
        />
        <ConditionItem
          isValid={conditions.lowerCase}
          text={t.passwordConditions.lowerCase}
        />
        <ConditionItem
          isValid={conditions.upperCase}
          text={t.passwordConditions.upperCase}
        />
        <ConditionItem
          isValid={conditions.number}
          text={t.passwordConditions.number}
        />
        <ConditionItem
          isValid={conditions.special}
          text={t.passwordConditions.special}
        />

        <ConditionItem
          isValid={conditions.noSpaces}
          text={t.passwordConditions.noSpaces}
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
