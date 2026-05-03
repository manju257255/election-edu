import { FileUp, Languages, Send, Trash2, WifiOff } from 'lucide-react';
import { ref, uploadBytes } from 'firebase/storage';
import PropTypes from 'prop-types';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { storage, trackEvent } from '../firebase';
import { askGemini, MAX_USER_MESSAGES_PER_SESSION } from '../gemini';
import { sanitizeChatInput } from '../utils/sanitize';
import { translateText } from '../utils/translate';

const states = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana',
  'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
  'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands', 'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',
];

const goals = ['Voter Registration', 'How EVMs work', 'Understanding results', 'General'];

/**
 * Chat component for interacting with the election assistant.
 * Optimized with message virtualization and offline detection.
 */
function Chat({ user, profile, messages, onSaveProfile, onSaveMessages, onClearChat, loading }) {
  const [draft, setDraft] = useState('');
  const [pending, setPending] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [lang, setLang] = useState('en');
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [onboarding, setOnboarding] = useState({
    isFirstTime: true,
    state: 'Maharashtra',
    goal: 'General',
  });
  const endRef = useRef(null);

  // Virtualization: Only render the last 50 messages to keep the DOM light
  const visibleMessages = useMemo(() => messages.slice(-50), [messages]);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [visibleMessages, pending]);

  async function submitOnboarding(event) {
    event.preventDefault();
    await onSaveProfile(onboarding);
  }

  async function sendMessage(contentOverride) {
    const content = sanitizeChatInput(contentOverride || draft);
    if (!content || pending || !profile || isOffline) {
      return;
    }

    const currentUserMessageCount = messages.filter((m) => m.role === 'user').length;
    if (currentUserMessageCount >= MAX_USER_MESSAGES_PER_SESSION) {
      const limitMessage = {
        role: 'assistant',
        content: 'Message limit reached for this session. Use Clear chat to start a new session.',
        createdAt: Date.now(),
        error: true,
      };
      await onSaveMessages([...messages, limitMessage]);
      setDraft('');
      return;
    }

    const nextMessages = [...messages, { role: 'user', content, createdAt: Date.now() }];
    setDraft('');
    setPending(true);
    await onSaveMessages(nextMessages);

    try {
      const history = nextMessages
        .filter((m) => !m.error && m.kind !== 'welcome')
        .map(({ role, content: msgContent }) => ({ role, content: msgContent }));
      
      let reply = await askGemini(history, profile);
      
      if (lang === 'hi') {
        reply = await translateText(reply, 'hi');
      }

      await onSaveMessages([...nextMessages, { role: 'assistant', content: reply, createdAt: Date.now() }]);
    } catch (err) {
      console.error('Chat error:', err);
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
      trackEvent('document_uploaded', { file_name: safeName });
    } catch (err) {
      console.error('Upload error:', err);
      setUploadStatus('Document upload is unavailable.');
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
              onChange={(e) => setOnboarding((p) => ({ ...p, state: e.target.value }))}
              className="h-11 rounded-md border border-white/10 bg-[#161616] px-3 text-[#e8e8e8]"
            >
              {states.map((s) => <option key={s}>{s}</option>)}
            </select>
          </label>
          <label className="grid gap-2 text-sm font-semibold text-[#e8e8e8]">
            What do you want to learn?
            <select
              value={onboarding.goal}
              onChange={(e) => setOnboarding((p) => ({ ...p, goal: e.target.value }))}
              className="h-11 rounded-md border border-white/10 bg-[#161616] px-3 text-[#e8e8e8]"
            >
              {goals.map((g) => <option key={g}>{g}</option>)}
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
          {isOffline && (
            <div className="flex items-center gap-2 rounded-md bg-red-500/10 px-3 py-1 text-xs font-bold text-red-500 ring-1 ring-red-500/20" role="alert">
              <WifiOff size={14} /> Offline
            </div>
          )}
          <button
            type="button"
            onClick={() => setLang(l => l === 'en' ? 'hi' : 'en')}
            className={`inline-flex h-10 items-center gap-2 rounded-md px-3 text-sm font-semibold ring-1 ring-white/10 ${lang === 'hi' ? 'bg-[#4ade80] text-[#0a0a0a]' : 'bg-[#1a1a1a] text-[#e8e8e8]'}`}
          >
            <Languages size={16} />
            {lang === 'en' ? 'English' : 'Hindi'}
          </button>
          <button type="button" onClick={onClearChat} className="inline-flex h-10 items-center gap-2 rounded-md bg-[#1a1a1a] px-3 text-sm font-semibold text-[#e8e8e8] ring-1 ring-white/10">
            <Trash2 size={16} /> Clear
          </button>
          <label className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-md bg-[#1a1a1a] px-3 text-sm font-semibold text-[#e8e8e8] ring-1 ring-white/10">
            <FileUp size={16} /> Upload
            <input type="file" className="sr-only" onChange={uploadDocument} />
          </label>
        </div>
      </div>

      <div className="scrollbar-thin overflow-y-auto p-4" aria-live="polite">
        <div className="space-y-4">
          {visibleMessages.map((msg, i) => (
            <MessageGroup key={`${msg.createdAt}-${i}`} message={msg} onSendSuggestion={sendMessage} disabled={pending || isOffline} />
          ))}
          {pending && (
            <div className="message-slide inline-flex rounded-lg bg-[#1a1a1a] px-4 py-3">
              <span className="typing-dot mx-1 h-2 w-2 rounded-full bg-[#4ade80]" />
              <span className="typing-dot mx-1 h-2 w-2 rounded-full bg-[#4ade80]" />
              <span className="typing-dot mx-1 h-2 w-2 rounded-full bg-[#4ade80]" />
            </div>
          )}
          <div ref={endRef} />
        </div>
      </div>

      <div className="border-t border-white/10 p-4">
        {uploadStatus && <p className="mb-2 text-sm text-[#888]" role="status">{uploadStatus}</p>}
        {isOffline && <p className="mb-2 text-sm font-bold text-red-500">You are offline. Reconnect to send messages.</p>}
        <div className="relative flex flex-col gap-2">
          <div className="flex gap-2">
            <textarea
              id="chat-input"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isOffline ? "Cannot send messages while offline" : "Ask about voter registration, EVMs, NOTA..."}
              rows={2}
              maxLength={500}
              disabled={isOffline}
              className="max-h-36 min-h-12 flex-1 resize-y rounded-md border border-white/10 bg-[#161616] p-3 text-sm leading-6 text-[#e8e8e8] placeholder:text-[#888] disabled:opacity-50"
            />
            <button
              type="button"
              onClick={() => sendMessage()}
              disabled={pending || !draft.trim() || isOffline}
              className="grid h-12 w-12 shrink-0 place-items-center rounded-md bg-[#4ade80] text-[#0a0a0a] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Send size={18} />
            </button>
          </div>
          <div className="text-right text-[10px] text-[#666]">{draft.length}/500</div>
        </div>
      </div>
    </section>
  );
}

