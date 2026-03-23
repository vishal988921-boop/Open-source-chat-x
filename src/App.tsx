/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useAuth } from './hooks/useAuth';
import { Login } from './components/Login';
import { ChatX } from './components/ChatX';
import { Loading } from './components/Loading';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ThemeProvider } from './contexts/ThemeContext';

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  return (
    <ThemeProvider>
      <ErrorBoundary>
        {user ? <ChatX /> : <Login />}
      </ErrorBoundary>
    </ThemeProvider>
  );
}
