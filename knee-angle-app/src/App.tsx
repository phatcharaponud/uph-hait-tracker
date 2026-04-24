import { useState } from 'react';
import type { Mode, Side } from './types';
import StartScreen from './components/StartScreen';
import CameraView from './components/CameraView';

interface SessionOpts {
  mode: Mode;
  side: Side | 'auto';
  facing: 'user' | 'environment';
  showGuide: boolean;
}

export default function App() {
  const [session, setSession] = useState<SessionOpts | null>(null);

  if (!session) return <StartScreen onStart={setSession} />;

  return (
    <CameraView
      mode={session.mode}
      side={session.side}
      facing={session.facing}
      showGuide={session.showGuide}
      onBack={() => setSession(null)}
    />
  );
}