Chat.propTypes = {
  user: PropTypes.object,
  profile: PropTypes.object,
  messages: PropTypes.array.isRequired,
  onSaveProfile: PropTypes.func.isRequired,
  onSaveMessages: PropTypes.func.isRequired,
  onClearChat: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

const MemoizedChat = React.memo(Chat);
export default MemoizedChat;

function MessageGroup({ message, onSendSuggestion, disabled }) {
  const { body, suggestion } = splitSuggestion(message.content);
  const isUser = message.role === 'user';
  return (
    <article className={`message-slide flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
      <div className={`max-w-[88%] whitespace-pre-wrap rounded-lg px-4 py-3 text-sm leading-6 sm:max-w-[75%] ${isUser ? 'bg-[#4ade80] text-[#0a0a0a]' : 'bg-[#1a1a1a] text-[#e8e8e8]'}`}>
        {body}
      </div>
      <span className="mt-1 text-xs text-[#666]">{new Date(message.createdAt).toLocaleTimeString()}</span>
      {!isUser && suggestion && (
        <button type="button" onClick={() => onSendSuggestion(suggestion)} disabled={disabled} className="mt-2 rounded-full bg-[#161616] px-3 py-2 text-xs font-semibold text-[#4ade80] ring-1 ring-[#4ade80]/30 hover:bg-[#1a1a1a] disabled:opacity-50">
          Next: {suggestion}
        </button>
      )}
    </article>
  );
}

function splitSuggestion(content) {
  const match = content.match(/\s*Next:\s*([\s\S]+?)\s*$/);
  if (!match) return { body: content, suggestion: '' };
  return { body: content.slice(0, match.index).trim(), suggestion: match[1].trim() };
}
