const style = {
  transferPropContainer: `bg-gray-700 rounded-2xl p-4 text-3xl border border-gray-700
        flex justify-between`,
  transferPropInput: `bg-transparent placeholder:text-gray-300 outline-none w-full text-xl`,
};

export function TextInput({
  value,
  onChange,
  disabled,
  placeholder,
}: {
  disabled?: boolean;
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
}) {
  return (
    <div className={style.transferPropContainer}>
      <input
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.value)}
        className={style.transferPropInput}
      />
    </div>
  );
}
