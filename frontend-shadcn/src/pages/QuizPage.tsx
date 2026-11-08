import { useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  ChartColumnBig,
  Briefcase,
  Clock,
  CodeXml,
  Compass,
  Palette,
  RotateCcw,
  Sparkles,
  Sprout,
  TrendingUp,
  Trophy,
  type LucideIcon,
} from "lucide-react";
import CourseCard from "@/components/CourseCard";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { useApiData } from "@/hooks/useApiData";
import { pageContainer, panelStyle } from "@/lib/styles";
import { cn } from "@/lib/utils";
import { getCareerPathRoadmaps } from "@/services/careerPathService";
import { getCourses } from "@/services/courseService";
import type { Course } from "@/types/Course";
import type { CareerPathDetails } from "@/types/CareerPath";

type Option = { value: string; label: string; detail: string; icon: LucideIcon };
type Question = { id: "goal" | "level" | "time"; title: string; options: Option[] };

const QUESTIONS: Question[] = [
  {
    id: "goal",
    title: "What would you like to do?",
    options: [
      { value: "web", label: "Build websites & apps", detail: "Front-end, back-end, full-stack", icon: CodeXml },
      { value: "data", label: "Work with data", detail: "SQL, Python, dashboards", icon: ChartColumnBig },
      { value: "design", label: "Design experiences", detail: "UI/UX and visual design", icon: Palette },
      { value: "business", label: "Grow a business", detail: "Management & marketing", icon: Briefcase },
    ],
  },
  {
    id: "level",
    title: "How much experience do you have?",
    options: [
      { value: "beginner", label: "I'm new to this", detail: "Start from the basics", icon: Sprout },
      { value: "some", label: "I know a little", detail: "I've tried a course or two", icon: TrendingUp },
      { value: "experienced", label: "I'm comfortable", detail: "I want to level up", icon: Trophy },
    ],
  },
  {
    id: "time",
    title: "How much time can you give each week?",
    options: [
      { value: "low", label: "Under 5 hours", detail: "One short course at a time", icon: Clock },
      { value: "mid", label: "5–10 hours", detail: "A steady pace", icon: Clock },
      { value: "high", label: "10+ hours", detail: "Ready for a full path", icon: Clock },
    ],
  },
];

const KEYWORDS: Record<string, RegExp> = {
  web: /web|full[- ]?stack|front|back|react|asp|developer|software|javascript|api/i,
  data: /data|analy|sql|python|power ?bi|excel|statistic|machine|ai\b/i,
  design: /design|ui|ux|figma|graphic/i,
  business: /business|manage|market|project|leader|entrepreneur/i,
};

async function loadQuizData() {
  const [paths, courses] = await Promise.all([
    getCareerPathRoadmaps(10).catch(() => [] as CareerPathDetails[]),
    getCourses({ pageSize: 50 }).then((page) => page.items),
  ]);
  return { paths, courses };
}

