import type { Metadata } from "next";
import { ModuleList } from "@/components/ModuleList";
import { ResetCourseProgress } from "@/components/ResetCourseProgress";
import { StartLearningButton } from "@/components/StartLearningButton";
import { courseMeta } from "@/content/course";
import { readSession } from "@/lib/session";

export const metadata: Metadata = {
  title: "Course Modules",
};

export default async function ModulesPage() {
  const session = await readSession();

  return (
    <section>
      <div className="modules-intro">
        <h1>Course Modules</h1>
        <p className="muted">
          Complete the modules in order (approx. {courseMeta.runtimeMinutes}{" "}
          minutes).
          <br />
          Learn each element of SCORE, then apply the full framework to a
          realistic workplace challenge.
        </p>
        {!session ? (
          <p className="muted" style={{ marginTop: "1rem" }}>
            New here?{" "}
            <StartLearningButton
              label="Start learning"
              className="btn"
            />{" "}
            to begin the first lesson (creates your learner session).
          </p>
        ) : null}
      </div>
      <ModuleList />
      <ResetCourseProgress />
    </section>
  );
}
