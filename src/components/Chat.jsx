import { FileUp, Send, Trash2 } from 'lucide-react';
import { ref, uploadBytes } from 'firebase/storage';
import { useEffect, useRef, useState } from 'react';
import { storage } from '../firebase';
import { askGemini, SYSTEM_PROMPT } from '../gemini';

const states = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana',
  'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
  'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands', 'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',
];

const goals = ['Voter Registration', 'How EVMs work', 'Understanding results', 'General'];

export default function Chat({ user, profile, messages, onSaveProfile, onSaveMessages, onClearChat, loading }) {
  const [draft, setDraft] = useState('');
  const [pending, setPending] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [onboarding, setOnboarding] = useState({
    isFirstTime: true,
    state: 'Maharashtra',
    goal: 'General',
  });
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, pending]);

  async function submitOnboarding(event) {
    event.preventDefault();
    await onSaveProfile(onboarding);
  }

  async function sendMessage(contentOverride) {
    const content = (contentOverride || draft).trim();
    if (!content || pending || !profile) {
      return;
    }

    const nextMessages = [...messages, { role: 'user', content, createdAt: Date.now() }];
    setDraft('');
    setPending(true);
    await onSaveMessages(nextMessages);

    try {
      const history = nextMessages
        .filter((message) => !message.error && message.kind !== 'welcome')
        .map(({ role, content: messageContent }) => ({ role, content: messageContent }));
      const reply = await askGemini(history, SYSTEM_PROMPT(profile));
      await onSaveMessages([...nextMessages, { role: 'assistant', content: reply, createdAt: Date.now() }]);
    } catch {
      const errorMessage = 'Could not get a response. Check your API key or try again.';
      await onSaveMessages([...nextMessages, { role: 'assistant', content: errorMessage, createdAt: Date.now(), error: true }]);
    } finally {
      setPending(false);
    }
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  }

  async function uploadDocument(event) {
    const file = event.target.files?.[0];
    if (!file || !user?.uid) {
      return;
    }

    setUploadStatus('Uploading document.');
    try {
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      await uploadBytes(ref(storage, `uploads/${user.uid}/${Date.now()}-${safeName}`), file);
      setUploadStatus('Document stored securely.');
    } catch {
      setUploadStatus('Document upload is unavailable until Firebase Storage is configured.');
    } finally {
      event.target.value = '';
    }
  }

  if (loading) {
    return <div className="h-[680px] rounded-lg bg-[#111] p-4 ring-1 ring-white/10"><div className="h-full animate-pulse rounded-md bg-[#1a1a1a]" /></div>;
  }

  if (!profile) {
    return (
      <section className="mx-auto max-w-2xl rounded-lg bg-[#111] p-5 ring-1 ring-white/10">
        <h2 className="font-serif text-4xl text-[#e8e8e8]">Personalize your learning</h2>
        <form onSubmit={submitOnboarding} className="mt-6 grid gap-5">
          <fieldset>
            <legend className="mb-3 text-sm font-semibold text-[#e8e8e8]">Are you a first-time voter?</legend>
            <div className="flex gap-2">
              {[true, false].map((value) => (
                <button
                  key={String(value)}
                  type="button"
                  onClick={() => setOnboarding((prev) => ({ ...prev, isFirstTime: value }))}
                  className={`h-10 rounded-md px-4 text-sm font-semibold ${onboarding.isFirstTime === value ? 'bg-[#4ade80] text-[#0a0a0a]' : 'bg-[#1a1a1a] text-[#e8e8e8]'}`}
                >
                  {value ? 'Yes' : 'No'}
                </button>
              ))}
            </div>
          </fieldset>

          <label className="grid gap-2 text-sm font-semibold text-[#e8e8e8]">
            Which state are you from?
            <select
              value={onboarding.state}
              onChange={(event) => setOnboarding((prev) => ({ ...prev, state: event.target.value }))}
              className="h-11 rounded-md border border-white/10 bg-[#161616] px-3 text-[#e8e8e8]"
            >
              {states.map((state) => <option key={state}>{state}</option>)}
            </select>
          </label>

          <label className="grid gap-2 text-sm font-semibold text-[#e8e8e8]">
            What do you want to learn?
            <select
              value={onboarding.goal}
              onChange={(event) => setOnboarding((prev) => ({ ...prev, goal: event.target.value }))}
              className="h-11 rounded-md border border-white/10 bg-[#161616] px-3 text-[#e8e8e8]"
            >
              {goals.map((goal) => <option key={goal}>{goal}</option>)}
            </select>
          </label>

          <button type="submit" className="h-11 rounded-md bg-[#4ade80] px-5 text-sm font-bold text-[#0a0a0a]">Start learning</button>
        </form>
      </section>
    );
  }

  return (
    <section className="grid h-[calc(100vh-190px)] min-h-[620px] grid-rows-[auto_1fr_auto] rounded-lg bg-[#111] ring-1 ring-white/10">
      <div className="flex flex-col gap-3 border-b border-white/10 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-serif text-3xl text-[#e8e8e8]">Election assistant</h2>
          <p className="text-sm text-[#888]">{profile.state} / {profile.goal}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              onClearChat();
            }}
            className="inline-flex h-10 items-center gap-2 rounded-md bg-[#1a1a1a] px-3 text-sm font-semibold text-[#e8e8e8] ring-1 ring-white/10"
          >
            <Trash2 size={16} aria-hidden="true" />
            Clear chat
          </button>
          <label className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-md bg-[#1a1a1a] px-3 text-sm font-semibold text-[#e8e8e8] ring-1 ring-white/10">
            <FileUp size={16} aria-hidden="true" />
            Upload document
            <input type="file" className="sr-only" onChange={uploadDocument} />
          </label>
        </div>
      </div>

      <div className="scrollbar-thin overflow-y-auto p-4">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <MessageGroup
              key={`${message.createdAt}-${index}`}
              message={message}
              onSendSuggestion={sendMessage}
              disabled={pending}
            />
          ))}
          {pending ? (
            <div className="message-slide inline-flex rounded-lg bg-[#1a1a1a] px-4 py-3">
              <span className="typing-dot mx-1 h-2 w-2 rounded-full bg-[#4ade80]" />
              <span className="typing-dot mx-1 h-2 w-2 rounded-full bg-[#4ade80]" />
              <span className="typing-dot mx-1 h-2 w-2 rounded-full bg-[#4ade80]" />
            </div>
          ) : null}
          <div ref={endRef} />
        </div>
      </div>

      <div className="border-t border-white/10 p-4">
        {uploadStatus ? <p className="mb-2 text-sm text-[#888]">{uploadStatus}</p> : null}
        <div className="flex gap-2">
          <textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about voter registration, EVMs, NOTA, counting, MCC..."
            rows={2}
            className="max-h-36 min-h-12 flex-1 resize-y rounded-md border border-white/10 bg-[#161616] p-3 text-sm leading-6 text-[#e8e8e8] placeholder:text-[#888]"
          />
          <button type="button" onClick={sendMessage} disabled={pending || !draft.trim()} className="grid h-12 w-12 shrink-0 place-items-center rounded-md bg-[#4ade80] text-[#0a0a0a] disabled:cursor-not-allowed disabled:opacity-40" aria-label="Send message">
            <Send size={18} aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}

