import Footer from "../components/layout/Footer";
import Header from "../components/layout/Header";
import Card from "../components/ui/Card";

const Register = () => {
  return (
    <div className="flex min-h-screen w-full flex-col bg-surface">
      <Header />

      <main className="flex flex-1 items-center justify-center px-4 py-8">
        <Card className="w-full max-w-5xl overflow-hidden md:p-0 md:grid md:grid-cols-12">
          <div className="hidden bg-primary md:col-span-5 md:block">
            Left
          </div>

          <div className="p-6 md:col-span-7 md:p-10">
            <h2 className="mb-2 text-headline-lg">Create Account</h2>
            <p className="text-body-md text-on-surface-secondary">
              Begin your structured application journey today.
            </p>
          </div>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default Register;
