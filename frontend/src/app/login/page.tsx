// "use client";

// import { useState } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { useAuth } from "@/hooks/useAuth";
// import { motion } from "framer-motion";
// import { Eye, EyeOff, Phone, Lock, Sparkles, Store } from "lucide-react";

// export default function LoginPage() {
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const { login } = useAuth();
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError(null);
//     setIsSubmitting(true);

//     try {
      
//       await login(phoneNumber.trim(), password);
      
//       if (password === "123456") {
//         router.push("/change-password");
//       } else {
//         const redirectTo = searchParams.get("redirect") || "/dashboard";
//         router.push(redirectTo);
//       }
      
//       router.refresh();
//     } catch (err: any) {
//       const backendMessage = err.response?.data?.message || err.message || "Login failed.";
//       setError(backendMessage);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="relative min-h-screen overflow-hidden bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center px-4">
//       <motion.div
//         initial={{ opacity: 0, y: 40 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="relative z-10 w-full max-w-md"
//       >
//         <div className="backdrop-blur-xl bg-white/80 border border-white/40 rounded-3xl shadow-2xl p-10">
//           <div className="text-center mb-10">
//             <div className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-2xl bg-linear-to-br from-indigo-600 to-purple-600 text-white shadow-xl">
//               <Store size={36} />
//             </div>
//             <h1 className="text-4xl font-extrabold bg-linear-to-br from-indigo-700 via-purple-700 to-pink-600 bg-clip-text text-transparent">
//               Jemo Boutique
//             </h1>
//             <p className="text-gray-600 mt-2 font-medium">እንኳን በደህና መጡ! | Welcome!</p>
//           </div>

//           {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">{error}</div>}

//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div>
//               <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
//                 <Phone size={18} className="text-indigo-600" /> Phone
//               </label>
//               <input
//                 type="tel"
//                 value={phoneNumber}
//                 onChange={(e) => setPhoneNumber(e.target.value)}
//                 placeholder="09..."
//                 className="w-full px-5 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-indigo-500"
//                 required
//               />
//             </div>

//             <div>
//               <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
//                 <Lock size={18} className="text-indigo-600" /> Password
//               </label>
//               <div className="relative">
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   className="w-full px-5 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-indigo-500"
//                   required
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-4 top-4 text-gray-500"
//                 >
//                   {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
//                 </button>
//               </div>
//             </div>

//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg hover:bg-indigo-700 transition-all"
//             >
//               {isSubmitting ? "Signing in..." : "Sign In"}
//             </button>
//           </form>
//         </div>
//       </motion.div>
//     </div>
//   );
// }


import LoginForm from "@/components/LoginForm"; // or wherever you place it
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
