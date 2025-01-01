"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { JSX } from "react";

export default function NavigationTile({
  navItem,
}: {
  navItem: { title: string; icon: JSX.Element };
}) {
  const currentPathFirstSlug = usePathname().split("/")[1];
  const navPath = `${navItem.title.toLowerCase()}`;
  const isRouteTile = currentPathFirstSlug === navPath;

  return (
    <Link href={`/${navPath}`} className="flex gap-3 my-2">
      <div
        className={`hidden md:block w-1 rounded-r-md transition-all duration-300 ${
          isRouteTile && "bg-[#0086CA]"
        }`}
      ></div>
      <div
        className={`flex items-center gap-2 rounded-full md:rounded-[0.3rem] p-[0.75rem] md:py-[0.375rem] md:px-2 w-full text-white md:text-inherit hover:md:text-white hover:bg-[#005C8A] transition-all duration-300 ${
          isRouteTile && "bg-[#69c0ec] md:bg-[#0086CA] md:text-white"
        }`}
      >
        <div
          className={`text-2xl md:text-base transition-transform duration-300 ${
            isRouteTile && "rotate-[360deg]"
          }`}
        >
          {navItem.icon}
        </div>
        <h6 className={`hidden md:block text-sm`}>{navItem.title}</h6>
      </div>
      {/* <motion.div
        layout
        className="rounded-[0.3rem] py-[0.375rem] px-2 w-full text-white md:text-inherit"
        animate={{
          backgroundColor: isRouteTile ? "#0086CA" : undefined,
          color: isRouteTile ? "#FFFFFF" : undefined,
        }}
        whileHover={{
          backgroundColor: "#005C8A", // Darker blue when hovered
          color: "#FFFFFF",
        }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          key={navPath}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 10 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-2 [&>*]:flex-shrink-0"
        >
          <div className="text-2xl md:text-base">{navItem.icon}</div>
          <motion.h6
            className="hidden md:block text-sm"
            animate={{ color: isRouteTile ? "#FFFFFF" : undefined }}
            transition={{ duration: 0.3 }}
            whileHover={{
              color: "#FFFFFF",
            }}
          >
            {navItem.title}
          </motion.h6>
        </motion.div>
      </motion.div> */}
    </Link>
  );
}

// import { usePathname } from "next/navigation";
// import Link from "next/link";
// import { JSX } from "react";

// interface NavigationTileProps {
//   navItem: { title: string; icon: JSX.Element };
// }

// export default function NavigationTile({ navItem }: NavigationTileProps) {
//   const currentPath = usePathname();
//   const navPath = `/${navItem.title.toLowerCase()}`;
//   const isRouteTile = currentPath === navPath;

//   return (
//     <Link
//       href={navPath}
//       className={`flex items-center gap-3 py-2 px-4 rounded-lg transition-all duration-300 ${
//         isRouteTile ? "bg-[#0086CA] text-white" : "hover:scale-105 hover:bg-[#005f73]"}
//       `}
//     >
//       <div
//         className={`flex items-center gap-2 transition-all duration-300 ${
//           isRouteTile ? "text-white" : "text-black"
//         }`}
//       >
//         <div
//           className={`h-5 w-5 transition-transform duration-300 ${
//             isRouteTile ? "rotate-360" : ""
//           }`}
//         >
//           {navItem.icon}
//         </div>
//         <h6 className="text-sm">{navItem.title}</h6>
//       </div>
//     </Link>
//   );
// }
