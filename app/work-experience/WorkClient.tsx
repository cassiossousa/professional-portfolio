'use client';

import { useState, useRef, useEffect } from 'react';
import { Translation } from '../../i18n/types';
import { WorkRole } from '../../lib/work-experience/workModel';

interface WorkClientProps {
  roles: WorkRole[];
  t: Translation;
}

export function WorkClient({ roles, t }: WorkClientProps) {
  return (
    <section className="container-main">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
        <h1 className="text-3xl font-bold">{t.workExperience.title}</h1>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <a
            href="/resume"
            target="_blank"
            className="
              w-full sm:w-auto
              text-center
              px-4 py-2
              border
              rounded
              hover:bg-neutral-100
              transition
            "
          >
            📄 {t.workExperience.previewResume}
          </a>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {roles.map((role, index) => (
          <AccordionItem key={`${role.company}-${index}`} role={role} />
        ))}
      </div>
    </section>
  );
}

function AccordionItem({ role }: { role: WorkRole }) {
  const [open, setOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  const { company, title, location, period, bullets } = role;

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (contentRef.current) {
        setHeight(open ? contentRef.current.scrollHeight : 0);
      }
    });

    return () => cancelAnimationFrame(frame);
  }, [open]);

  return (
    <article className="border-b pb-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full justify-between items-start text-left"
      >
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold">{company}</h2>
          <h3 className="text-lg font-semibold text-primary">{title}</h3>
          <p className="text-sm opacity-90">
            {location && `${location} | `}
            {period}
          </p>
        </div>
        <span className="text-2xl">{open ? '▲' : '▼'}</span>
      </button>

      <div
        ref={contentRef}
        style={{
          maxHeight: `${height}px`,
          overflow: 'hidden',
          transition: 'max-height 0.3s ease',
        }}
      >
        <ul className="mt-4 list-disc pl-5 space-y-2">
          {bullets.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
      </div>
    </article>
  );
}
