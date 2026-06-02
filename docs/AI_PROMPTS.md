# InterviewOS — AI Prompts Documentation

Scaffold phase uses mock AI provider. Real prompts will be designed and tuned in later phases.

## Analyze Resume

### Input Contract

```
Resume text content.
Target role and seniority level.
```

### Output Contract

```
Structured analysis with:
- Skills inventory (present vs missing).
- Experience quality assessment.
- Gap analysis against target role.
- Improvement suggestions (prioritized).
```

### Prompt Responsibility

Analyze resume content against target role requirements. Identify gaps in skills, experience, and keywords.

### Mock Behavior

Returns a static analysis with placeholder gaps and suggestions.

---

## Generate Interview Feedback

### Input Contract

```
Interview session transcript or answers.
Question context and expected answer patterns.
User's target role and seniority.
```

### Output Contract

```
Structured feedback with:
- Technical correctness score and notes.
- Code quality assessment (if applicable).
- Problem-solving approach evaluation.
```

### Mock Behavior

Returns static feedback sections with placeholder scores.

---

## Generate Next Interview Question

### Input Contract

```
Current session context (questions asked, answers given).
User's target role and seniority.
Performance on previous questions.
```

### Output Contract

```
Next question object with:
- Question text.
- Difficulty level.
- Topic tags.
- Expected answer hints (for feedback).
```

### Mock Behavior

Returns a rotating set of predefined questions.

---

## Summarize English Mistakes

### Input Contract

```
User's spoken/written answers from interview session.
Corrected transcript.
```

### Output Contract

```
Structured English feedback with:
- Grammar mistakes (type, correction, frequency).
- Vocabulary suggestions (alternatives for overused words).
- Pronunciation notes (future phase).
```

### Mock Behavior

Returns a static set of common mistake examples.

---

## Generate Recommendations

### Input Contract

```
User's historical performance across all sessions.
Target role and English level.
Completed topics and weak areas.
```

### Output Contract

```
Personalized recommendations with:
- Topic areas to focus on (technical).
- English skill improvement plan.
- Learning resources (linked to sessions).
- Milestone timeline.
```

### Mock Behavior

Returns a static recommendation set with placeholder topics.
