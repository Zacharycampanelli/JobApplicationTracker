import { Link } from "react-router";

import background from "../assets/images/background.png";
import Logo from "../assets/svg/Icon";
import Footer from "../components/layout/Footer";
import Header from "../components/layout/Header";
import Card from "../components/ui/Card";
import ColorOverlay from "../components/ui/ColorOverlay";
import ForgotPasswordForm from "../features/auth/components/ForgotPasswordForm";
import LoginForm from "../features/auth/components/LoginForm";
import PasswordResetForm from "../features/auth/components/PasswordResetForm";
import RegistrationForm from "../features/auth/components/RegistrationForm";
import { useBreakpoint } from "../utils/useBreakpoint";

type AuthPageProps = {
  mode: "login" | "signup" | "forgot-password" | "reset-password";
};

const pageContent = {
  login: {
    title: "Welcome Back",
    subtitle: "Your career, structured by design.",
    description:
      "The Architectural Ledger is more than a job tracker. It's a premium space to audit your skills, manage applications, and engineer your next career milestone with editorial precision.",
    linkText: "Register here",
    linkTo: "/register",
    linkPrompt: "Don't have an account?"
  },
  signup: {
    title: "Create Account",
    subtitle: "Curate your professional trajectory.",
    description:
      "The Architectural Ledger is a professional-grade environment built to document your professional evolution with editorial precision.",
    linkText: "Log in here",
    linkTo: "/login",
    linkPrompt: "Already have an account?"
  },
  "forgot-password": {
    title: "Forgot Password",
    subtitle: "Recover access to your account.",
    description:
      "Enter the email address associated with your account, and we'll send you a link to reset your password.",
    linkText: "Return to login",
    linkTo: "/login",
    linkPrompt: "Remember your password?"
  },
  "reset-password": {
    title: "Reset Password",
    subtitle: "Enter your new password.",
    description: "Choose a new password for your Architectural Ledger account.",
    linkText: "Return to login",
    linkTo: "/login",
    linkPrompt: "Already reset your password?"
  }
};

const AuthPage = ({ mode }: AuthPageProps) => {
  const isTabletUp = useBreakpoint("md");

  const isMobile = !isTabletUp;

  const { title, subtitle, description, linkText, linkTo, linkPrompt } =
    pageContent[mode];

  const renderForm = () => {
    switch (mode) {
      case "login":
        return <LoginForm />;
      case "signup":
        return <RegistrationForm />;
      case "forgot-password":
        return <ForgotPasswordForm />;
      case "reset-password":
        return <PasswordResetForm />;
      default:
        return <LoginForm />;
    }
  };

  return (
    <div className="flex min-h-dvh w-full overflow-x-clip flex-col bg-surface py-10">
      {isMobile && <Header />}

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-4 md:px-6">
        <Card className="mx-auto w-full min-w-0 max-w-lg overflow-hidden p-0 md:grid md:min-h-[36rem] md:max-w-none md:grid-cols-12">
          <div className="relative hidden min-w-0 overflow-hidden bg-primary md:col-span-5 md:block">
            <div className="absolute inset-0">
              <ColorOverlay imgSrc={background} className="size-full">
                <div className="flex flex-col gap-6 px-10 py-12">
                  <div className="flex items-center gap-2">
                    <Logo fill="#ffffff" />
                    <h2 className="text-brand text-surface font-normal!">
                      Architectural Ledger
                    </h2>
                  </div>
                  <h2 className="text-auth-hero text-surface font-normal!">
                    {subtitle}
                  </h2>
                  <p className="text-body-md text-surface leading-[29.3px]!">
                    {description}
                  </p>
                </div>
              </ColorOverlay>
            </div>
          </div>

          <div className="min-w-0 p-6 md:col-span-7 md:p-8 xl:p-10">
            <h2 className="mb-4 text-page-title">{title}</h2>
            {subtitle && (
              <p className="text-body-md text-on-surface-secondary mb-12">
                {subtitle}
              </p>
            )}
            {renderForm()}
            <p className="text-body-md text-on-surface-secondary mt-10 text-center">
              {linkPrompt}{" "}
              <Link to={linkTo} className="text-primary hover:underline">
                {linkText}
              </Link>
            </p>
          </div>
        </Card>
        <div className="mt-8">
          <Footer />
        </div>
      </main>
    </div>
  );
};

export default AuthPage;
