import { Check, RotateCcw } from 'lucide-react';
import { arrayUnion, doc, getDoc, setDoc } from 'firebase/firestore';
import { useEffect, useMemo, useState } from 'react';
import { db } from '../firebase';
import { askGemini } from '../gemini';
import { fallbackQuizQuestions, parseQuizQuestions } from '../data/quizQuestions';

export default function Quiz({ user, profile }) {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [bestScore, setBestScore] = useState(null);

  const score = useMemo(() => answers.filter((answer) => answer.correct).length, [answers]);
  const complete = questions.length > 0 && answers.length === questions.length;

  useEffect(() => {
    let active = true;

    async function loadQuiz() {
      setLoading(true);
      try {
        if (user?.uid) {
          const scoreSnap = await getDoc(doc(db, 'quizScores', user.uid));
          if (active && scoreSnap.exists()) {
            setBestScore(Number(scoreSnap.data().bestScore) || 0);
          }
        }

        const prompt = `Generate exactly 8 multiple choice questions about the Indian election process for state "${profile?.state || 'India'}" and learning goal "${profile?.goal || 'General'}". Return JSON only in this schema: [{"question":"...","options":["A","B","C","D"],"answerIndex":0,"explanation":"..."}]. The answerIndex must be 0, 1, 2, or 3.`;
        const response = await askGemini([{ role: 'user', content: prompt }], 'Return only valid JSON. Do not include markdown, headings, comments, or prose. The response must be a JSON array of 8 quiz question objects.');
        if (active) {
          setQuestions(parseQuizQuestions(response));
        }
      } catch {
        if (active) {
          setQuestions(fallbackQuizQuestions);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadQuiz();
    return () => {
      active = false;
    };
  }, [profile?.goal, profile?.state, user?.uid]);

  async function chooseAnswer(index) {
    if (selected !== null || complete) {
      return;
    }

    const question = questions[current];
    const nextAnswer = { index, correct: index === question.answerIndex };
    const nextAnswers = [...answers, nextAnswer];
    setSelected(index);
    setAnswers(nextAnswers);

    if (nextAnswers.length === questions.length && user?.uid) {
      setSaving(true);
      try {
        const finalScore = nextAnswers.filter((answer) => answer.correct).length;
        const nextBest = Math.max(bestScore ?? 0, finalScore);
        const scorePayload = {
          uid: user.uid,
          bestScore: nextBest,
          scores: arrayUnion({
            score: finalScore,
            total: questions.length,
            state: profile?.state || '',
            learningGoal: profile?.goal || 'General',
            createdAt: new Date().toISOString(),
          }),
        };
        await setDoc(doc(db, 'quizScores', user.uid), scorePayload, { merge: true });
        setBestScore(nextBest);
      } catch {
        window.setTimeout(() => {
          const finalScore = nextAnswers.filter((answer) => answer.correct).length;
          const nextBest = Math.max(bestScore ?? 0, finalScore);
          setDoc(doc(db, 'quizScores', user.uid), {
            uid: user.uid,
            bestScore: nextBest,
            scores: arrayUnion({
              score: finalScore,
              total: questions.length,
              state: profile?.state || '',
              learningGoal: profile?.goal || 'General',
              createdAt: new Date().toISOString(),
            }),
          }, { merge: true }).catch(() => {});
        }, 2000);
      } finally {
        setSaving(false);
      }
    }
  }

  function nextQuestion() {
    setCurrent((value) => Math.min(value + 1, questions.length - 1));
    setSelected(null);
  }

  function restart() {
    setCurrent(0);
    setSelected(null);
    setAnswers([]);
  }

  if (loading) {
    return <div className="mx-auto max-w-3xl rounded-lg bg-[#111] p-6 ring-1 ring-white/10"><div className="h-72 animate-pulse rounded-md bg-[#1a1a1a]" /></div>;
  }

  if (questions.length === 0) {
    return <div className="mx-auto max-w-3xl rounded-lg bg-[#111] p-8 text-center text-sm text-[#888] ring-1 ring-white/10">No quiz questions are available yet.</div>;
  }

  const question = questions[current];
  const progress = complete ? 100 : (answers.length / questions.length) * 100;

  return (
    <section className="mx-auto max-w-3xl">
      <div className="mb-6">
        <h2 className="font-serif text-4xl text-[#e8e8e8]">Quiz</h2>
        <p className="mt-2 text-sm leading-6 text-[#888]">{bestScore === null ? 'Your best score will appear after your first completed quiz.' : `Your best score: ${bestScore}/8`}</p>
      </div>

      <div className="rounded-lg bg-[#111] p-5 ring-1 ring-white/10">
        <div className="mb-5 h-2 rounded-full bg-[#1a1a1a]">
          <div className="h-full rounded-full bg-[#4ade80]" style={{ width: `${progress}%` }} />
        </div>

        {complete ? (
          <div className="text-center">
            <p className="font-serif text-5xl text-[#e8e8e8]">{score}/8</p>
            <p className="mt-3 text-sm leading-6 text-[#888]">{saving ? 'Saving your score.' : 'Score saved to your progress history.'}</p>
            <button type="button" onClick={restart} className="mt-6 inline-flex h-10 items-center gap-2 rounded-md bg-[#4ade80] px-4 text-sm font-semibold text-[#0a0a0a]">
              <RotateCcw size={16} aria-hidden="true" />
              Try again
            </button>
          </div>
        ) : (
          <>
            <p className="mb-2 text-sm font-semibold text-[#4ade80]">Question {current + 1} of {questions.length}</p>
            <h3 className="text-xl font-semibold leading-8 text-[#e8e8e8]">{question.question}</h3>
            <div className="mt-5 grid gap-3">
              {question.options.map((option, index) => {
                const isSelected = selected === index;
                const isCorrect = question.answerIndex === index;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => chooseAnswer(index)}
                    className={`flex min-h-12 items-center justify-between gap-3 rounded-md p-3 text-left text-sm ring-1 transition ${
                      selected === null
                        ? 'bg-[#161616] text-[#e8e8e8] ring-white/10 hover:bg-[#1f1f1f]'
                        : isCorrect
                          ? 'bg-[#4ade80] text-[#0a0a0a] ring-[#4ade80]'
                          : isSelected
                            ? 'bg-[#1a1a1a] text-[#888] ring-white/10'
                            : 'bg-[#161616] text-[#888] ring-white/10'
                    }`}
                    disabled={selected !== null}
                  >
                    <span>{option}</span>
                    {selected !== null && isCorrect ? <Check size={16} aria-hidden="true" /> : null}
                  </button>
                );
              })}
            </div>
            {selected !== null ? (
              <div className="mt-5 rounded-md bg-[#1a1a1a] p-4 text-sm leading-6 text-[#cfcfcf]">
                {question.explanation}
                <button type="button" onClick={nextQuestion} className="mt-4 block h-10 rounded-md bg-[#4ade80] px-4 font-semibold text-[#0a0a0a]">
                  Next question
                </button>
              </div>
            ) : null}
          </>
        )}
      </div>
    </section>
  );
}
