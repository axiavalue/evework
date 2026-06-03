// ============================================
// CodeQuest — AI Interview Store (Zustand)
// Manages AI Mock Interview session state & simulation
// ============================================

import { create } from 'zustand';
import type {
  InterviewSession,
  InterviewMessage,
  InterviewFeedback,
  InterviewType,
} from '@/types/database';
import { useAuthStore } from './useAuthStore';
import { supabase } from '@/lib/supabase';

interface InterviewState {
  activeSession: InterviewSession | null;
  messages: InterviewMessage[];
  isRecording: boolean;
  isBotThinking: boolean;
  secondsElapsed: number;
  timerIntervalId: any;

  // Actions
  startSession: (
    language: string,
    type: InterviewType,
    difficulty: string,
    company: string
  ) => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  toggleRecording: (recordingState?: boolean) => void;
  endSession: (abandoned?: boolean) => Promise<InterviewFeedback | null>;
  resetStore: () => void;
  incrementTimer: () => void;
}

// Complete mock interview question database mapped to company/type/language
const INTERVIEW_QUESTIONS: Record<
  InterviewType,
  Record<string, Record<string, string[]>>
> = {
  behavioral: {
    google: {
      all: [
        "Tell me about a time you had a technical disagreement with a peer or supervisor. How did you resolve it?",
        "Describe a situation where you had to work with a very tight deadline. What trade-offs did you make?",
        "Tell me about a time you took initiative on a project. What was the impact of your actions?",
      ],
    },
    meta: {
      all: [
        "Tell me about a time you had to deliver a project with incomplete requirements. How did you manage it?",
        "Describe a situation where you had to give difficult feedback to a coworker. How did you handle it?",
        "Describe a time you failed to meet a goal. What did you learn from the experience?",
      ],
    },
    amazon: {
      all: [
        "Tell me about a time you went above and beyond for a customer. What was the outcome?",
        "Tell me about a time you made a decision without having all the data. How did it turn out?",
        "Describe a time you had to dive deep into a complex problem. What was your process?",
      ],
    },
    apple: {
      all: [
        "Tell me about a time you proposed a highly creative solution that was met with skepticism. How did you advocate for it?",
        "Describe a situation where you noticed a quality issue in a product. What did you do to fix it?",
        "Tell me about a time you had to learn a complex new technology in a very short amount of time.",
      ],
    },
    startup: {
      all: [
        "Tell me about a time you had to wear multiple hats on a project. How did you prioritize your workload?",
        "Describe a situation where a launch went wrong. How did you triage the problem under pressure?",
        "Describe how you handle quick pivots in business goals and requirements.",
      ],
    },
  },
  technical: {
    all: {
      python: [
        "Can you explain the difference between Python lists and tuples? In what scenarios would you choose one over the other?",
        "What are Python decorators, and how do they work under the hood? Can you describe a common use case?",
        "How does memory management work in Python? Specifically, explain reference counting and garbage collection.",
      ],
      cpp: [
        "What is the difference between pointer and reference in C++? When would you use each?",
        "Explain the concept of smart pointers in C++ (unique_ptr, shared_ptr, weak_ptr). How do they prevent memory leaks?",
        "What is Object Slicing in C++, and how can virtual functions or references help prevent it?",
      ],
      java: [
        "Explain how the Java Virtual Machine (JVM) manages memory. What are Heap and Stack, and how does Garbage Collection fit in?",
        "What is the difference between interface and abstract class in Java, and when would you use which?",
        "What are Java ClassLoaders, and how do they load classes at runtime?",
      ],
      javascript: [
        "Explain the event loop in JavaScript. How do microtasks (Promises) and macrotasks (setTimeout) differ in execution order?",
        "What is closure in JavaScript? Can you describe a practical use case where closures are essential?",
        "What is the difference between '__proto__' and 'prototype' in JavaScript prototypal inheritance?",
      ],
    },
  },
  coding: {
    all: {
      all: [
        "Write a function that reverses a singly linked list in-place. What is the time and space complexity of your solution?",
        "Given an array of integers, return indices of the two numbers such that they add up to a specific target. Explain how you would optimize this to run in O(n) time.",
        "Implement a function to check if a string contains balanced parentheses, brackets, and braces. How does a Stack data structure help here?",
        "Implement a binary search algorithm. Explain what happens if the input array is not sorted.",
      ],
    },
  },
  system_design: {
    all: {
      all: [
        "Design a URL Shortener service (like Bit.ly). How would you handle high volumes of redirection traffic and hash generation?",
        "Design an API Rate Limiter. Which algorithms would you consider (e.g. Token Bucket, Sliding Window Log), and how would you handle distributed rate limiting?",
        "Design a real-time messaging application (like WhatsApp). How would you handle presence indicators, delivery receipts, and offline messages?",
        "Design a globally distributed notification service that supports push notifications, emails, and SMS alerts. How do you handle delivery retries?",
      ],
    },
  },
};

