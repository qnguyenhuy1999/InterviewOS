# InterviewOS — Product Requirements Document

## Product Vision

InterviewOS is an intelligent interview preparation platform that helps non-native English software engineers improve their technical and communication skills through AI-powered practice sessions, personalized feedback, and structured learning paths.

## Primary Persona

A non-native English software developer preparing for fullstack or backend engineering interviews at English-speaking companies. They need to practice both technical problem-solving and English communication simultaneously.

## Core Features

### 1. Auth and User Profile

- Email/password registration and login.
- Profile setup: target role, English level, interview goal.
- Session management.

### 2. Notebook

- Rich note creation and editing.
- Organize notes by topic or interview prep phase.
- Persistent storage.

### 3. Interview Practice Sessions

- Simulated interview environment.
- Structured question flow with AI-generated follow-ups.
- Session recording and playback.

### 4. English Notes

- Automatic English correction tracking from interview sessions.
- Vocabulary and grammar mistake summaries.
- Progress tracking over time.

### 5. Resume Analysis

- Upload resume for AI analysis.
- Gap identification and improvement suggestions.
- Keyword and skill matching against target roles.

### 6. Personalized Recommendations / Learning Path

- Adaptive learning path based on performance.
- Topic recommendations for technical and English improvement.
- Progress tracking and milestone visualization.

## Non-Goals for Scaffold Phase

- Real AI provider integration (mock only).
- Live audio/video streaming.
- Real-time collaboration.
- Third-party OAuth.
- Mobile native apps.
- Production deployment.

## Success Criteria

- All scaffold phases build and type-check cleanly.
- Monorepo dependency boundaries are enforced.
- Docker Compose starts Postgres and Redis.
- Web app displays all route shells.
- API returns mock responses for all endpoints.
