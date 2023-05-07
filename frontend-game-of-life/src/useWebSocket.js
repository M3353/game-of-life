import axios from "axios";
import { useState, useEffect } from "react";

function useWebSocket({
  socketUrl,
  retry: defaultRetry = 3,
  retryInterval = 1000,
}) {
  const [data, setData] = useState({});
  const [send, setSend] = useState(() => () => undefined);
  const [retry, setRetry] = useState(defaultRetry);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const ws = new WebSocket(socketUrl);
    ws.onopen = () => {
      console.log("Connected to socket");
      setReady(true);

      setSend(() => {
        const d = JSON.stringify(data);
        ws.send(d);
      });

      ws.onmessage = (event) => {
        const msg = formatMessage(event.data);
        setData({ message: msg });
      };
    };
    ws.onclose = () => {
      setReady(false);

      if (retry > 0) {
        setTimeout(() => {
          setRetry((retry) => retry - 1);
        }, retryInterval);
      }
    };

    return () => {
      if (ws.readyState === 1) ws.close();
    };
  }, [retry]);

  return { send, data, ready };
}

function formatMessage(data) {
  try {
    const parsed = JSON.parse(data);
    return parsed;
  } catch (err) {
    return data;
  }
}

export default useWebSocket;
