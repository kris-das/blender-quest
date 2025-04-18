import { useEffect, useState } from 'react';

const missions = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  title: `Day ${i + 1}: Mission`,
  description: `This is your mission for day ${i + 1}. Complete the task to progress!`,
}));

export default function App() {
  const [currentDay, setCurrentDay] = useState(() => {
    const savedDay = localStorage.getItem("currentDay");
    return savedDay ? parseInt(savedDay) : 1;
  });

  const [completed, setCompleted] = useState(() => {
    const saved = localStorage.getItem("completedMissions");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("completedMissions", JSON.stringify(completed));
    localStorage.setItem("currentDay", currentDay);
  }, [completed, currentDay]);

  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    if ("Notification" in window && Notification.permission === "granted") {
      const mission = missions[currentDay - 1];
      new Notification(`Blender Quest - Day ${mission.day}`, {
        body: mission.title,
      });
    }
  }, [currentDay]);

  const handleComplete = () => {
    if (!completed.includes(currentDay)) {
      setCompleted([...completed, currentDay]);
    }
    if (currentDay < missions.length) {
      setCurrentDay(currentDay + 1);
    }
  };

  const mission = missions[currentDay - 1];
  const progress = (completed.length / missions.length) * 100;

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-6">
      <div className="max-w-xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-4">Blender 30-Day Quest</h1>
        <div className="mb-6 w-full bg-gray-700 rounded-full h-2.5">
          <div
            className="bg-green-500 h-2.5 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="bg-zinc-800 p-4 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-2">{mission.title}</h2>
          <p className="mb-4">{mission.description}</p>
          <button
            onClick={handleComplete}
            disabled={completed.includes(currentDay)}
            className={`px-4 py-2 rounded ${
              completed.includes(currentDay) ? "bg-gray-600" : "bg-green-600"
            }`}
          >
            {completed.includes(currentDay) ? "Completed" : "Mark as Complete"}
          </button>
        </div>
        <p className="mt-6 text-sm text-zinc-400">
          Day {currentDay} of 30 | {completed.length} quests completed
        </p>
      </div>
    </div>
  );
}