function MessageGroup({ message, onSendSuggestion, disabled }) {
  const { body, suggestion } = splitSuggestion(message.content);
  const isUser = message.role === 'user';

  return (
    <article className={`message-slide flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
      <div
        className={`max-w-[88%] whitespace-pre-wrap rounded-lg px-4 py-3 text-sm leading-6 sm:max-w-[75%] ${
          isUser
            ? 'bg-[#4ade80] text-[#0a0a0a]'
            : message.error
              ? 'border border-red-500/35 bg-[#1a1a1a] text-[#e8e8e8]'
              : 'bg-[#1a1a1a] text-[#e8e8e8]'
        }`}
      >
        {body}
      </div>
      <span className="mt-1 text-xs text-[#666]">{formatRelativeTime(message.createdAt)}</span>
      {!isUser && suggestion ? (
        <button
          type="button"
          onClick={() => onSendSuggestion(suggestion)}
          disabled={disabled}
          className="mt-2 max-w-[88%] rounded-full bg-[#161616] px-3 py-2 text-left text-xs font-semibold text-[#4ade80] ring-1 ring-[#4ade80]/30 transition hover:bg-[#1a1a1a] disabled:cursor-not-allowed disabled:opacity-50 sm:max-w-[75%]"
        >
          Next: {suggestion}
        </button>
      ) : null}
    </article>
  );
}

function splitSuggestion(content) {
  const match = content.match(/\s*Next:\s*([\s\S]+?)\s*$/);

  if (!match) {
    return { body: content, suggestion: '' };
  }

  return {
    body: content.slice(0, match.index).trim(),
    suggestion: match[1].trim(),
  };
}

function formatRelativeTime(value) {
  const createdAt = Number(value) || Date.now();
  const seconds = Math.max(0, Math.floor((Date.now() - createdAt) / 1000));

  if (seconds < 60) {
    return 'Just now';
  }

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes} min ago`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours} hr ago`;
  }

  return new Date(createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}
