// do your magic isaac
type SideBarProps = {
    setView: (view: "day" | "week" | "month") => void;
    currentView: "day" | "week" | "month";
  };
  
  const SideBar = ({ setView, currentView }: SideBarProps) => {
    return (
      <div className="w-48 h-screen bg-blue-800 text-white shadow-lg flex flex-col">
        <h2 className="text-2xl font-extrabold text-center py-6 border-b border-blue-400">
          📅 Calendar
        </h2>
  
        <ul className="flex-1 space-y-2 p-4">
          {["day", "week", "month"].map((view) => (
            <li key={view}>
              <button
                onClick={() => setView(view as "day" | "week" | "month")}
                className={`w-full px-4 py-3 cursor-pointer rounded-md text-center font-medium transition-colors duration-200 ${
                  currentView === view
                    ? "bg-emerald-500 text-white shadow-inner"
                    : "bg-orange-500 hover:bg-orange-600 text-white"
                }`}
              >
                {view.charAt(0).toUpperCase() + view.slice(1)} View
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  export default SideBar;
  