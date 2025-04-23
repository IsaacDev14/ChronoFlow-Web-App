import { useState } from "react";
import MonthCard from "../components/MonthCard";
import SideBar from "../components/SideBar";

const Home = () => {
  const [view, setView] = useState<"day" | "week" | "month">("month");
  return (
    <>
      <div className="flex h-screen">
        <SideBar setView={setView} currentView={view}/>
        <main className="flex-1 p-4 overflow-auto">
          {view === "month" && <MonthCard />}
        </main>
      </div>
    </>
  );
};

export default Home;
