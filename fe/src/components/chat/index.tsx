import React, { useMemo, useState } from "react";
import "./index.scss";

type Sender = "me" | "other";

type Message = {
  id: string;
  sender: Sender;
  text: string;
  time: string;
};

type Conversation = {
  id: string;
  name: string;
  initials: string;
  role: string;
  roleBadge?: string;
  badgeType?: "manager" | "nurse" | "info";
  preview: string;
  timeAgo: string;
  unreadCount?: number;
  isTeam?: boolean;
  messages: Message[];
};

const API_URL = "http://localhost:5000/api/chat";

const initialConversations: Conversation[] = [
  {
    id: "conv-michael",
    name: "Dr. Michael Roberts",
    initials: "MR",
    role: "Manager",
    roleBadge: "Manager",
    badgeType: "manager",
    preview: "Please review the new schedule for next week",
    timeAgo: "2m ago",
    unreadCount: 2,
    messages: [
      {
        id: "m1",
        sender: "other",
        text: "Hi Sarah, I wanted to discuss the upcoming schedule changes.",
        time: "10:30 AM",
      },
      {
        id: "m2",
        sender: "me",
        text: "Sure, I saw the draft. What specific changes are we looking at?",
        time: "10:32 AM",
      },
      {
        id: "m3",
        sender: "other",
        text: "We need to adjust the rotation for the ICU next week. Can you take Thursday evening instead of Wednesday?",
        time: "10:33 AM",
      },
      {
        id: "m4",
        sender: "me",
        text: "Let me check my calendar. Yes, Thursday evening works for me.",
        time: "10:35 AM",
      },
      {
        id: "m5",
        sender: "other",
        text: "Please review the new schedule for next week",
        time: "10:38 AM",
      },
    ],
  },
  {
    id: "conv-emily",
    name: "Dr. Emily Stone",
    initials: "ES",
    role: "Urologist",
    preview: "Thanks for covering my shift!",
    timeAgo: "15m ago",
    messages: [
      {
        id: "e1",
        sender: "other",
        text: "Thanks again for covering my shift yesterday!",
        time: "09:10 AM",
      },
      {
        id: "e2",
        sender: "me",
        text: "No problem at all, happy to help 😊",
        time: "09:12 AM",
      },
    ],
  },
  {
    id: "conv-ed",
    name: "Emergency Department Team",
    initials: "ED",
    role: "Info Channel",
    roleBadge: "Info Channel",
    badgeType: "info",
    preview: "Dr. Kim: Patient in room 4 needs immediate attention",
    timeAgo: "32m ago",
    unreadCount: 5,
    isTeam: true,
    messages: [
      {
        id: "ed1",
        sender: "other",
        text: "Dr. Kim: Patient in room 4 needs immediate attention.",
        time: "09:45 AM",
      },
      {
        id: "ed2",
        sender: "other",
        text: "Charge nurse assigned to respond.",
        time: "09:47 AM",
      },
    ],
  },
  {
    id: "conv-duty",
    name: "Department Duty Schedule",
    initials: "DS",
    role: "Info Channel",
    roleBadge: "Info Channel",
    badgeType: "info",
    preview: "Cardiology is on primary duty today",
    timeAgo: "2h ago",
    messages: [
      {
        id: "d1",
        sender: "other",
        text: "Cardiology is on primary duty today.",
        time: "08:00 AM",
      },
    ],
  },
  {
    id: "conv-lisa",
    name: "Lisa Martinez",
    initials: "LM",
    role: "Nurse",
    roleBadge: "Nurse",
    badgeType: "nurse",
    preview: "Got it, see you tomorrow",
    timeAgo: "3h ago",
    messages: [
      {
        id: "l1",
        sender: "other",
        text: "Got it, see you tomorrow!",
        time: "07:20 AM",
      },
    ],
  },
  {
    id: "conv-night",
    name: "Night Shift Doctors",
    initials: "NS",
    role: "Team",
    preview: "Dr. Chen: Handoff notes uploaded to system",
    timeAgo: "5h ago",
    unreadCount: 1,
    isTeam: true,
    messages: [
      {
        id: "n1",
        sender: "other",
        text: "Dr. Chen: Handoff notes uploaded to system.",
        time: "03:00 AM",
      },
    ],
  },
  {
    id: "conv-jennifer",
    name: "Dr. Jennifer Hayes",
    initials: "JH",
    role: "Manager",
    roleBadge: "Manager",
    badgeType: "manager",
    preview: "Can we discuss your performance review?",
    timeAgo: "1d ago",
    unreadCount: 1,
    messages: [
      {
        id: "j1",
        sender: "other",
        text: "Can we schedule time to discuss your performance review?",
        time: "Yesterday",
      },
    ],
  },
];

