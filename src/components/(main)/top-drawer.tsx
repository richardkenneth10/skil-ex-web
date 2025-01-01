import Constants from "@/utils/constants";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function TopDrawer({ isOpen }: { isOpen: boolean }) {
  const router = useRouter();

  return (
    <div
      className={`hidden md:flex fixed right-4 h-20 w-[11.5rem] flex-col justify-between bg-white rounded-b-md transition-all duration-300 ${
        isOpen ? "top-[8vh] shadow-2xl" : "-top-[5rem]"
      }`}
      onClick={(e) => e.stopPropagation()}
    >
      {Constants.drawerItems.bottom.map((d) => {
        const pathUrlOrCB = d.pathUrlOrCB;
        return typeof pathUrlOrCB === "string" ? (
          <Link className="block w-full" key={d.title} href={pathUrlOrCB}>
            <div className="flex items-center gap-2 px-4 py-2">
              <d.icon />
              <h6>{d.title}</h6>
            </div>
          </Link>
        ) : (
          <button
            className="block w-full"
            key={d.title}
            onClick={() => pathUrlOrCB(router)}
          >
            <div className="flex items-center gap-2 px-4 py-2">
              <d.icon />
              <h6>{d.title}</h6>
            </div>
          </button>
        );
      })}
    </div>
  );
}
