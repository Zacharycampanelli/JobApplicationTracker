import Footer from "../components/layout/Footer";
import Header from "../components/layout/Header";
import Card from "../components/ui/Card";
import ColorOverlay from "../components/ui/ColorOverlay";

import background from "../assets/images/background.png";
import RegistrationForm from "../components/ui/RegistrationForm";
import { Link } from "react-router";
import { useBreakpoint } from "../utils/useBreakpoint";

const Register = () => {
  const isTabletUp = useBreakpoint("md");

  const isMobile = !isTabletUp;
  return (
    <div className="flex w-full flex-col bg-surface">
      {isMobile && <Header />}

      <main className="flex flex-1 items-center justify-center px-4 py-8">
        <Card className="w-full max-w-5xl overflow-hidden md:grid md:min-h-[34rem] md:grid-cols-12 p-0">
          <div className="hidden bg-primary md:col-span-5 md:block ">
            <ColorOverlay imgSrc={background} className="h-full">
              <div className="md:p-10">
                <Header inverted />

                <h2 className="text-headline-xl text-surface mt-6 ">Architecting your professional <br/> journey.</h2>
                <p className="text-body-lg text-surface mt-6 pr-6" >
                  Architectural Ledger is a precision tool for the modern
                  professional. Organize every application with structural
                  integrity.
                </p>
              </div>
            </ColorOverlay>
          </div>

          <div className="p-6 md:col-span-7 md:p-10">
            <h2 className="mb-4 text-headline-lg">Create Account</h2>
            <p className="text-body-md text-on-surface-secondary mb-10">
              Begin your structured application journey today.
            </p>
            <RegistrationForm />
            <p className="text-body-md text-on-surface-secondary mt-10 text-center">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Log in here
              </Link>
            </p>
          </div>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default Register;
