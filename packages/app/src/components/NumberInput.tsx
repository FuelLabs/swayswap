import NumberFormat from "react-number-format";

const style = {
  transferPropContainer: `
    bg-gray-700 rounded-2xl p-4 text-3xl border border-gray-700 flex justify-between
  `,
  transferPropInput: `bg-transparent placeholder:text-gray-300 outline-none w-full text-2xl`,
};

export function NumberInput({
  value,
  onChange,
  disabled,
}: {
  disabled?: boolean;
  value?: number | string | null;
  onChange?: (value: string) => void;
}) {
  return (
    <div className={style.transferPropContainer}>
      <div className="flex-1">
        <NumberFormat
          placeholder="0"
          value={value}
          displayType={disabled ? "text" : "input"}
          onValueChange={(e) => onChange?.(e.value)}
          className={style.transferPropInput}
          thousandSeparator={false}
        />
      </div>
    </div>
  );
}
