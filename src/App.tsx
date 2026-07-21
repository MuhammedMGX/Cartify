
import {  RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './App.css'
import { router } from './router';
import { AuthProvider } from './features/Auth/AuthContext';
import { Toaster } from 'sonner';
import { ThemeProvider } from './components/theme-provider';

function App() {

    const queryClient = new QueryClient()

return (
    <ThemeProvider>
    <QueryClientProvider client={queryClient}>
        <AuthProvider>
            <Toaster richColors position="top-center" />
            <RouterProvider router={router} />
        </AuthProvider>
    </QueryClientProvider>
    </ThemeProvider>
    );

}

export default App
