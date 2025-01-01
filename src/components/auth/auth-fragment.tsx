"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import LoginForm from "./login-form";
import SignupForm from "./signup-form";

export default function AuthFragment() {
  const router = useRouter();
  const currentPath = usePathname();
  const searchParams = useSearchParams();

  const pageKey = "page";
  const pageValue = searchParams.get(pageKey);
  const loginPage = "login";
  const signupPage = "signup";

  useEffect(() => {
    const isNotValidPage = pageValue !== loginPage && pageValue !== signupPage;
    const defaultPage = loginPage;
    if (!searchParams.has(pageKey) || isNotValidPage) {
      const params = new URLSearchParams(searchParams);
      params.set(pageKey, defaultPage);
      router.replace(`${currentPath}?${params.toString()}`);
    }
  }, [router, searchParams, currentPath, pageValue]);

  const variants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 50 },
  };

  return (
    <>
      <div className="md:flex">
        <Image
          className="hidden md:block h-screen w-1/2 object-cover"
          src={"/images/bg.jpg"}
          alt="exchange"
          width="100"
          height="100"
        />
        <div className="h-screen md:w-1/2 flex">
          <AnimatePresence mode="wait">
            {pageValue === loginPage ? (
              <motion.div
                key={loginPage}
                className="m-auto"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={variants}
                transition={{ duration: 0.5 }}
              >
                <LoginForm />
              </motion.div>
            ) : (
              <motion.div
                key={signupPage}
                className="m-auto"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={variants}
                transition={{ duration: 0.5 }}
              >
                <SignupForm />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}

// export async function getServerSideProps(context) {
//   const { query, resolvedUrl } = context;

//   if (!query.param) {
//     const defaultParam = "defaultValue";
//     return {
//       redirect: {
//         destination: `${resolvedUrl}?param=${defaultParam}`,
//         permanent: false,
//       },
//     };
//   }

//   return {
//     props: {}, // Pass any data as props
//   };
// }
