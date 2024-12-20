import Image from "next/image";

export default () => (
  <>
    <div className="flex">
      <Image
        className="h-screen w-1/2 object-cover"
        src={"/images/bg.jpg"}
        alt="exchange"
        width="100"
        height="100"
      />
      <div className="bg-white h-screen w-1/2 flex">
        <div className="m-auto text-center flex flex-col items-center">
          <Image
            className=""
            src="/icons/logo.png"
            alt="logo"
            height="50"
            width="50"
          />
          <h1 className="font-bold my-3">Log In</h1>
          <input
            className="border-[#E8E8E8] border-[1px] rounded-md w-60 h-11 px-2 placeholder:text-[#1A4F6E] placeholder:opacity-40 focus:outline-[#E8E8E8] text-[#1A4F6E] font-bold"
            type="email"
            placeholder="Email"
          />
          <br />
          <input
            className="border-[#E8E8E8] border-[1px] rounded-md w-60 h-11 px-2 placeholder:text-[#1A4F6E] placeholder:opacity-40 focus:outline-[#E8E8E8] text-[#1A4F6E] font-bold"
            type="password"
            placeholder="Password"
          />
          <br />
          <button
            className={`bg-[#0086CA] text-white font-bold px-24 py-2 rounded-md`}
          >
            Log in
          </button>
        </div>
      </div>
    </div>
  </>
);
