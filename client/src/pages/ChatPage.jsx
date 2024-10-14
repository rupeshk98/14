import { useQuery } from "@tanstack/react-query";
import NewPrompt from "../Components/NewPrompt";
import { useLocation } from "react-router-dom";
import Markdown from "react-markdown";
import { IKImage } from "imagekitio-react";

const ChatPage = () => {
  const path = useLocation().pathname;
  const chatId = path.split("/").pop();
  const { isPending, error, data } = useQuery({
    queryKey: ["chat", chatId],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_API_URL}/api/chats/${chatId}`, {
        credentials: "include",
      }).then((res) => res.json()),
  });

  return (
    <div className=" pb-[200px] lg:pt-2 h-screen flex flex-col items-center">
      {/* Chat area */}
      <div className="   flex-1 w-full flex gap-5 justify-center overflow-y-auto ">
        <div className="w-full px-14 h-full lg:pr-36 flex-col flex bottom-0 ">
          {/* Messages */}
          {/* <div className="p-5 self-start">Test message from ai 1</div> */}

          {isPending ? (
            <p>Loading...</p>
          ) : error ? (
            "something went wrong"
          ) : (
            data?.history?.map((message, index) => (
              <>
                {message.img && (
                  <IKImage
                    urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
                    path={message.img}
                    height="300"
                    width="400"
                    transformation={[{ height: 300, width: 400 }]}
                    loading="lazy"
                    lqip={{ active: true, quality: 20 }}
                  />
                )}
                <div
                  key={index}
                  // className=""
                  className={
                    message.role === "user"
                      ? "bg-[#2c2937] rounded-[20px] max-w-[80%] self-end px-5 py-2 "
                      : "p-5 self-start "
                  }
                >
                  <Markdown>{message.parts[0].text}</Markdown>
                </div>
              </>
            ))
          )}

          <div className=" mt-5">{data && <NewPrompt data={data} />}</div>
        </div>
      </div>

      {/* New prompt */}
    </div>
  );
};

export default ChatPage;
