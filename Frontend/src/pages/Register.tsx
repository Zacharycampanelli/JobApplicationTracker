import Footer from "../components/layout/Footer";
import Header from "../components/layout/Header";
import Card from "../components/ui/Card";
import ColorOverlay from "../components/ui/ColorOverlay";

import background from "../assets/images/background.png";
import RegistrationForm from "../components/ui/RegistrationForm";

const Register = () => {
  return (
    <div className="flex min-h-screen w-full flex-col bg-surface">
      <Header />

      <main className="flex flex-1 items-center justify-center px-4 py-8">
        <Card className="w-full max-w-5xl overflow-hidden md:grid md:min-h-[34rem] md:grid-cols-12 md:p-0">
          <div className="hidden bg-primary md:col-span-5 md:block">
            <ColorOverlay imgSrc={background} className="h-full">
              <div>content</div>
            </ColorOverlay>
          </div>

          <div className="p-6 md:col-span-7 md:p-10">
            <h2 className="mb-2 text-headline-lg">Create Account</h2>
            <p className="text-body-md text-on-surface-secondary">
              Begin your structured application journey today.
            </p>
            <RegistrationForm />
          </div>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default Register;
