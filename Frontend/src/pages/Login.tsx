import Footer from "../components/layout/Footer";
import Header from "../components/layout/Header";
import Card from "../components/ui/Card";
import ColorOverlay from "../components/ui/ColorOverlay";

import background from "../assets/images/background.png";
import { Link } from "react-router";
import LoginForm from "../components/ui/LoginForm";

const Login = () => {
  return (
<div className="mx-auto grid min-h-dvh w-full max-w-7xl grid-rows-[auto_1fr_auto] bg-surface px-6 py-6">
      <Header />

      <main className="flex items-center justify-center">
        <Card className="w-full max-w-6xl overflow-hidden p-0 md:grid md:min-h-[36rem]
 md:grid-cols-12 ">
          <div className="hidden bg-primary md:col-span-5 md:block">
            <ColorOverlay imgSrc={background} className="h-full">
              <div>content</div>
            </ColorOverlay>
          </div>

          <div className="p-6 md:col-span-7 md:p-10">
            <h2 className="mb-4 text-headline-lg">Welcome Back</h2>
            <p className="text-body-md text-on-surface-secondary mb-10">
              Log in to manage your professional trajectory.
            </p>
            <LoginForm />
            <p className="text-body-md text-on-surface-secondary mt-10 text-center">
              Don't have an account?{" "}
              <Link to="/register" className="text-primary hover:underline">
                Register here
              </Link>
            </p>
          </div>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default Login;
