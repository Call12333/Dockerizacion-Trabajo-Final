import React, { useState, useEffect, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

export const ErrorBoundary: React.FC<Props> = ({ children }) => {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const errorHandler = (event: ErrorEvent) => {
      setHasError(true);
      setError(event.error);
    };

    const rejectionHandler = (event: PromiseRejectionEvent) => {
      setHasError(true);
      setError(event.reason);
    };

    window.addEventListener('error', errorHandler);
    window.addEventListener('unhandledrejection', rejectionHandler);

    return () => {
      window.removeEventListener('error', errorHandler);
      window.removeEventListener('unhandledrejection', rejectionHandler);
    };
  }, []);

  if (hasError) {
    let errorMessage = "Algo salió mal. Por favor, intenta de nuevo.";
    
    try {
      const parsed = JSON.parse(error?.message || "");
      if (parsed.error && parsed.error.includes("insufficient permissions")) {
        errorMessage = "Error de Seguridad: No tienes permisos suficientes para realizar esta acción.";
      }
    } catch (e) {
      // Not a JSON error
    }

    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md y2k-glass border-red-500/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-6 w-6" />
              Error del Sistema
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">{errorMessage}</p>
            <Button 
              onClick={() => window.location.reload()}
              className="w-full y2k-button"
            >
              Reiniciar Aplicación
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};
