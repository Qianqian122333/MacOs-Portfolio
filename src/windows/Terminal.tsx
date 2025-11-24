import { techStack } from "#constants/index";
import WindowWrapper from "#hoc/WindowWrapper";
import { Check, Flag } from "lucide-react";
import Windowcontrols from "#components/Windowcontrols";

const Terminal = () => {
  return (
    <>
      <div
        id="window-header"
        className="flex items-center justify-between px-4 py-2"
      >
        <Windowcontrols target="terminal" />
        <div className="flex items-center gap-3">
          <h2 className="mr-4">Tech Stack</h2>
        </div>
      </div>
      <div className="techstack">
        <p>
          <span className="font-bold">@QianqianWei% </span>
          show tech stack
        </p>
        <div className="label">
          <p className="w-32">Category</p>
          <p>Technologies</p>
        </div>
        <ul className="content">
          {techStack.map(({ category, items }) => (
            <li key={category} className="flex items-center">
              <Check className="check" size={20} />
              <h3>{category}</h3>
              <ul></ul>
              {items.map((item, i) => (
                <li key={i}>
                  {item}
                  {i < items.length - 1 ? "," : ""}
                </li>
              ))}
            </li>
          ))}
        </ul>
        <div className="footnote">
          <p>
            <Check size={20} /> 5 of 5 stacks loaded successfully (100%)
          </p>
          <p className="text-black">
            <Flag size={15} fill="black" />
            Render time: 5ms
          </p>
        </div>
      </div>
    </>
  );
};
const TerminalWindow = WindowWrapper(Terminal, "terminal");

export default TerminalWindow;
