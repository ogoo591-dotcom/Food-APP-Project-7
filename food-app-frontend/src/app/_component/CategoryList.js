"use client";

export function CategoryList({ name, count }) {
  return (
    <button
      type="button"
      className="text-neutral-900 inline-flex items-center gap-2 rounded-full border px-5 py-3 text-[15px] font-medium transition "
    >
      <span>{name}</span>
      <span className="rounded-full bg-neutral-900 px-3 py-1 text-xs font-semibold leading-none text-white">
        {count}
      </span>
    </button>
  );
}
