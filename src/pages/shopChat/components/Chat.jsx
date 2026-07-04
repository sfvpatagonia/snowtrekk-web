import { formatDateHHmm, formatDateTodayOrDay } from "@/utils/dateParser";

/**
 * @param {{ chats: Array<{ senderType: 'user' | 'shop', content: string, createdAt: string }> }} props
 */
export function Chat({ chats }) {
  return (
    <div className="flex bg-main-50 dark:bg-main-950 w-full flex-col p-2 gap-4 h-[600px] overflow-auto items-center rounded">
      <ul className="flex flex-col bg-main-100 dark:bg-main-900 h-full w-full max-w-full overflow-y-auto p-4 gap-2">
        {chats.map((chat, index) => (
          <li
            key={index}
            className={`${
              chat.senderType === "shop"
                ? "self-start bg-green-700 dark:bg-green-500 rounded-bl-none text-main-0"
                : "self-end bg-main-600 dark:bg-main-400 rounded-br-none"
            } flex flex-col p-2 rounded max-w-3/4 text-main-1000`}
          >
            <p className="text-xs text-start whitespace-pre-wrap">
              {chat.body}
            </p>
            <span className="text-[10px] text-end">
              {formatDateHHmm(chat.createdAt)} -
              {" " + formatDateTodayOrDay(chat.createdAt)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Chat;