const ChatView: React.FC = () => {
  const [conversations, setConversations] =
    useState<Conversation[]>(initialConversations);
  const [activeId, setActiveId] = useState<string>("conv-michael");
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState("");

  const activeConversation = useMemo(
    () => conversations.find((c) => c.id === activeId) ?? conversations[0],
    [conversations, activeId]
  );

  const filteredConversations = useMemo(
    () =>
      conversations.filter((c) =>
        (c.name + " " + c.preview).toLowerCase().includes(search.toLowerCase())
      ),
    [conversations, search]
  );

  const handleSend = async () => {
    if (!draft.trim()) return;

    const content = draft.trim();
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const activeIdAtSend = activeId;

    // Thêm tin nhắn của mình
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === activeIdAtSend
          ? {
              ...conv,
              messages: [
                ...conv.messages,
                {
                  id: `me-${Date.now()}`,
                  sender: "me",
                  text: content,
                  time: timeStr,
                },
              ],
              preview: content,
              timeAgo: "Just now",
            }
          : conv
      )
    );
    setDraft("");

    const convForApi =
      conversations.find((c) => c.id === activeIdAtSend) || conversations[0];

    const apiMessages = convForApi.messages.map((m) => ({
      role: m.sender === "me" ? "user" : "assistant",
      content: m.text,
    }));
    apiMessages.push({ role: "user", content });

    const typingId = `ai-typing-${Date.now()}`;
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === activeIdAtSend
          ? {
              ...conv,
              messages: [
                ...conv.messages,
                {
                  id: typingId,
                  sender: "other",
                  text: "MedStaff AI is typing...",
                  time: "",
                },
              ],
            }
          : conv
      )
    );

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
      });

      const data = await res.json();
      const replyText =
        data.reply ||
        "Sorry, MedStaff AI system is having problems, please try again later.";

      const replyTime = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      setConversations((prev) =>
        prev.map((conv) => {
          if (conv.id !== activeIdAtSend) return conv;
          const msgsWithoutTyping = conv.messages.filter(
            (m) => m.id !== typingId
          );
          return {
            ...conv,
            messages: [
              ...msgsWithoutTyping,
              {
                id: `ai-${Date.now()}`,
                sender: "other",
                text: replyText,
                time: replyTime,
              },
            ],
            preview: replyText,
            timeAgo: "Just now",
          };
        })
      );
    } catch (err) {
      console.error(err);
      setConversations((prev) =>
        prev.map((conv) => {
          if (conv.id !== activeIdAtSend) return conv;
          const msgsWithoutTyping = conv.messages.filter(
            (m) => m.id !== typingId
          );
          return {
            ...conv,
            messages: [
              ...msgsWithoutTyping,
              {
                id: `ai-error-${Date.now()}`,
                sender: "other",
                text: "Có lỗi khi gọi MedStaff AI. Vui lòng thử lại.",
                time: timeStr,
              },
            ],
          };
        })
      );
    }
  };

  return (
    <div className='chat-layout'>
      <div className='chat-body'>
        {/* Cột trái: danh sách messages */}
        <section className='thread-list'>
          <div className='thread-header'>
            <h2 className='thread-title'>Messages</h2>
            <div className='thread-search'>
              <input
                type='text'
                placeholder='Search conversations…'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className='thread-scroll'>
            {filteredConversations.map((conv) => (
              <button
                key={conv.id}
                className={
                  "thread-item" +
                  (conv.id === activeConversation.id
                    ? " thread-item--active"
                    : "")
                }
                onClick={() => setActiveId(conv.id)}>
                <div className='thread-avatar-wrapper'>
                  <div className='thread-avatar'>{conv.initials}</div>
                </div>
                <div className='thread-text'>
                  <div className='thread-top-row'>
                    <span className='thread-name'>{conv.name}</span>
                    <span className='thread-time'>{conv.timeAgo}</span>
                  </div>
                  <div className='thread-role-row'>
                    {conv.roleBadge && (
                      <span
                        className={
                          "role-pill" +
                          (conv.badgeType === "manager"
                            ? " role-pill--manager"
                            : conv.badgeType === "nurse"
                            ? " role-pill--nurse"
                            : conv.badgeType === "info"
                            ? " role-pill--info"
                            : "")
                        }>
                        {conv.roleBadge}
                      </span>
                    )}
                    {!conv.roleBadge && (
                      <span className='role-plain'>{conv.role}</span>
                    )}
                    {conv.unreadCount && conv.unreadCount > 0 && (
                      <span className='thread-unread'>
                        {conv.unreadCount} new
                      </span>
                    )}
                  </div>
                  <div className='thread-preview'>{conv.preview}</div>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Cột phải: khung chat + input ở dưới cùng */}
        <section className='conversation-panel'>
          <header className='conversation-header'>
            <div className='conversation-header-left'>
              <div className='conversation-avatar'>
                {activeConversation.initials}
              </div>
              <div>
                <div className='conversation-name'>
                  {activeConversation.name}
                </div>
                <div className='conversation-role-row'>
                  {activeConversation.roleBadge && (
                    <span
                      className={
                        "role-pill" +
                        (activeConversation.badgeType === "manager"
                          ? " role-pill--manager"
                          : activeConversation.badgeType === "nurse"
                          ? " role-pill--nurse"
                          : activeConversation.badgeType === "info"
                          ? " role-pill--info"
                          : "")
                      }>
                      {activeConversation.roleBadge}
                    </span>
                  )}
                  {!activeConversation.roleBadge && (
                    <span className='role-plain'>
                      {activeConversation.role}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <button
              className='conversation-close'
              onClick={() => alert("Demo: info")}>
              ⓘ
            </button>
          </header>

          {/* messages */}
          <div className='conversation-messages'>
            {activeConversation.messages.map((m) => (
              <div
                key={m.id}
                className={
                  "message-row" + (m.sender === "me" ? " message-row--me" : "")
                }>
                {m.sender === "other" && (
                  <div className='message-avatar'>
                    {activeConversation.initials}
                  </div>
                )}

                <div className='message-bubble-wrapper'>
                  <div
                    className={
                      "message-bubble" +
                      (m.sender === "me"
                        ? " message-bubble--me"
                        : " message-bubble--other")
                    }>
                    {m.text}
                  </div>
                  <div className='message-time'>{m.time}</div>
                </div>
              </div>
            ))}
          </div>

          {/* input ở DƯỚI CÙNG của cột chat */}
          <div className='conversation-input-area'>
            <div className='chat-input-pill'>
              <button
                className='chat-input-plus'
                onClick={() => alert("Demo: open attachments")}>
                +
              </button>
              <input
                className='chat-input-field'
                type='text'
                placeholder='Type a message...'
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              />
              <button className='chat-input-send' onClick={handleSend}>
                ✈
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ChatView;
