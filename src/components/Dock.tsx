import { dockApps } from "#constants/index";
import useWindowStore from "#store/window";
import { useRef } from "react";
import { Tooltip } from "react-tooltip";

interface DockApp {
  id: string;
  name: string;
  icon: string;
  canOpen: boolean;
}

const Dock = () => {
  const { openWindow, closeWindow, windows } = useWindowStore();
  const dockRef = useRef<HTMLDivElement>(null);

  const toggleApp = (app: DockApp) => {
    if (!app.canOpen) return;
    const window = windows[app.id];
    if (window.isOpen) {
      closeWindow(app.id);
    } else {
      openWindow(app.id);
    }
    console.log(windows);
  };
  return (
    <section id="dock">
      <div ref={dockRef} className="dock-container">
        {dockApps.map((app) => (
          <div key={app.id} className="relative flex justify-center flex-col">
            <button
              type="button"
              className="dock-icon hover:-translate-y-3 hover:scale-110 transition-all duration-300 ease-out"
              aria-label={app.name}
              data-tooltip-id="dock-tooltip"
              data-tooltip-content={app.name}
              data-tooltip-delay-show={150}
              disabled={!app.canOpen}
              onClick={() => toggleApp(app)}
            >
              <img
                src={`/images/${app.icon}`}
                alt={app.name}
                loading="lazy"
                className={app.canOpen ? "" : "opacity-60"}
              />
            </button>
            <p className="text-gray-900 text-center">{app.name}</p>
          </div>
        ))}
        <Tooltip id="dock-tooltip" place="top" className="tooltip" />
      </div>
    </section>
  );
};

export default Dock;
