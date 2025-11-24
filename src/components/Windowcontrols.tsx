import useWindowStore from "#store/window";
import React from "react";

const Windowcontrols = ({ target }: { target: string }) => {
  const { closeWindow } = useWindowStore();
  return (
    <div id={`window-controls`}>
      <button
        aria-label={`close-${target}`}
        className="close"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={() => closeWindow(target)}
      />
      <div className="minimize" />
      <div className="maximize" />
    </div>
  );
};

export default Windowcontrols;
