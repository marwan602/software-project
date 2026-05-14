import type React from 'react';
import TaskCard from './TaskCard';
import useAppStore from '../stores/useAppStore';

const STATUSES = ['To Do', 'In Progress', 'Done'] as const;

const KanbanBoard = () => {
  const tasks = useAppStore((state) => state.tasks)

  const columns = [
    { id: 'To Do' as const, title: 'To Do', color: 'bg-[#6C3BFF]' },
    { id: 'In Progress' as const, title: 'In Progress', color: 'bg-[#F59E0B]' },
    { id: 'Done' as const, title: 'Done', color: 'bg-[#34D399]' },
  ];

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer!.setData('taskId', taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, status: string) => {
    const taskId = e.dataTransfer!.getData('taskId');
    if (!STATUSES.includes(status as typeof STATUSES[number])) return;

    const store = useAppStore.getState()
    const updatedTasks = store.tasks.map((task) => {
      if (task.id === taskId) {
        return { ...task, status: status as typeof STATUSES[number] };
      }
      return task;
    });
    useAppStore.setState({ tasks: updatedTasks });
  };

  return (
    <div className="flex gap-6 overflow-x-auto pb-4">
      {columns.map((column) => (
        <div
          key={column.id}
          className="flex-shrink-0 w-80 bg-[#1A1A2E] rounded-xl border border-[#2E2E4D] flex flex-col"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, column.id)}
        >
          {/* Column Header */}
          <div className="p-4 border-b border-[#2E2E4D] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${column.color}`}></div>
              <h3 className="text-[#E5E7EB] font-bold">{column.title}</h3>
            </div>
            <span className="text-[#9CA3AF] text-xs bg-[#22223B] px-2 py-1 rounded-full">
              {tasks.filter((t) => t.status === column.id).length}
            </span>
          </div>

          
          <div className="p-4 flex-1 flex flex-col gap-4 min-h-[200px]">
            {tasks
              .filter((task) => task.status === column.id)
              .map((task) => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task.id)}
                  className="cursor-grab active:cursor-grabbing"
                >
                  <TaskCard task={task} />
                </div>
              ))}
            
            {tasks.filter((t) => t.status === column.id).length === 0 && (
              <p className="text-[#9CA3AF] text-sm text-center py-4">No tasks</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default KanbanBoard;
