"use client";

import { useEffect, useRef, useState } from "react";
import { Content } from "@/components/ui/Content";

interface Question {
  title: string;
  html: string;
}
function Question({ question, index }: { question: Question; index: number }) {
  const [open, setOpen] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = panel.current!;
    if (!open && element.hidden) return;
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const from = element.hidden ? 0 : element.getBoundingClientRect().height;
    element.hidden = false;
    element.inert = !open;
    const to = open
      ? element.firstElementChild!.getBoundingClientRect().height
      : 0;
    const animation = element.animate(
      [
        { height: `${from}px`, overflow: "hidden" },
        { height: `${to}px`, overflow: "hidden" },
      ],
      { duration: motion.matches ? 0 : 400, easing: "ease-in-out" },
    );
    animation.onfinish = () => {
      element.hidden = !open;
      element.style.removeProperty("height");
    };
    const finish = () => animation.finish();
    motion.addEventListener("change", finish);
    return () => {
      element.style.height = `${element.getBoundingClientRect().height}px`;
      animation.onfinish = null;
      animation.cancel();
      motion.removeEventListener("change", finish);
    };
  }, [open]);
  return (
    <li data-commitment="">
      <h3>
        <button
          type="button"
          data-commitment-toggle=""
          id={`commitment-button-${index}`}
          aria-expanded={open}
          aria-controls={`commitment-panel-${index}`}
          onClick={() => setOpen(!open)}
        >
          <span>{question.title}</span>
          <span className="commitment-plus" aria-hidden="true" />
        </button>
      </h3>
      <div
        ref={panel}
        data-commitment-panel=""
        id={`commitment-panel-${index}`}
        aria-labelledby={`commitment-button-${index}`}
        hidden
        inert
      >
        <Content className="commitment-content" html={question.html} />
      </div>
    </li>
  );
}
export function Commitment({ questions }: { questions: Question[] }) {
  return (
    <section className="commitment-section" aria-labelledby="faq-title">
      <h2 id="faq-title" className="commitment-heading">
        Trải nghiệm mua sắm tại <span className="text-primary">TTG SHOP</span>
        <br />
        <span className="commitment-large">
          Cam Kết 100% <span className="commitment-gradient">Hài Lòng</span>
        </span>
      </h2>
      <div className="commitment-list">
        <ol>
          {questions.map((q, i) => (
            <Question key={i} question={q} index={i} />
          ))}
        </ol>
      </div>
    </section>
  );
}
