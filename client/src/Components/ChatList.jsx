import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";

const ChatList = () => {
  const queryClient = useQueryClient();
  const { isPending, error, data } = useQuery({
    queryKey: ["userChats"],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_API_URL}/api//userchats`, {
        credentials: "include",
      }).then((res) => res.json()),
  });

  // Delete chat mutation
  const deleteMutation = useMutation({
    mutationFn: (chatId) =>
      fetch(`${import.meta.env.VITE_API_URL}/api/chats/${chatId}`, {
        method: "DELETE",
        credentials: "include",
      }),
    onSuccess: () => {
      // Invalidate and refetch the chats query
      queryClient.invalidateQueries({ queryKey: ["userChats"] });
    },
  });

  const handleDelete = async (chatId, e) => {
    e.preventDefault(); // Prevent link navigation
    if (window.confirm("Are you sure you want to delete this chat?")) {
      deleteMutation.mutate(chatId);
    }
  };
  return (
    <div className="flex flex-col h-screen gap-3  ">
      <span className=" font-semibold text-xs mb-2.5">Dashboard</span>
      <Link to="/dashboard">Create a new chat</Link>
      <Link to="/">Explore Chats</Link>
      <Link to="/dashboard">Contact</Link>
      <hr className="border-none h-[2px] bg-[#ddd] rounded-md my-5 mx-0 opacity-10" />
      {/* List of chats */}
      <span className="font-semibold text-xs mb-2.5">Recent Chat</span>
      <div className="flex flex-col overflow-auto">
        {isPending ? (
          <p>Loading...</p>
        ) : error ? (
          " "
        ) : (
          data?.map((chat) => (
            <div className="flex items-center justify-between p-2  ">
              <Link
                to={`/dashboard/chats/${chat._id}`}
                key={chat._id}
                className="p-2.5 rounded-lg hover:bg-[#2c2937]"
              >
                {chat.title}
              </Link>
              <button
                onClick={(e) => handleDelete(chat._id, e)}
                className="p-2 text-red-600 hover:bg-red-900 hover:rounded-full rounded"
              >
                <MdDelete size={16} />
              </button>
            </div>
          ))
        )}
        {/* More chat links */}

        {/* Repeat this block for other chats */}
      </div>
      <hr className="border-none h-[2px] bg-[#ddd] rounded-md my-5 mx-0 opacity-10" />
      {/* Upgrade Section */}
      <div className="flex gap-2.5 items-center mb-32 flex-col">
        <img src="/logo.svg" alt="" className="w-36 " />
        <div className="flex flex-col">
          <span className="font-semibold">Upgrade to Alphabot</span>
          <span className="text-[#888]">
            Get unlimited access to all features
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChatList;
