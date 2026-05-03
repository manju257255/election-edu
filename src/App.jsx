import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { Award, CheckCircle2, MessageCircleQuestion } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import Chat from './components/Chat';
import Glossary from './components/Glossary';
import Header from './components/Header';
import JourneyMap from './components/JourneyMap';
import Quiz from './components/Quiz';
import Timeline from './components/Timeline';
import { auth, db } from './firebase';
import { journeySteps } from './data/journeySteps';

const WELCOME_MESSAGE = {
  role: 'assistant',
  content: 'Welcome. Ask me anything about the Indian election process — voter registration, EVMs, VVPAT, the Model Code of Conduct, or how results are declared.',
  createdAt: Date.now(),
  kind: 'welcome',
};

function createSessionId() {
  return `session_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export default function App() {
  const [activeTab, setActiveTab] = useState('chat');
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [learnedSteps, setLearnedSteps] = useState([]);
  const [quizScores, setQuizScores] = useState([]);
  const [status, setStatus] = useState('');
  const sessionIdRef = useRef(createSessionId());

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthReady(true);
    });

    signInAnonymously(auth).catch(() => {
      setStatus('Firebase anonymous auth is not connected yet. Add your Firebase config to enable cloud sync.');
      setAuthReady(true);
      setSessionLoading(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    let active = true;

    async function loadSession() {
      if (!user?.uid) {
        return;
      }

      setSessionLoading(true);
      try {
        const sessionSnap = await getDoc(doc(db, 'sessions', user.uid));
        if (active && sessionSnap.exists()) {
          const data = sessionSnap.data();
          setProfile(normalizeProfile(data.profile || null));
          setLearnedSteps(Array.isArray(data.learnedSteps) ? data.learnedSteps : []);
        }

        const scoresSnap = await getDoc(doc(db, 'quizScores', user.uid));
        if (active && scoresSnap.exists()) {
          setQuizScores(Array.isArray(scoresSnap.data().scores) ? scoresSnap.data().scores : []);
        }
      } catch {
        if (active) {
          setStatus('Cloud data is unavailable right now. The interface is still ready for local exploration.');
        }
      } finally {
        if (active) {
          setSessionLoading(false);
        }
      }
    }

    loadSession();
    return () => {
      active = false;
    };
  }, [user?.uid]);

  async function updateSession(patch) {
    if (!user?.uid) {
      return;
    }

    try {
      await setDoc(doc(db, 'sessions', user.uid), {
        ...patch,
        updatedAt: serverTimestamp(),
      }, { merge: true });
    } catch {
      window.setTimeout(() => {
        setDoc(doc(db, 'sessions', user.uid), {
          ...patch,
          updatedAt: serverTimestamp(),
        }, { merge: true }).catch(() => {});
      }, 2000);
    }
  }

  async function saveProfile(nextProfile) {
    const normalizedProfile = normalizeProfile(nextProfile);
    setProfile(normalizedProfile);
    await updateSession({
      profile: normalizedProfile,
      onboardingCompleted: true,
      learnedSteps,
    });
  }

  async function saveMessages(nextMessages) {
    setMessages(nextMessages);
    await saveChatMessages(nextMessages);
  }

  async function saveChatMessages(nextMessages) {
    if (!user?.uid) {
      return;
    }

    const write = () => setDoc(doc(db, 'sessions', user.uid, 'chats', sessionIdRef.current), {
      sessionId: sessionIdRef.current,
      messages: nextMessages,
      updatedAt: serverTimestamp(),
      createdAt: nextMessages[0]?.createdAt || Date.now(),
    }, { merge: true });

    try {
      await write();
    } catch {
      window.setTimeout(() => {
        write().catch(() => {});
      }, 2000);
    }
  }

  function startFreshChatSession() {
    sessionIdRef.current = createSessionId();
    setMessages([{ ...WELCOME_MESSAGE, createdAt: Date.now() }]);
  }

  async function toggleLearnedStep(stepId) {
    const nextSteps = learnedSteps.includes(stepId)
      ? learnedSteps.filter((item) => item !== stepId)
      : [...learnedSteps, stepId];
    setLearnedSteps(nextSteps);
    await updateSession({ profile, learnedSteps: nextSteps });
  }

  const dashboard = useMemo(() => {
    const bestScore = quizScores.reduce((best, item) => Math.max(best, Number(item.score) || 0), 0);
    const totalMessages = messages.filter((item) => item.role === 'user').length;
    const learnedCount = learnedSteps.length;
    let motivation = 'Start with one journey step or one question. Civic clarity builds quickly.';

    if (learnedCount >= 5 && bestScore >= 6 && totalMessages >= 8) {
      motivation = 'You are building strong election literacy across process, concepts, and practice.';
    } else if (learnedCount >= 3 || bestScore >= 4 || totalMessages >= 4) {
      motivation = 'Good momentum. Add one more quiz attempt or complete the next journey step.';
    }

    return { bestScore, totalMessages, learnedCount, motivation };
  }, [learnedSteps.length, messages, quizScores]);

  function renderTab() {
    if (activeTab === 'chat') {
      return (
        <Chat
          user={user}
          profile={profile}
          messages={messages}
          onSaveProfile={saveProfile}
          onSaveMessages={saveMessages}
          onClearChat={startFreshChatSession}
          loading={!authReady || sessionLoading}
        />
      );
    }

    if (activeTab === 'journey') {
      return <JourneyMap learnedSteps={learnedSteps} onToggleStep={toggleLearnedStep} loading={sessionLoading} />;
    }

    if (activeTab === 'timeline') {
      return <Timeline />;
    }

    if (activeTab === 'glossary') {
      return <Glossary />;
    }

    if (activeTab === 'quiz') {
      return <Quiz user={user} profile={profile} />;
    }

    return <Dashboard data={dashboard} loading={sessionLoading} />;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e8e8e8]">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {status ? (
          <div className="mb-4 rounded-md bg-[#161616] p-3 text-sm leading-6 text-[#888] ring-1 ring-white/10">
            {status}
          </div>
        ) : null}
        {renderTab()}
      </main>
    </div>
  );
}

function normalizeProfile(profile) {
  if (!profile) {
    return null;
  }

  return {
    isFirstTime: profile.isFirstTime ?? profile.isFirstTimeVoter ?? true,
    state: profile.state || 'Maharashtra',
    goal: profile.goal || profile.learningGoal || 'General',
  };
}

function Dashboard({ data, loading }) {
  if (loading) {
    return <div className="grid gap-4 md:grid-cols-3">{[0, 1, 2].map((item) => <div key={item} className="h-32 animate-pulse rounded-lg bg-[#111] ring-1 ring-white/10" />)}</div>;
  }

  const cards = [
    { label: 'Steps learned', value: `${data.learnedCount} of ${journeySteps.length}`, icon: CheckCircle2 },
    { label: 'Quiz best', value: `${data.bestScore}/8`, icon: Award },
    { label: 'Questions asked', value: data.totalMessages, icon: MessageCircleQuestion },
  ];

  return (
    <section className="mx-auto max-w-5xl">
      <div className="mb-6">
        <h2 className="font-serif text-4xl text-[#e8e8e8]">Progress dashboard</h2>
        <p className="mt-2 text-sm leading-6 text-[#888]">{data.motivation}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {cards.map(({ label, value, icon: Icon }) => (
          <article key={label} className="rounded-lg bg-[#111] p-5 ring-1 ring-white/10">
            <Icon className="mb-4 text-[#4ade80]" size={24} aria-hidden="true" />
            <p className="text-sm font-medium text-[#888]">{label}</p>
            <p className="mt-2 text-3xl font-bold text-[#e8e8e8]">{value}</p>
          </article>
        ))}
      </div>
      {data.learnedCount === 0 && data.totalMessages === 0 && data.bestScore === 0 ? (
        <div className="mt-4 rounded-lg bg-[#111] p-5 text-sm leading-6 text-[#888] ring-1 ring-white/10">
          No saved activity yet. Complete onboarding, ask one question, or mark a journey step as learned to populate this dashboard.
        </div>
      ) : null}
    </section>
  );
}
