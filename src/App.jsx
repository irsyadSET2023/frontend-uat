import React from "react";
import AppRoutes from "./routes";
import AuthProvider from "./context/AuthContext";
import { Toaster } from "./components/ui/toaster";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "./components/reusables/ErrorFallback";
import { HelmetProvider } from "react-helmet-async";

const App = () => {
  return (
    <HelmetProvider>
      <ErrorBoundary fallback={<ErrorFallback />}>
        <AuthProvider>
          <AppRoutes />
          <Toaster />
        </AuthProvider>
      </ErrorBoundary>
    </HelmetProvider>
  );
};

export default App;
