"use client";

import { useEffect, useState } from "react";
import {
  MODULE_COMPLETE_EVENT,
  getCompletedModules,
} from "@/lib/module-completion";
import {
  PROGRESS_RESET_EVENT,
  isCourseFullyComplete,
  resetCourseProgressPreservingBaseline,
} from "@/lib/progress-reset";
import { modules } from "@/content/course";

export function ResetCourseProgress() {
  const [eligible, setEligible] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    function refresh() {
      setEligible(isCourseFullyComplete());
    }
    refresh();
    window.addEventListener(MODULE_COMPLETE_EVENT, refresh);
    window.addEventListener(PROGRESS_RESET_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(MODULE_COMPLETE_EVENT, refresh);
      window.removeEventListener(PROGRESS_RESET_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  if (!eligible) return null;

  function handleReset() {
    const completed = getCompletedModules().length;
    const confirmed = window.confirm(
      `Reset course progress?\n\nThis clears checkmarks, lesson answers, the Capstone draft, and your Module 10 retest (${completed}/${modules.length} modules).\n\nYour Module 01 baseline stays locked as your starting snapshot.`,
    );
    if (!confirmed) return;

    const result = resetCourseProgressPreservingBaseline();
    if (!result.ok) {
      setMessage("Reset isn’t available yet. Finish every module first.");
      return;
    }
    setMessage(
      "Progress reset. Module 01 baseline kept. You can walk the course again for practice.",
    );
    setEligible(false);
  }

  return (
    <div className="panel reset-course-panel">
      <h2>Reset course progress</h2>
      <p className="muted" style={{ margin: "0.35rem 0 0.85rem" }}>
        Available after you complete every module. Clears practice progress and
        the Module 10 retest. Your Module 01 baseline stays locked so the
        improvement comparison stays honest.
      </p>
      <button type="button" className="btn btn-secondary" onClick={handleReset}>
        Reset course progress
      </button>
      {message ? (
        <p className="faint" style={{ marginTop: "0.75rem" }}>
          {message}
        </p>
      ) : null}
    </div>
  );
}
