

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function TaskModal({ isOpen, onClose }: Props) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0,0,0,0.5)"
    }}>
      <div style={{
        background: "white",
        padding: "20px",
        margin: "100px auto",
        width: "300px",
        borderRadius: "10px"
      }}>
        <h2>Task Details</h2>

        <input placeholder="Task title" />
        <br /><br />
        <textarea placeholder="Description"></textarea>

        <h3>Subtasks</h3>
        <ul>
          <li>Design UI</li>
        </ul>

        <h3>Comments</h3>
        <p>This is a comment</p>

        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}