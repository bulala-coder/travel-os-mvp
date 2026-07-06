# Travel OS MVP - Agent Instructions

You are working on Travel OS MVP.

Travel OS is an AI Travel Operating System for overwhelmed independent travelers.

The MVP goal is to help users turn messy travel ideas into executable, editable, and saved Journey States.

## Core MVP Flow

1. User creates a new journey.
2. User inputs destination, duration, pace, interests, and free text.
3. AI clarifies travel intent.
4. User confirms intent.
5. AI generates structured itinerary days and activities.
6. AI checks feasibility.
7. User can replan or edit.
8. Journey State is saved in Supabase.
9. User sees next actions.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase Auth
- Supabase Database
- OpenAI API
- Vercel

## Important Product Constraints

Do not add:

- Booking transactions
- Payment
- Hotel booking
- Flight booking
- Ticket purchase
- Social feed
- Full map navigation
- Multi-user collaboration
- Fully autonomous travel agent
- Native mobile app code

Focus only on:

- Journey State
- Structured AI output
- Editable itinerary
- Feasibility check
- Replanning
- Next actions

## Development Rules

- Do not rewrite the whole app unless explicitly asked.
- Do not remove existing features unless necessary.
- Make the smallest safe change.
- Keep files small and readable.
- Prefer TypeScript types.
- Keep UI mobile-first and simple.
- Do not add unnecessary dependencies.
- After changes, explain what changed and how to verify.

## Folder Guidelines

Use this structure:

- `src/app` for routes
- `src/components` for UI and feature components
- `src/components/ui` for primitive UI components
- `src/components/layout` for app layout
- `src/components/journey` for Journey workspace components
- `src/components/intent` for intent clarification UI
- `src/components/itinerary` for itinerary UI
- `src/components/feasibility` for feasibility check UI
- `src/components/replan` for replanning UI
- `src/components/next-actions` for next action UI
- `src/lib/supabase` for Supabase helpers
- `src/lib/ai` for AI prompts, schemas, and agent runners
- `src/types` for shared TypeScript types

## Verification

After meaningful changes, run:

```bash
npm run lint
npm run dev