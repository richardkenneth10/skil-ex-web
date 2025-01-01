import Constants from "@/utils/constants";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Drawer({ isOpen }: { isOpen: boolean }) {
  const router = useRouter();

  return (
    <div
      className={`md:hidden fixed top-0 bottom-0 z-10 w-3/4 flex flex-col justify-between bg-white shadow-2xl rounded-r-2xl transition-all duration-300 ${
        isOpen ? "left-0" : "-left-3/4"
      }`}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="mt-20">
        <div className="bg-black h-[0.1px]"></div>
        {Constants.drawerItems.top.map((d) => (
          <Link href={""} className="block w-full" key={d.title}>
            <div className="flex items-center gap-2 px-4 py-2">
              <d.icon />
              <h6>{d.title}</h6>
            </div>
            <div className="bg-black h-[0.1px]"></div>
          </Link>
        ))}
      </div>

      <div className="mb-4">
        <div className="bg-black h-[0.1rem]"></div>
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
    </div>
  );
}
