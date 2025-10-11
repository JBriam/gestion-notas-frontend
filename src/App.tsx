import "./App.css";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { AuthWrapper } from "./components/Auth/AuthWrapper";
import AppRouter from "./routes/router";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AuthWrapper>
          <AppRouter />
        </AuthWrapper>
      </AuthProvider>
    </BrowserRouter>
  );
}