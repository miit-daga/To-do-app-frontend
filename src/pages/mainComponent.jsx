import React, { useState, useEffect } from "react";
import {
  Text,
  Input,
  Textarea,
  Button,
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  FormLabel,
} from "@chakra-ui/react";
import useTaskStore from "../taskStore.jsx";
import Navbar from "../components/navbar.jsx";
import {
  fetchTasks,
  createTask,
  updateTask,
  getCompletedTasks,
  getIncompletedTasks,
  updateTaskStatus,
  deleteTask,
} from "../utils/apis.js";

function MainComponent() {
  const { tasks, setTasks } = useTaskStore((state) => ({
    tasks: state.tasks,
    setTasks: state.setTasks,
  }));

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    completed: false,
    dueDate: "",
  });

  const [editingTask, setEditingTask] = useState(null);
  const [showCompletedTasks, setShowCompletedTasks] = useState(false);
  const [showIncompletedTasks, setShowIncompletedTasks] = useState(false);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [incompleteTasks, setIncompleteTasks] = useState([]);
  const {
    isOpen: editModalOpen,
    onOpen: openEditModal,
    onClose: closeEditModal,
  } = useDisclosure();
  const {
    isOpen: detailsModalOpen,
    onOpen: openDetailsModal,
    onClose: closeDetailsModal,
  } = useDisclosure();
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    const getTasks = async () => {
      try {
        const response = await fetchTasks();
        setTasks(response.data.tasks);
      } catch (error) {
        console.error(error);
      }
    };
    getTasks();
  }, [setTasks]);

  useEffect(() => {
    // Initialize filtered tasks when tasks change
    const completed = tasks.filter((task) => task.completed);
    const incomplete = tasks.filter((task) => !task.completed);
    setCompletedTasks(completed);
    setIncompleteTasks(incomplete);
  }, [tasks]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewTask({
      ...newTask,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditingTask({
      ...editingTask,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await createTask(newTask);
      setTasks([...tasks, response.data.task]);
      setNewTask({
        title: "",
        description: "",
        completed: false,
        dueDate: "",
      });
    } catch (error) {
      console.error(error);
    }
  };

  const updateFilteredTasks = (updatedTask) => {
    if (updatedTask.completed && !showCompletedTasks) {
      const updatedCompleted = completedTasks.filter(
        (task) => task._id !== updatedTask._id
      );
      setCompletedTasks(updatedCompleted);
    } else if (!updatedTask.completed && !showIncompletedTasks) {
      const updatedIncomplete = incompleteTasks.filter(
        (task) => task._id !== updatedTask._id
      );
      setIncompleteTasks(updatedIncomplete);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await updateTask(editingTask._id, {
        title: editingTask.title,
        description: editingTask.description,
        dueDate: editingTask.dueDate,
      });
      const updatedTasks = tasks.map((task) =>
        task._id === editingTask._id ? response.data.task : task
      );
      setTasks(updatedTasks);
      updateFilteredTasks(response.data.task);
      setEditingTask(null);
      closeEditModal(); // Close the edit modal after editing
    } catch (error) {
      console.error(error);
    }
  };

  const toggleCompletedTasks = async () => {
    setShowCompletedTasks(!showCompletedTasks);
    setShowIncompletedTasks(false);
    if (!showCompletedTasks) {
      try {
        const response = await getCompletedTasks();
        setTasks(response.data.tasks);
      } catch (error) {
        console.error(error);
      }
    } else {
      try {
        const response = await fetchTasks();
        setTasks(response.data.tasks);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const toggleIncompletedTasks = async () => {
    setShowIncompletedTasks(!showIncompletedTasks);
    setShowCompletedTasks(false);
    if (!showIncompletedTasks) {
      try {
        const response = await getIncompletedTasks();
        setTasks(response.data.tasks);
      } catch (error) {
        console.error(error);
      }
    } else {
      try {
        const response = await fetchTasks();
        setTasks(response.data.tasks);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const markAsComplete = async (id) => {
    try {
      const response = await updateTaskStatus(id, { completed: true });
      const updatedTask = response.data.task;
      const updatedTasks = tasks.map((task) =>
        task._id === updatedTask._id ? updatedTask : task
      );
      setTasks(updatedTasks);
      updateFilteredTasks(updatedTask);
    } catch (error) {
      console.error(error);
    }
  };

  const markAsIncomplete = async (id) => {
    try {
      const response = await updateTaskStatus(id, { completed: false });
      const updatedTask = response.data.task;
      const updatedTasks = tasks.map((task) =>
        task._id === updatedTask._id ? updatedTask : task
      );
      setTasks(updatedTasks);
      updateFilteredTasks(updatedTask);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
      const filteredTasks = tasks.filter((task) => task._id !== id);
      setTasks(filteredTasks);
      updateFilteredTasks({ _id: id, completed: false });
    } catch (error) {
      console.error(error);
    }
  };

  const openEditTaskModal = (task) => {
    setEditingTask(task);
    openEditModal();
  };

  const openTaskDetailsModal = (task) => {
    setSelectedTask(task);
    openDetailsModal();
  };

  const closeModal = () => {
    setEditingTask(null);
    setSelectedTask(null);
    closeEditModal();
    closeDetailsModal();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  return (
    <div>
      <Navbar />
      <Box as="form" onSubmit={handleSubmit} mb={4}>
        <Input
          name="title"
          placeholder="Task Title"
          value={newTask.title}
          onChange={handleChange}
          required
          mb={2} // Add margin-bottom to create space
          border="2px" // Make border thicker
          borderColor="gray.400" // Change border color
        />
        <Textarea
          name="description"
          placeholder="Task Description"
          value={newTask.description}
          onChange={handleChange}
          mb={2} // Add margin-bottom to create space
          border="2px" // Make border thicker
          borderColor="gray.400" // Change border color
        />
        <FormLabel htmlFor="dueDate">Due Date</FormLabel>
        <Input
          id="dueDate"
          name="dueDate"
          type="date"
          value={newTask.dueDate}
          onChange={handleChange}
          required
          mb={2} // Add margin-bottom to create space
          border="2px" // Make border thicker
          borderColor="gray.400" // Change border color
        />
        <Button type="submit" mt={2} bg="#6000f3" color="white">
          {/* Change color scheme to 'teal' */}
          Add Task
        </Button>
      </Box>
      <Button onClick={toggleCompletedTasks} mr={2} mb={2} colorScheme="blue">
        {showCompletedTasks ? "Show All Tasks" : "Show Completed Tasks"}
      </Button>
      <Button onClick={toggleIncompletedTasks} mb={2} colorScheme="blue">
        {showIncompletedTasks ? "Show All Tasks" : "Show Incompleted Tasks"}
      </Button>
      <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
        {(showCompletedTasks
          ? completedTasks
          : showIncompletedTasks
            ? incompleteTasks
            : tasks
        ).map((task, index) => (
          <li key={task._id} style={{ marginBottom: "1rem" }}>
            <Box
              p={4}
              shadow="md"
              borderWidth="1px"
              borderRadius="md"
              cursor="pointer"
            >
              <Text fontWeight="bold">
                {index + 1}. {task.title}
              </Text>
              <Text>{task.description}</Text>
              <Box
                mt={2}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Button
                  onClick={() => openTaskDetailsModal(task)}
                  colorScheme="blue"
                >
                  View Details
                </Button>
                <Box>
                  {task.completed ? (
                    <Button
                      onClick={() => markAsIncomplete(task._id)}
                      colorScheme="orange"
                    >
                      Mark as Incomplete
                    </Button>
                  ) : (
                    <Button
                      onClick={() => markAsComplete(task._id)}
                      colorScheme="green"
                    >
                      Mark as Complete
                    </Button>
                  )}
                  <Button
                    onClick={() => openEditTaskModal(task)}
                    ml={2}
                    colorScheme="teal"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(task._id)}
                    ml={2}
                    colorScheme="red"
                  >
                    Delete
                  </Button>
                </Box>
              </Box>
            </Box>
          </li>
        ))}
      </ul>

      {/* Edit Task Modal */}
      <Modal isOpen={editModalOpen} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Task</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {editingTask && (
              <Box as="form" onSubmit={handleEditSubmit}>
                <Input
                  name="title"
                  placeholder="Task Title"
                  value={editingTask.title}
                  onChange={handleEditChange}
                  required
                  mb={2}
                  border="2px"
                  borderColor="gray.400"
                />
                <Textarea
                  name="description"
                  placeholder="Task Description"
                  value={editingTask.description}
                  onChange={handleEditChange}
                  mb={2}
                  border="2px"
                  borderColor="gray.400"
                />
                <FormLabel htmlFor="editDueDate">Due Date</FormLabel>
                <Input
                  id="editDueDate"
                  name="dueDate"
                  type="date"
                  value={editingTask.dueDate}
                  onChange={handleEditChange}
                  required
                  mb={2}
                  border="2px"
                  borderColor="gray.400"
                />
                <Button type="submit" colorScheme="blue" mt={2}>
                  Update Task
                </Button>
              </Box>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Task Details Modal */}
      <Modal isOpen={detailsModalOpen} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedTask && selectedTask.title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>{selectedTask && selectedTask.description}</Text>
            <Box display="flex" alignItems="flex-start" mt={2}>
              <FormLabel marginRight="1">Due Date:</FormLabel>
              <Text>{selectedTask && formatDate(selectedTask.dueDate)}</Text>
            </Box>

            <Box display="flex" alignItems="flex-start" mt={2}>
              <FormLabel marginRight="1">Completed:</FormLabel>
              <Text>{selectedTask && (selectedTask.completed ? "Yes" : "No")}</Text>
            </Box>
            <Box display="flex" alignItems="flex-start" mt={2}>
              <FormLabel marginRight="1">Created At:</FormLabel>
              <Text>{selectedTask && formatDateTime(selectedTask.createdAt)}</Text>
            </Box>
            <Box display="flex" alignItems="flex-start" mt={2}>
              <FormLabel marginRight="1">Updated At:</FormLabel>
              <Text>{selectedTask && formatDateTime(selectedTask.updatedAt)}</Text>
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={closeModal}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

export default MainComponent;
