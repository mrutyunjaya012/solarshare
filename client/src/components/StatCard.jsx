const StatCard = ({ label, value, sublabel, icon: Icon, accent = "green", loading = false }) => {
  const accents = {
    green: "bg-green-50 text-green-700",
    blue: "bg-blue-50 text-blue-700",
    amber: "bg-amber-50 text-amber-700",
    violet: "bg-violet-50 text-violet-700",
  };

  return (
    <div className="panel p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        {Icon && (
          <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${accents[accent] || accents.green}`}>
            <Icon size={18} strokeWidth={2.2} />
          </span>
        )}
      </div>
      <p className="mt-4 font-heading text-2xl font-semibold tracking-tight text-slate-900">
        {loading ? "—" : value}
      </p>
      {sublabel && <p className="mt-1.5 text-xs leading-5 text-slate-500">{sublabel}</p>}
    </div>
  );
};

export default StatCard;
