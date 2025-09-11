# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

- Project type: Expo (React Native + Expo Router + TypeScript)
- Styling: Tailwind via NativeWind
- State: Jotai with MMKV persistence
- Data layer: Supabase (@supabase/supabase-js)
- Testing: Vitest + Testing Library for React Native (jsdom env)
- Package manager: pnpm (preferred)

Project rules and preferences
- Use pnpm for all package operations in this repo.
- Use Vitest for testing (not Jest).
- Do not modify the user's ESLint config to bypass errors/warnings.
- Database naming convention: plural snake_case for table names; PascalCase for TypeScript schema/types. Supabase tables in src/lib/supabase/constants.ts follow this convention (e.g., users, schools, classes, ...).

Common commands
Use pnpm for all commands.
- Install: pnpm install
- Start Metro with Dev Client: pnpm start
- Run Android (native build): pnpm android
- Run iOS (native build): pnpm ios
- Run Web: pnpm web
- Type-check: pnpm typecheck
- Lint: pnpm lint
- Lint with fixes: pnpm lint:fix
- Tests (all): pnpm test
- Tests (watch): pnpm test:watch
- Tests (coverage): pnpm test:coverage
- Run a single test file: pnpm vitest run src/app/__tests__/qr-scan-security.test.ts
- Run tests by name pattern: pnpm vitest -t "qr-scan security"

Environment and configuration notes
- Supabase: The client is configured in src/lib/supabase/config.ts. It imports EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_KEY from src/lib/supabase/keys (values should come from Expo env; ensure EXPO_PUBLIC_* vars are provided for development and CI builds).
- Path aliases: tsconfig.json defines @/* -> ./src/* and @assets -> ./assets/*.
- Tailwind/NativeWind: tailwind.config.js scans ./src/app and ./src/components; styles use platform-aware CSS variables via nativewind/theme.

High-level architecture
1) Navigation and App shell (Expo Router)
- Entry layout: src/app/_layout.tsx
  - Sets StatusBar theme, provides React Navigation theme via NAV_THEME from src/theme, and defines the app Stack.
  - Top-level routes: index, +not-found, and three route groups: (auth), (director), (teacher).
- Route groups:
  - src/app/(auth): login.tsx, qr-scan.tsx, welcome-modal.tsx, with group _layout.tsx.
  - src/app/(director): configure-tablet.tsx with group _layout.tsx.
  - src/app/(teacher): attendance.tsx, confirmation-modal.tsx, homework-modal.tsx, lesson-progress.tsx, participation.tsx with group _layout.tsx.
- Initial redirect logic: src/app/index.tsx checks auth and metadata, then navigates to either /(director)/configure-tablet or /(auth)/qr-scan while showing a loading spinner.

2) State management (Jotai + MMKV)
- Global atoms: src/store/atoms.ts
  - Auth state: authStateAtom, currentUserAtom.
  - School/class context: currentSchoolAtom, currentClassAtom, teachersListAtom, studentsListAtom, classScheduleAtom/currentScheduleAtom.
  - Sessions: currentAttendanceSessionAtom, participation atoms.
  - Homework/incidents: homeworkListAtom, incidentListAtom.
  - UI: userColorSchemeAtom, isOfflineModeAtom, syncStatusAtom.
  - MetaData: metaDataAtom and updateMetaDataAtom for partial updates to metadata like schoolId, classId, semester info.
- Persistence: atomWithMMKV integrates react-native-mmkv to persist key pieces of state across launches.

3) Data layer (Supabase + services)
- Supabase client: src/lib/supabase/config.ts (createClient with AsyncStorage, autoRefreshToken, persistSession; URL and key from EXPO_PUBLIC_*).
- Table name constants: src/lib/supabase/constants.ts centralizes IDs for queries (e.g., users, schools, classes, schedules, attendances, notes, semesters, etc.).
- Service modules: src/services/*.ts implement domain operations and encapsulate queries/mutations to Supabase (auth, school, schoolYear, class, attendance, participation, homework, lessonProgress, encryption, qrCodeGenerator).
- Hooks compose services with state:
  - src/hooks/useAuth.ts: session bootstrap via auth service; fetches user row and roles to determine role (director/teacher). Exposes login/logout APIs.
  - src/hooks/index.ts exports feature hooks: useAttendance, useClass, useHomework, useLessonProgress, useMetadataValidation, useOfflineSync, useParticipation, useSchool, useSchoolYear.

4) UI and theming
- Theme: NAV_THEME and color scheme detectors in src/theme and src/lib/useColorScheme.tsx. Root layout wires theme into React Navigation.
- Components: src/components/** includes shared UI (e.g., nativeui/Button, TextField, domain components for attendance/homework) and UX primitives like modals and QRScanner.
- Styling: Tailwind classes via NativeWind; tailwind.config.js uses withOpacity + platformSelect for iOS/Android color variables. Global styles are imported once from global.css in the root layout.

5) Tests
- Runner/config: vitest.config.ts uses jsdom, globals, and setupFiles ./src/test/setup.ts; alias @ -> ./src.
- Setup: src/test/setup.ts mocks RN/Expo modules, testing-library jest-native matchers, and silences console.error/warn by default.
- Example tests: src/app/__tests__/qr-scan-security.test.ts and src/services/__tests__/attendance.test.ts.

Development workflows
- Local run flows:
  - Start the dev client (pnpm start) and then run pnpm android or pnpm ios to launch on device/emulator. Alternatively, pnpm web for web preview (Metro bundler is configured as the web bundler).
- Auth flow overview:
  - useAuth bootstraps session from Supabase and loads the user row from the users table. The role is derived from the user_roles relation.
  - src/app/index.tsx redirects to either director configuration or auth QR scan based on session and local metadata.
- Feature data flows:
  - Services fetch class/school context and populate atoms (students, teachers, schedules). updateMetaDataAtom records IDs and semesters for downstream features (attendance, participation, homework, lesson progress).

Notes for future changes
- When adding new Supabase tables, define their IDs in src/lib/supabase/constants.ts using plural snake_case, and expose related TypeScript types in src/types using PascalCase.
- Prefer adding new domain logic in src/services with corresponding hooks in src/hooks and atoms/selectors in src/store.
- Keep Tailwind/NativeWind content globs updated if you add component directories so styles tree-shake correctly.