// "Help me choose": 3 questions → a recommended career path and courses
function QuizPage() {
  const { data, loading } = useApiData(loadQuizData);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<Record<Question["id"], string>>>({});

  const done = step >= QUESTIONS.length;
  const question = QUESTIONS[Math.min(step, QUESTIONS.length - 1)];

  const result = useMemo(() => (done && data ? recommend(answers, data.paths, data.courses) : null), [done, data, answers]);

  const choose = useCallback((value: string) => {
    setAnswers((current) => ({ ...current, [question.id]: value }));
    setStep((current) => current + 1);
  }, [question.id]);

  function restart() {
    setAnswers({});
    setStep(0);
  }

  return (
    <>
      <PageHeader
        eyebrow="Help me choose"
        title="Find your best starting point"
        description="Answer three quick questions and we'll suggest a career path and the courses to begin with."
      />
      <div className={cn(pageContainer, "max-w-4xl py-10")}>
        {/* Progress dots */}
        <ol aria-label="Quiz progress" className="mb-8 flex items-center justify-center gap-2">
          {QUESTIONS.map((q, i) => (
            <li
              key={q.id}
              aria-current={i === step ? "step" : undefined}
              className={cn("h-2 rounded-full transition-all duration-300", i < step ? "w-8 bg-sand" : i === step ? "w-12 bg-primary" : "w-8 bg-secondary")}
            >
              <span className="sr-only">Question {i + 1}{i < step ? " (answered)" : ""}</span>
            </li>
          ))}
        </ol>

        {!done ? (
          <section key={question.id} className="duration-300 animate-in fade-in slide-in-from-right-4">
            <p className="text-center text-xs font-semibold tracking-[0.2em] text-sand-deep uppercase">
              Question {step + 1} of {QUESTIONS.length}
            </p>
            <h2 className="mt-2 text-center text-3xl font-semibold text-balance">{question.title}</h2>
            <ul className={cn("mt-8 grid gap-4", question.options.length === 4 ? "sm:grid-cols-2" : "sm:grid-cols-3")}>
              {question.options.map((option) => (
                <li key={option.value}>
                  <button
                    type="button"
                    onClick={() => choose(option.value)}
                    aria-pressed={answers[question.id] === option.value}
                    className={cn(
                      panelStyle,
                      "group flex h-full w-full flex-col items-start gap-3 p-5 text-left transition duration-300 outline-none hover:-translate-y-1 hover:border-sand hover:shadow-xl hover:shadow-primary/10 focus-visible:ring-3 focus-visible:ring-ring/50 motion-reduce:hover:translate-y-0",
                      answers[question.id] === option.value && "border-sand ring-2 ring-sand/50",
                    )}
                  >
                    <span className="flex size-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground transition-transform duration-300 group-hover:-rotate-6">
                      <option.icon aria-hidden className="size-5" />
                    </span>
                    <span className="font-semibold">{option.label}</span>
                    <span className="text-sm text-muted-foreground">{option.detail}</span>
                  </button>
                </li>
              ))}
            </ul>
            {step > 0 && (
              <Button variant="link" className="mt-6 px-0 text-sand-deep" onClick={() => setStep((s) => s - 1)}>
                <ArrowLeft data-icon="inline-start" /> Back
              </Button>
            )}
          </section>
        ) : loading || !result ? (
          <p className="py-16 text-center text-muted-foreground">Finding your match…</p>
        ) : (
          <section className="duration-500 animate-in fade-in zoom-in-95">
            <div className="relative overflow-hidden rounded-3xl bg-primary p-8 text-primary-foreground shadow-xl shadow-primary/20">
              <div aria-hidden className="bg-andalusia-pattern pointer-events-none absolute inset-0 opacity-15" />
              <div className="relative">
                <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-sand uppercase">
                  <Sparkles aria-hidden className="size-4" /> Your match
                </p>
                {result.path ? (
                  <>
                    <h2 className="mt-2 text-3xl font-semibold">{result.path.title}</h2>
                    {result.path.shortDescription && <p className="mt-2 max-w-xl text-primary-foreground/75">{result.path.shortDescription}</p>}
                  </>
                ) : (
                  <h2 className="mt-2 text-3xl font-semibold">Start with these courses</h2>
                )}
                <p className="mt-3 max-w-xl text-sm text-primary-foreground/75">{result.advice}</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  {result.path && (
                    <Button asChild size="lg" className="rounded-full bg-sand px-5 text-primary hover:bg-sand/85">
                      <Link to={`/career-paths/${result.path.id}`}>
                        See the full path <ArrowRight data-icon="inline-end" />
                      </Link>
                    </Button>
                  )}
                  <Button size="lg" variant="outline" onClick={restart} className="rounded-full border-primary-foreground/30 bg-transparent px-5 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
                    <RotateCcw data-icon="inline-start" /> Start over
                  </Button>
                </div>
              </div>
            </div>

            {result.courses.length > 0 && (
              <>
                <h3 className="mt-10 flex items-center gap-2 text-2xl font-semibold">
                  <Compass aria-hidden className="size-6 text-sand-deep" /> Recommended courses
                </h3>
                <ul className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {result.courses.map((course) => (
                    <li key={course.id}>
                      <CourseCard course={course} />
                    </li>
                  ))}
                </ul>
              </>
            )}
          </section>
        )}
      </div>
    </>
  );
}

type Answers = Partial<Record<Question["id"], string>>;

// Picks the path / courses whose text matches the chosen field, then orders them by level and time
function recommend(answers: Answers, paths: CareerPathDetails[], courses: Course[]) {
  const pattern = KEYWORDS[answers.goal ?? ""] ?? /./;
  const matches = (text: string) => pattern.test(text);

  const path =
    paths
      .map((p) => ({ p, score: (matches(p.title) ? 3 : 0) + (matches(p.recommendedSkills ?? "") ? 2 : 0) + (matches(p.shortDescription ?? "") ? 1 : 0) }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)[0]?.p ?? null;

  const open = (c: Course) => (c.status === "OpenForEnrollment" ? 0 : c.status === "ComingSoon" ? 1 : 2);
  let picks = path
    ? path.recommendedCourses
    : courses.filter((c) => matches(`${c.title} ${c.categoryName} ${c.shortDescription ?? ""}`));
  if (picks.length === 0) picks = courses;

  // Beginners and short weeks: shorter courses first; experienced: keep the path order (later steps are more advanced)
  const ordered = [...picks].sort((a, b) => {
    if (answers.level === "experienced") return 0;
    return answers.time === "low" ? a.durationHours - b.durationHours : open(a) - open(b);
  });
  const count = answers.time === "high" ? 3 : answers.time === "mid" ? 2 : 1;
  const chosen = (answers.level === "experienced" && ordered.length > 1 ? ordered.slice(1) : ordered).slice(0, Math.max(count, 1));

  const advice =
    answers.level === "beginner"
      ? "You're starting fresh, so begin with the first course and build up step by step."
      : answers.level === "experienced"
        ? "You already have the basics, so we skipped the introduction and went for the next steps."
        : "You know a little already, so these courses will fill the gaps and move you forward.";
  const pace =
    answers.time === "low"
      ? " With under 5 hours a week, take one course at a time."
      : answers.time === "high"
        ? " With 10+ hours a week, you can follow the whole path."
        : " At 5–10 hours a week, two courses back to back works well.";

  return { path, courses: chosen.length ? chosen : courses.slice(0, 3), advice: advice + pace };
}

export default QuizPage;
