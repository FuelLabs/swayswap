import { RiArrowUpDownLine } from "react-icons/ri";

const style = {
  confirmButton: `rounded-2xl font-semibold p-1 border border-[#20242A] bg-[#191B1F] border-4 rounded-2xl cursor-pointer`,
};

export function InvertButton({ onClick }: { onClick: () => void }) {
  return (
    <div onClick={onClick} className={style.confirmButton}>
      <RiArrowUpDownLine size={32} />
    </div>
  );
}
