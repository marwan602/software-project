
import { useState } from "react";
import { mockComments } from "../../data/mockComments";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function TaskModal({ isOpen, onClose }: Props) {
    const [subtasks, setSubtasks] = useState<string[]>([
        "Design UI",
        "Implement logic"
    ]);
    const [newSubtask, setNewSubtask] = useState("");
    const [comments, setComments] = useState<string[]>(mockComments);
    const [newComment, setNewComment] = useState("");
  if (!isOpen) return null;


  return (
   
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
    <div className="bg-[#1e1e2f] text-white w-[400px] max-h-[80vh] overflow-y-auto rounded-2xl p-6 shadow-xl">

      <h2 className="text-xl font-bold mb-4 text-white">Task Details</h2>

      {/* Title */}
      <input
  className="w-full bg-[#2a2a40] border border-gray-600 text-white p-2 rounded-lg mb-3 placeholder-gray-400"
  placeholder="Task title"/>


      {/* Description */}
      <textarea
  className="w-full bg-[#2a2a40] border border-gray-600 text-white p-2 rounded-lg mb-3 placeholder-gray-400"
  placeholder="Description"/>


      {/* Subtasks */}
      {/* Subtasks */}
<div className="mb-4">
  <h3 className="font-semibold mb-2 text-gray-300">Subtasks</h3>

  {/* Input to add subtask */}
  <input
    value={newSubtask}
    onChange={(e) => setNewSubtask(e.target.value)}
    placeholder="Add subtask"
    className="w-full bg-[#2a2a40] border border-gray-600 text-white p-2 rounded mb-2"
  />

  <button
    onClick={() => {
      if (newSubtask.trim() !== "") {
        setSubtasks([...subtasks, newSubtask]);
        setNewSubtask("");
      }
    }}
    className="text-sm text-purple-400 mb-2"
  >
    + Add Subtask
  </button>

  {/* Subtasks List */}
  <ul className="space-y-1 text-sm text-gray-200">
    {subtasks.map((task, index) => (
      <li key={index}>• {task}</li>
    ))}
  </ul>
</div>
      
      {/* Comments */}
      {/* Comments */}
<div className="mb-4">
  <h3 className="font-semibold mb-2 text-gray-300">Comments</h3>

  {/* Input to add comment */}
  <input
    value={newComment}
    onChange={(e) => setNewComment(e.target.value)}
    placeholder="Add comment..."
    className="w-full bg-[#2a2a40] border border-gray-600 text-white p-2 rounded mb-2"
  />

  <button
    onClick={() => {
      if (newComment.trim() !== "") {
        setComments([...comments, newComment]);
        setNewComment("");
      }
    }}
    className="text-sm text-purple-400 mb-2"
  >
    + Add Comment
  </button>

  {/* Comments List */}
  <ul className="space-y-1 text-sm text-gray-200">
    {comments.map((comment, index) => (
      <li key={index} className="bg-[#2a2a40] p-2 rounded">
        {comment}
      </li>
    ))}
  </ul>
</div>

      {/* Buttons */}
      <div className="flex justify-end gap-2">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500"
        >
          Cancel
        </button>

        <button
  onClick={() => {
    console.log("Saved:", {
      subtasks,
      comments,
    });
    onClose();
  }}
  className="px-4 py-2 bg-purple-600 text-white rounded-lg"
>
  Save
 </button>
</div>
</div>
</div>
);
}