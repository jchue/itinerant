export default function IconButton({ active = false, addClass, icon, onClick, title }) {
  return (
    <div title={title} className={'cursor-pointer flex items-center justify-center h-9 w-9 rounded-full transition-shadow hover:shadow-emerald-700/50 hover:shadow-glow ' + (active ? 'bg-emerald-700' : ' ') + ` ${addClass}`} onClick={onClick}>
      <span className={'material-symbols-sharp !text-xl ' + (active ? 'text-white' : 'text-emerald-700')}>
        {icon}
      </span>
    </div>
  );
}
