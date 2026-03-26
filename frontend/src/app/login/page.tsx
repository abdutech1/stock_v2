import LoginForm from "@/components/LoginForm"; 
import { Suspense } from "react";
import { Store } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center px-4">
      <div className="relative z-10 w-full max-w-md">
        <div className="backdrop-blur-xl bg-white/80 border border-white/40 rounded-3xl shadow-2xl p-10">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-xl">
              <Store size={36} />
            </div>
            <h1 className="text-4xl font-extrabold bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-600 bg-clip-text text-transparent">
              Jemo Boutique
            </h1>
            <p className="text-gray-600 mt-2 font-medium">እንኳን በደህና መጡ! | Welcome!</p>
          </div>

          {/* Wrap the dynamic part in Suspense */}
          <Suspense fallback={
            <div className="text-center py-10 text-gray-500">
              Loading login form...
            </div>
          }>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
