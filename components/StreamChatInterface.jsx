import { useRouter } from "next/navigation";
import {
  RefObject,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Channel, Event, StreamChat } from "stream-chat";
import { getStreamUserToken } from "@/lib/actions/stream";
export default function StreamChatInterface({ otherUser, ref }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  useEffect(() => {
    async function iniatilizeChat() {
      try {
        setError(null);
        const { token, userId, userName, userImage } =
          await getStreamUserToken();
        console.log(token, userId, userName, userImage);
      } catch (e) {
        // router.push("/matches");
      } finally {
        setLoading(false);
      }
    }
    if (otherUser) {
      console.log("hey");
      iniatilizeChat();
    }
  }, [otherUser]);
  return <div>stream chat interface</div>;
}
