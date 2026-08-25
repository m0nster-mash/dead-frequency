import LoginPage from "./login/page";
import RegisterPage from "./register/page";

export default function HomePage() {
    return (
        <div>
          <h1>Welcome to the Home Page</h1>
          <LoginPage />
          <RegisterPage />
        </div>
    );
}