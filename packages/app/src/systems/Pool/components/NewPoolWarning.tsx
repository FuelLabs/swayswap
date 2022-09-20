const style = {
  createPoolInfo: `font-mono mt-4 px-4 py-3 text-sm text-slate-400 decoration-1 border border-dashed
  border-white/10 rounded-xl w-full`,
};

export const NewPoolWarning = () => (
  <div className={style.createPoolInfo} aria-label="create-pool">
    <h4 className="text-orange-400 mb-2 font-bold">
      You are creating a new pool
    </h4>
    <div className="flex">
      You are the first to provide liquidity to this pool. The ratio between
      these tokens will set the price of this pool.
    </div>
  </div>
);