const BOT_INTRO_MESSAGES: Record<InterviewType, string> = {
  behavioral: "Hello! Welcome to your behavioral mock interview. I will ask you questions based on real scenarios to evaluate your soft skills, adaptability, and experience. Let's start with this scenario: ",
  technical: "Welcome! Let's dive into some core language-specific and computer science concepts. I'll test your technical knowledge. Let's start: ",
  coding: "Welcome to your coding challenge! I will give you an algorithmic task. Please walk me through your logic, design constraints, and implementation strategy. Here is your problem: ",
  system_design: "Hello! Welcome to your system design interview. We will design a system from scratch. Please consider database models, API design, scalability, caching, and failovers. Here is your prompt: ",
};

export const useInterviewStore = create<InterviewState>((set, get) => ({
  activeSession: null,
  messages: [],
  isRecording: false,
  isBotThinking: false,
  secondsElapsed: 0,
  timerIntervalId: null,

  incrementTimer: () => {
    set((state) => ({ secondsElapsed: state.secondsElapsed + 1 }));
  },

  startSession: async (language, type, difficulty, company) => {
    // Reset previous states
    get().resetStore();

    const auth = useAuthStore.getState();
    const userId = auth.user?.id ?? 'anonymous';

    // Build the initial session object
    const newSession: InterviewSession = {
      id: Math.random().toString(36).substring(2, 9),
      user_id: userId,
      language,
      interview_type: type,
      difficulty,
      status: 'active',
      started_at: new Date().toISOString(),
      ended_at: null,
      duration_sec: null,
      feedback: null,
      overall_score: null,
    };

    // Grab initial question
    const companyKey = type === 'behavioral' ? company.toLowerCase() : 'all';
    const langKey = (type === 'technical' || type === 'coding') ? language.toLowerCase() : 'all';
    
    let questionPool = INTERVIEW_QUESTIONS[type]?.[companyKey]?.[langKey] 
      || INTERVIEW_QUESTIONS[type]?.[companyKey]?.['all']
      || INTERVIEW_QUESTIONS[type]?.['all']?.[langKey]
      || INTERVIEW_QUESTIONS[type]?.['all']?.['all']
      || ["Tell me about your programming background and what you are hoping to practice today."];

    const firstQuestion = questionPool[0];

    const introText = `${BOT_INTRO_MESSAGES[type]}${firstQuestion}`;

    const systemMsg: InterviewMessage = {
      id: Math.random().toString(36).substring(2, 9),
      session_id: newSession.id,
      role: 'assistant',
      content: introText,
      created_at: new Date().toISOString(),
    };

    // Start timer interval
    const interval = setInterval(() => {
      get().incrementTimer();
    }, 1000);

    set({
      activeSession: newSession,
      messages: [systemMsg],
      secondsElapsed: 0,
      timerIntervalId: interval,
      isBotThinking: false,
    });
  },

  sendMessage: async (content) => {
    const session = get().activeSession;
    if (!session) return;

    const userMsg: InterviewMessage = {
      id: Math.random().toString(36).substring(2, 9),
      session_id: session.id,
      role: 'user',
      content,
      created_at: new Date().toISOString(),
    };

    set((state) => ({
      messages: [...state.messages, userMsg],
      isBotThinking: true,
    }));

    // Simulate network delay and bot analysis response
    setTimeout(() => {
      const state = get();
      if (!state.activeSession) return;

      const userMessagesCount = state.messages.filter((m) => m.role === 'user').length;
      const type = state.activeSession.interview_type;
      const company = state.activeSession.difficulty;
      const language = state.activeSession.language;

      let botReply = '';

      if (userMessagesCount >= 3) {
        botReply = "Excellent answer. That covers my questions for this topic. I have gathered enough signals for our feedback report. Whenever you are ready, please tap 'End Interview' to view your performance analysis!";
      } else {
        // Find next question from pool
        const companyKey = type === 'behavioral' ? 'google' : 'all'; // simple fallback
        const langKey = (type === 'technical' || type === 'coding') ? language.toLowerCase() : 'all';
        
        let questionPool = INTERVIEW_QUESTIONS[type]?.[companyKey]?.[langKey]
          || INTERVIEW_QUESTIONS[type]?.[companyKey]?.['all']
          || INTERVIEW_QUESTIONS[type]?.['all']?.[langKey]
          || INTERVIEW_QUESTIONS[type]?.['all']?.['all']
          || [];
        
        const nextQuestion = questionPool[userMessagesCount] ?? "That is very clear. Can you expand on how you would measure success or verify correctness in this implementation?";
        botReply = `Thanks for explaining. Let's move to the next topic: ${nextQuestion}`;
      }

      const botMsg: InterviewMessage = {
        id: Math.random().toString(36).substring(2, 9),
        session_id: session.id,
        role: 'assistant',
        content: botReply,
        created_at: new Date().toISOString(),
      };

      set({
        messages: [...state.messages, botMsg],
        isBotThinking: false,
      });
    }, 1800);
  },

  toggleRecording: (recordingState) => {
    set((state) => ({ isRecording: recordingState !== undefined ? recordingState : !state.isRecording }));
  },

  endSession: async (abandoned = false) => {
    const { activeSession, messages, timerIntervalId, secondsElapsed } = get();
    if (!activeSession) return null;

    // Stop timer
    if (timerIntervalId) {
      clearInterval(timerIntervalId);
    }

    if (abandoned) {
      set({
        activeSession: null,
        messages: [],
        secondsElapsed: 0,
        timerIntervalId: null,
      });
      return null;
    }

    set({ isBotThinking: true });

    // Generate analytical score card metrics based on user replies
    const userAnswers = messages.filter((m) => m.role === 'user');
    const answerWordsCount = userAnswers.reduce((acc, m) => acc + m.content.split(' ').length, 0);
    const avgLength = userAnswers.length > 0 ? answerWordsCount / userAnswers.length : 0;

    // Calculate simulated scores
    let techScore = 3;
    let commScore = 3;
    let problemScore = 3;
    let codeScore = 3;

    if (avgLength > 40) {
      techScore = Math.min(5, Math.floor(4 + Math.random() * 2));
      commScore = Math.min(5, Math.floor(3.5 + Math.random() * 2));
      problemScore = Math.min(5, Math.floor(4 + Math.random() * 2));
      codeScore = Math.min(5, Math.floor(3.5 + Math.random() * 2));
    } else if (avgLength > 15) {
      techScore = Math.floor(3 + Math.random() * 2);
      commScore = Math.floor(3 + Math.random() * 2);
      problemScore = Math.floor(3 + Math.random() * 2);
      codeScore = Math.floor(3 + Math.random() * 2);
    } else {
      techScore = Math.floor(2 + Math.random() * 2);
      commScore = Math.floor(2.5 + Math.random() * 1.5);
      problemScore = Math.floor(2 + Math.random() * 2);
      codeScore = Math.floor(2 + Math.random() * 2);
    }

    const overallPct = Math.round(
      ((techScore + commScore + problemScore + codeScore) / 20) * 100
    );

    const feedbackObj: InterviewFeedback = {
      session_id: activeSession.id,
      duration_minutes: Math.ceil(secondsElapsed / 60),
      overall_score: overallPct,
      sections: {
        technical_accuracy: {
          score: techScore,
          feedback: techScore >= 4 
            ? "Demonstrated strong knowledge of fundamentals and explained algorithms clearly."
            : "Had minor details missing on runtime mechanics. Try to focus on internal memory structures.",
        },
        communication: {
          score: commScore,
          feedback: commScore >= 4
            ? "Spoke fluidly and structured answers using a clear hierarchical process."
            : "Answers were structured but slightly brief. Elaborate more on design choices.",
        },
        problem_solving: {
          score: problemScore,
          feedback: problemScore >= 4
            ? "Identified edge cases early and suggested suitable scalability compromises."
            : "Jumped into solutions quickly. Spend more time clarifying requirements first.",
        },
        code_quality: {
          score: codeScore,
          feedback: codeScore >= 4
            ? "Clean scoping, proper identifier naming, and modular separation."
            : "Consider edge-case checks (nulls, empty bounds) before executing operations.",
        },
      },
      strengths: [
        "Structured layout of design requirements",
        "Accurate estimations of algorithmic Big-O complex bounds",
        "Clear technical explanations under pressure",
      ],
      improvements: [
        "Proactively communicate runtime space trade-offs",
        "Improve validation of boundary parameter states",
      ],
      recommended_topics: [
        activeSession.language === 'Python' ? "Decorator wrappers & generator bounds" : "Smart pointer lifetimes & referencing",
        "Distributed messaging brokers & cache synchronization",
      ],
    };

    const updatedSession: InterviewSession = {
      ...activeSession,
      status: 'completed',
      ended_at: new Date().toISOString(),
      duration_sec: secondsElapsed,
      feedback: feedbackObj,
      overall_score: overallPct,
    };

    // Award user 50 XP
    const authStore = useAuthStore.getState();
    const currentProfile = authStore.profile;
    const earnedXP = 50;

    if (currentProfile) {
      const updatedXp = (currentProfile.total_xp ?? 0) + earnedXP;
      const updatedHearts = Math.min(5, (currentProfile.hearts ?? 5));
      const updatedStreak = currentProfile.current_streak; // preserve or increment

      // Try updating Supabase database profile in background
      try {
        await supabase
          .from('profiles')
          .update({
            total_xp: updatedXp,
          })
          .eq('id', currentProfile.id);
      } catch (err) {
        console.warn('Supabase sync skipped: working offline.');
      }

      // Proactively update client state
      authStore.updateProfile({
        total_xp: updatedXp,
        hearts: updatedHearts,
      });

      // Insert transaction logs to DB in background
      try {
        await supabase.from('xp_transactions').insert({
          user_id: currentProfile.id,
          amount: earnedXP,
          source: 'interview',
          reference_id: activeSession.id,
        });
      } catch (e) {}
    }

    set({
      activeSession: updatedSession,
      isBotThinking: false,
      timerIntervalId: null,
    });

    return feedbackObj;
  },

  resetStore: () => {
    const { timerIntervalId } = get();
    if (timerIntervalId) {
      clearInterval(timerIntervalId);
    }
    set({
      activeSession: null,
      messages: [],
      isRecording: false,
      isBotThinking: false,
      secondsElapsed: 0,
      timerIntervalId: null,
    });
  },
}));
