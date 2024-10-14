import React, { useEffect, useRef, useState } from "react";
import Upload from "./Upload";
import { IKImage } from "imagekitio-react";
import model from "../lib/gemini";
import Markdown from "react-markdown";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const NewPrompt = ({ data }) => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [img, setImg] = useState({
    isLoading: false,
    error: "",
    dbData: {},
    aiData: {},
  });

  const chat = model.startChat({
    history: [
      {
        role: "user",
        parts: [{ text: "Hello" }],
      },
      {
        role: "model",
        parts: [{ text: "Great to meet you. What would you like to know?" }],
      },
    ],
  });

  // Ref for the chat container
  const endRef = useRef(null);
  const fromRef = useRef(null);

  useEffect(() => {
    // Scroll inside the useEffect
    if (endRef.current) {
      endRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    }
  }, [data, question, answer, img.dbData]);

  ///
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => {
      return fetch(`${import.meta.env.VITE_API_URL}/api/chats/${data._id}`, {
        method: "put",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: question.length ? question : undefined,
          answer,
          img: img.dbData?.filePath || undefined,
        }),
      }).then((res) => res.json());
    },
    onSuccess: () => {
      queryClient
        .invalidateQueries({ queryKey: ["chat", data._id] })
        .then(() => {
          fromRef.current.reset();
          setQuestion("");
          setAnswer("");
          setImg({
            isLoading: false,
            error: "",
            dbData: {},
            aiData: {},
          });
        });
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const add = async (text, isInitial) => {
    if (!isInitial) setQuestion(text);

    try {
      const result = await chat.sendMessageStream(
        Object.entries(img.aiData).length ? [img.aiData, text] : [text]
      );

      let acculatedText = "";
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();

        acculatedText += chunkText;
        setAnswer(acculatedText); // Update answer as chunks arrive
      }
      mutation.mutate();
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = e.target.text.value;
    if (!text) return;
    add(text, false);
  };
  const hasRun = useRef(false);
  useEffect(() => {
    if (!hasRun.current) {
      if (data?.history?.length === 1) {
        add(data.history[0].parts[0].text, true);
      }
    }
    hasRun.current = true;
  }, []);

  return (
    <>
      {/* Add new Chat */}
      {img.dbData?.filePath && (
        <IKImage
          urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
          path={img.dbData?.filePath}
          width="380"
          transformation={[{ height: 380 }]}
        />
      )}

      {/* Chat Container */}
      <div className="chat-container" ref={endRef}>
        {/* Messages */}
        {question && (
          <div className="flex justify-end">
            <div className="bg-[#2c2937]  flex-col flex rounded-[20px] max-w-[80%] p-5 self-end">
              {question}
            </div>
          </div>
        )}
        {answer && (
          <div className="p-5 self-start ">
            <Markdown>{answer}</Markdown>
          </div>
        )}
      </div>

      {/* Form */}
      <form
        className=" mb-[120px] mr-16 lg:ml-32 absolute bottom-0 max-w-lg mx-auto outline-none md:w-full sm:max-w-xl xl:max-w-2xl   md:max-w-3xl lg:max-w-xl px-4 py-3 flex items-center  bg-[#2c2937] rounded-2xl"
        onSubmit={handleSubmit}
        ref={fromRef}
      >
        <Upload setImg={setImg} />
        <input
          id="file"
          type="file"
          multiple={false}
          hidden
          className="w-full p-2 pl-10 text-sm text-gray-700 "
        />

        {/* Text input */}
        <input
          type="text"
          name="text"
          placeholder="Ask me anything"
          className="w-full  text-sm outline-none px-5  border-none bg-transparent border border-gray-200"
        />

        {/* Submit button */}
        <button
          type="submit"
          className=" bg-[#605e68]   font-bold py-2 px-4 rounded-[20px] "
        >
          <img src="/arrow.png" alt="Send" className="w-4 h-4" />
        </button>
      </form>
    </>
  );
};

export default NewPrompt;
