import useWindowStore from "#store/window";
import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";

type AnyProps = Record<string, unknown>;

/**
 * WindowWrapper HOC
 * - 读取 store 中对应 windowKey 的 isOpen/zIndex
 * - 在 header （#window-header）上支持拖拽（Pointer API）
 * - 点击时调用 focusWindow 置顶
 */
const WindowWrapper = <P extends AnyProps>(
  Component: React.ComponentType<P>,
  windowKey: string
): React.FC<P> => {
  const Wrapped: React.FC<P> = (props) => {
    const { focusWindow, windows } = useWindowStore();
    const win = windows[windowKey];

    const isOpen = win?.isOpen ?? false;
    const zIndex = win?.zIndex ?? 1000;

    const wrapperRef = useRef<HTMLElement | null>(null);
    // local visible state so we can play close animation before removing from DOM
    const [visible, setVisible] = useState<boolean>(isOpen);

    // Animate open/close (fade) and setup Draggable while visible
    useEffect(() => {
      // Open: when store says open but we are not yet visible — mount then animate
      if (isOpen && !visible) {
        requestAnimationFrame(() => {
          setVisible(true);
          const el = wrapperRef.current;
          if (!el) return;
          try {
            gsap.fromTo(
              el,
              { autoAlpha: 0 },
              { duration: 0.26, autoAlpha: 1, ease: "power2.out" }
            );
          } catch (err) {
            void err;
          }
        });
        return;
      }

      // Close: when store closed but element currently visible — play fade out then unmount
      if (!isOpen && visible) {
        const el = wrapperRef.current;
        if (!el) {
          requestAnimationFrame(() => setVisible(false));
          return;
        }
        try {
          gsap.to(el, {
            duration: 0.18,
            autoAlpha: 0,
            ease: "power2.in",
            onComplete: () => setVisible(false),
          });
        } catch (err) {
          void err;
          requestAnimationFrame(() => setVisible(false));
        }
        return;
      }

      // If not visible, nothing else to do
      if (!visible) return;

      const el = wrapperRef.current;
      if (!el) return;

      // prefer header as handle
      const handle = (el.querySelector("#window-header") as HTMLElement) || el;

      // register plugin safely
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (gsap as any).registerPlugin?.((Draggable as any) || Draggable);
      } catch (err) {
        void err;
      }

      // use any-typed Draggable to avoid typing issues
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const DraggableAny: any = Draggable as any;
      // create draggable instance
      const instance = DraggableAny.create(el, {
        type: "x,y",
        trigger: handle,
        bounds: document.body,
        edgeResistance: 0.8,
        onPress: () => {
          focusWindow(windowKey);
        },
      })[0];

      return () => {
        try {
          if (instance && typeof instance.kill === "function") instance.kill();
        } catch (err) {
          void err;
        }
      };
    }, [isOpen, visible, focusWindow]);

    return visible ? (
      <section
        id={windowKey}
        ref={wrapperRef}
        style={{ zIndex: zIndex, display: visible ? "block" : "none" }}
        onPointerDown={() => focusWindow(windowKey)}
        className="absolute"
      >
        <Component {...(props as P)} />
      </section>
    ) : null;
  };

  Wrapped.displayName = `WindowWrapper(${
    Component.displayName || Component.name || "Component"
  })`;

  return Wrapped;
};

export default WindowWrapper;
