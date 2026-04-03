import { Input } from "./ui/input";
export default function FormInput({ label, name, value, onChange }: any) {
  return (
    <div className="space-y-1">
      <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 ml-2">
        {label}
      </label>
      <Input
        name={name}
        value={value}
        onChange={onChange}
        required
        className="h-11 rounded-xl bg-slate-100 dark:bg-slate-800 border-none dark:text-white focus-visible:ring-2 focus-visible:ring-indigo-500 font-bold"
      />
    </div>
  );
}