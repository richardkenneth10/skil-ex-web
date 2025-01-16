import { FormEvent, useState } from "react";
import { FaPaperPlane } from "react-icons/fa";

interface ChatInputProps {
  ref: React.RefObject<HTMLInputElement | null>;
  onSend: (text: string) => void;
}

export default function ChatInput({ ref, onSend }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const inputHandler = (e: FormEvent<HTMLInputElement>) => {
    setMessage(e.currentTarget.value);
  };
  const sendHandler = (e: FormEvent<HTMLFormElement | HTMLButtonElement>) => {
    e.preventDefault();
    const trimmedMsg = message.trim();
    if (trimmedMsg) {
      onSend(message);
      console.log(message);
      setMessage("");
    }
  };
  return (
    <form
      className="fixed bottom-20 md:bottom-4 left-0 md:left-[16.666667%] md:right-0 w-full md:w-auto px-2 h-10 overflow-hidden"
      onSubmit={sendHandler}
    >
      <input
        className="w-full rounded-2xl h-full outline-none p-4 pr-12 caret-[#0086CA]"
        placeholder="Message"
        type="text"
        ref={ref}
        value={message}
        onInput={inputHandler}
      />
      <button disabled={!message.trim()} onClick={sendHandler}>
        <FaPaperPlane
          className="absolute right-6 top-0 bottom-0 my-auto"
          size={25}
          color={`${!message.trim() ? "#bbbbbb" : "#0086CA"}`}
        />
      </button>
    </form>
  );
}
