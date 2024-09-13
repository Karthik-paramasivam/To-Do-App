// import React, { useState, useEffect } from "react";
// import dayjs from "dayjs";
// import isSameOrBefore from "dayjs/plugin/isSameOrBefore"; // Import dayjs plugin
// import Container from "react-bootstrap/Container";
// import Row from "react-bootstrap/Row";
// import Col from "react-bootstrap/Col";
// import Card from "react-bootstrap/Card";
// import { Button, Form, Input, Radio, message, Table, Modal, Select } from "antd";
// import { DatePicker } from "antd";
// import "bootstrap/dist/css/bootstrap.min.css";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faTasks, faCheck, faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
// import "./App.css";

// const { TextArea } = Input;
// const { Option } = Select;

// dayjs.extend(isSameOrBefore); // Extend dayjs with the plugin

// function Todo() {
//   const [form] = Form.useForm();
//   const plainOptions = ["High", "Medium", "Low"];

//   const [task, setTask] = useState("");
//   const [startDate, setStartDate] = useState(null);
//   const [endDate, setEndDate] = useState(null);
//   const [priority, setPriority] = useState("Medium");
//   const [remarks, setRemarks] = useState("");
//   const [tasksList, setTasksList] = useState([]);
//   const [editingTaskId, setEditingTaskId] = useState(null);
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [selectedTask, setSelectedTask] = useState(null);
//   const [status, setStatus] = useState("Pending");
//   const [searchText, setSearchText] = useState("");
//   const [filteredTasks, setFilteredTasks] = useState([]);

//   useEffect(() => {
//     const storedTasks = localStorage.getItem('tasks');
//     if (storedTasks) {
//       const tasks = JSON.parse(storedTasks);

//       setTasksList(JSON.parse(storedTasks));
//       setFilteredTasks(tasks);

//     }
//   }, []);

//   const updateLocalStorage = (tasks) => {
//     localStorage.setItem('tasks', JSON.stringify(tasks));
//   };

//   const styl = `
//   .ant-modal .ant-modal-title {
//     margin: 0;
//     color: rgba(0, 0, 0, 0.88);
//     font-weight: 600;
//     line-height: 1.5;
//     word-wrap: break-word;
//     text-align: center;
//     font-size: 18px;
// }`

//   const onFinish = () => {
//     const newTask = {
//       id: tasksList.length + 1,
//       task,
//       startDate: startDate ? startDate.toISOString() : null,
//       endDate: endDate ? endDate.toISOString() : null,
//       priority,
//       remarks,
//       status,
//     };

//     const updatedTasksList = [...tasksList, newTask];
//     setTasksList(updatedTasksList);
//     setFilteredTasks(updatedTasksList);
//     updateLocalStorage(updatedTasksList);
//     form.resetFields();
//     resetFormStates();
//     message.success("Task added successfully!");
//   };

//   const onUpdate = () => {
//     const updatedTasksList = tasksList.map((t) =>
//       t.id === editingTaskId
//         ? { ...t, task, startDate: startDate ? startDate.toISOString() : null, endDate: endDate ? endDate.toISOString() : null, priority, remarks, status }
//         : t
//     );

//     setTasksList(updatedTasksList);
//     setFilteredTasks(updatedTasksList);
//     updateLocalStorage(updatedTasksList);
//     form.resetFields();
//     resetFormStates();
//     message.success("Task updated successfully!");
//   };

//   const handleSearch = (e) => {
//     const value = e.target.value.toLowerCase();
//     setSearchText(value);

//     const filtered = tasksList.filter((task) => {
//       const taskText = task.task.toLowerCase();
//       const priorityText = task.priority.toLowerCase();
//       const statusText = task.status.toLowerCase();
//       const startDateText = task.startDate;
//       const endDateText = task.endDate;

//       return (
//         taskText.includes(value) ||
//         priorityText.includes(value) ||
//         statusText.includes(value) ||
//         startDateText.includes(value) ||
//         endDateText.includes(value)
//       );
//     });

//     setFilteredTasks(filtered);
//   };

//   const closeModal = () => {
//     setIsModalVisible(false);
//   };

//   const resetFormStates = () => {
//     setTask("");
//     setStartDate(null);
//     setEndDate(null);
//     setPriority("Medium");
//     setRemarks("");
//     setStatus("Pending");
//     setEditingTaskId(null);
//   };

//   const markComplete = (id) => {
//     const updatedTasksList = tasksList.map((task) =>
//       task.id === id ? { ...task, status: "Completed" } : task
//     );
//     setTasksList(updatedTasksList);
//     setFilteredTasks(updatedTasksList);
//     updateLocalStorage(updatedTasksList);
//     message.success("Task marked as complete!");
//   };

//   const deleteTask = (id) => {
//     const updatedTasksList = tasksList.filter((task) => task.id !== id);
//     setTasksList(updatedTasksList);
//     setFilteredTasks(updatedTasksList);
//     updateLocalStorage(updatedTasksList);
//     message.success("Task deleted successfully!");
//   };

//   const handleStartDateChange = (date) => {
//     const dayjsDate = dayjs(date);
//     if (dayjsDate.isValid()) {
//       if (endDate && dayjsDate.isAfter(endDate)) {
//         message.error("Start date cannot be after end date.");
//         return;
//       }
//       setStartDate(dayjsDate);
//     } else {
//       message.error("Invalid start date.");
//     }
//   };

//   const handleEndDateChange = (date) => {
//     const dayjsDate = dayjs(date);
//     if (dayjsDate.isValid()) {
//       if (startDate && dayjsDate.isBefore(startDate)) {
//         message.error("End date cannot be before start date.");
//         return;
//       }
//       setEndDate(dayjsDate);
//     } else {
//       message.error("Invalid end date.");
//     }
//   };

//   const handleRowClick = (record) => {
//     setSelectedTask(record);
//     setIsModalVisible(true);
//   };

//   const editTask = (id) => {
//     const taskToEdit = tasksList.find((task) => task.id === id);
//     if (taskToEdit) {
//       setTask(taskToEdit.task);
//       setStartDate(taskToEdit.startDate ? dayjs(taskToEdit.startDate) : null);
//       setEndDate(taskToEdit.endDate ? dayjs(taskToEdit.endDate) : null);
//       setPriority(taskToEdit.priority);
//       setStatus(taskToEdit.status);
//       setRemarks(taskToEdit.remarks);
//       setEditingTaskId(id);
//       form.setFieldsValue({
//         task: taskToEdit.task,
//         startdate: taskToEdit.startDate ? dayjs(taskToEdit.startDate) : null,
//         enddate: taskToEdit.endDate ? dayjs(taskToEdit.endDate) : null,
//         status: taskToEdit.status,
//         priority: taskToEdit.priority,
//         remarks: taskToEdit.remarks,
//       });
//     }
//   };

//   const columns = [
//     {
//       title: "Task",
//       dataIndex: "task",
//       ellipsis: true,
//       key: "task",
//       width: "30%",
//       render: (text, record) => (
//         <Button
//           type="link"
//           onClick={() => handleRowClick(record)}
//           style={{ padding: 0, fontSize: "16px" }}
//         >
//           {text}
//         </Button>
//       ),
//     },
//     {
//       title: "Status",
//       dataIndex: "status",
//       ellipsis: true,
//       key: "status",
//       width: "30%",
//       render: (status) => (
//         <span style={{ color: status === "Completed" ? "green" : "red" }}>
//           {status}
//         </span>
//       ),
//     },
//     {
//       title: "Action",
//       key: "action",
//       width: "30%",
//       render: (text, record) => (
//         <>
//           {record.status === "Completed" ? null : (
//             <Button onClick={() => markComplete(record.id)} className="me-2 mt-1">
//               <FontAwesomeIcon icon={faCheck} className="text-success"/>
//             </Button>
//           )}
//           <Button onClick={() => editTask(record.id)} className="me-2 mt-1">
//             <FontAwesomeIcon icon={faPenToSquare} className="text-warning"/>
//           </Button>
//           <Button onClick={() => deleteTask(record.id)} className="mt-1">
//             <FontAwesomeIcon icon={faTrash} className="text-danger"/>
//           </Button>
//         </>
//       ),
//     },
//   ];

//   return (
//     <>
//       <Container className="container border border-white backImage">
//         <style>{styl}</style>
//         <Row className="m-0 p-0 mt-5">
//           <Col className="col col-10 col-lg-6 m-auto">
//             <div className="fs-3 fw-bold">
//               <FontAwesomeIcon icon={faTasks} /> Plan it! Do it!
//             </div>
//             <Form
//               form={form}
//               className="mt-3"
//               onFinish={editingTaskId ? onUpdate : onFinish}
//               autoComplete="off"
//             >
//               <Form.Item
//                 label="Task to do"
//                 name="task"
//                 rules={[
//                   {
//                     required: true,
//                     message: "Please input your task!",
//                   },
//                 ]}
//               >
//                 <Input value={task} onChange={(e) => setTask(e.target.value)} />
//               </Form.Item>

//               <Form.Item
//                 label="Start Date"
//                 name="startdate"
//                 rules={[
//                   {
//                     required: true,
//                     message: "Please input start date!",
//                   },
//                 ]}
//               >
//                 <DatePicker
//                   style={{ width: "100%" }}
//                   value={startDate}
//                   onChange={handleStartDateChange}
//                 />
//               </Form.Item>

//               <Form.Item
//                 label="End Date"
//                 name="enddate"
//                 rules={[
//                   {
//                     required: true,
//                     message: "Please input end date!",
//                   },
//                 ]}
//               >
//                 <DatePicker
//                   style={{ width: "100%" }}
//                   value={endDate}
//                   onChange={handleEndDateChange}
//                 />
//               </Form.Item>

//               <Form.Item
//                 label="Priority"
//                 name="priority"
//                 rules={[
//                   {
//                     required: true,
//                     message: "Please select your priority!",
//                   },
//                 ]}
//               >
//                 <Radio.Group value={priority} onChange={e => setPriority(e.target.value)}>
//                   {plainOptions.map((option) => (
//                     <Radio key={option} value={option}>
//                       {option}
//                     </Radio>
//                   ))}
//                 </Radio.Group>
//               </Form.Item>

//               <Form.Item
//                 label="Status"
//                 name="status"
//                 rules={[
//                   {
//                     required: true,
//                     message: "Please select your status!",
//                   },
//                 ]}
//               >
//                 <Select
//                   value={status}
//                   onChange={(value) => setStatus(value)}
//                 >
//                   <Option value="Pending">Pending</Option>
//                   <Option value="Completed">Completed</Option>
//                 </Select>
//               </Form.Item>

//               <Form.Item
//                 label="Remarks"
//                 name="remarks"
//               >
//                 <TextArea
//                   maxLength={150}
//                   value={remarks}
//                   onChange={(e) => setRemarks(e.target.value)}
//                 />
//               </Form.Item>

//               <Form.Item>
//                 <Button type="primary" htmlType="submit">
//                   {editingTaskId ? "Update Task" : "Submit Task"}
//                 </Button>
//                 <Button
//                   type="default"
//                   onClick={() => {
//                     resetFormStates();
//                     form.resetFields();
//                   }}
//                   className="ms-2"
//                 >
//                   Cancel
//                 </Button>
//               </Form.Item>
//             </Form>
//           </Col>
//         </Row>

//         <Container className="container border border-white">

//               <Row className="mt-3 row">
//             <Col className="col-12 col-lg-6 m-auto">
//               <Input.Search
//                 placeholder="Search tasks..."
//                 value={searchText}
//                 onChange={handleSearch}
//                 enterButton
//               />
//             </Col>
//           </Row>
//           <Row className="row mt-5">
//             <Col className="col-12">
//               <Table
//                 columns={columns}
//                 dataSource={filteredTasks}
//                 rowKey="id"
//                 pagination={{ pageSize: 10 }}
//                 size="large"
//               />
//             </Col>
//           </Row>
//         </Container>
//         <Modal title="Task Details" visible={isModalVisible} onCancel={closeModal} footer={null} className="m-auto">
//           {selectedTask && (
//             <>
//               <p><strong>Task:</strong> {selectedTask.task}</p>
//               <p><strong>Start Date:</strong> {selectedTask.startDate ? dayjs(selectedTask.startDate).format("YYYY-MM-DD") : "N/A"}</p>
//               <p><strong>End Date:</strong> {selectedTask.endDate ? dayjs(selectedTask.endDate).format("YYYY-MM-DD") : "N/A"}</p>
//               <p><strong>Priority:</strong> {selectedTask.priority}</p>
//               <p><strong>Remarks:</strong> {selectedTask.remarks}</p>
//               <p><strong>Status:</strong> {selectedTask.status}</p>
//             </>
//           )}
//         </Modal>
//       </Container>
//     </>
//   );
// }

// export default Todo;

import React, { useState, useEffect, useRef } from "react";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore"; // Import dayjs plugin
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {
  Button,
  Form,
  Input,
  Radio,
  message,
  Table,
  Modal,
  Select,
  DatePicker,
} from "antd";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTasks,
  faCheck,
  faPenToSquare,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import "./App.css";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const { TextArea } = Input;
const { Option } = Select;

dayjs.extend(isSameOrBefore); // Extend dayjs with the plugin

function Todo() {
  const [form] = Form.useForm();
  const plainOptions = ["High", "Medium", "Low"];

  const [task, setTask] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [priority, setPriority] = useState("Medium");
  const [remarks, setRemarks] = useState("");
  const [tasksList, setTasksList] = useState([]);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [status, setStatus] = useState("Pending");
  const [searchText, setSearchText] = useState("");
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [showChart, setShowChart] = useState(false); // New state variable for toggling chart visibility

  // useEffect(() => {
  //   const storedTasks = localStorage.getItem('tasks');
  //   if (storedTasks) {
  //     setTasksList(JSON.parse(storedTasks));
  //   }
  // }, []);

  // useEffect(() => {
  //   const storedTasks = localStorage.getItem('tasks');
  //   if (storedTasks) {
  //     setTasksList(JSON.parse(storedTasks));
  //   }

  //   // Start background checks every minute
  //   const interval = setInterval(() => {
  //     checkForExpiredTasks();
  //     checkForUpcomingNotifications();
  //   }, 60000); // 1 minute interval

  //   return () => clearInterval(interval); // Clean up on unmount
  // }, [tasksList]);

  const intervalRef = useRef(null);

  // useEffect(() => {
  //   // Load tasks from local storage
  //   const storedTasks = localStorage.getItem('tasks');
  //   if (storedTasks) {
  //     setTasksList(JSON.parse(storedTasks));
  //   }

  //   // Start background checks every minute
  //   intervalRef.current = setInterval(() => {
  //     checkForExpiredTasks();
  //     checkForUpcomingNotifications();
  //   }, 60000); // 1 minute interval

  //   return () => {
  //     if (intervalRef.current) {
  //       clearInterval(intervalRef.current);
  //     }
  //   };
  // }, []);

  useEffect(() => {
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
      const tasks = JSON.parse(storedTasks);

      setTasksList(JSON.parse(storedTasks));
      setFilteredTasks(tasks);
    }
    // intervalRef.current = setInterval(() => {
    //   checkForExpiredTasks();
    //   checkForUpcomingNotifications();
    // }, 60000);
    // return () => clearInterval(intervalRef.current);
  }, []);

  const updateLocalStorage = (tasks) => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  };

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      checkForExpiredTasks();
      checkForUpcomingNotifications(); // Call this function every minute
    }, 60000);

    return () => clearInterval(intervalRef.current);
  }, [tasksList]);

  const onFinish = () => {
    const newTask = {
      id: tasksList.length + 1,
      task,
      startDate: startDate ? startDate.toISOString() : null,
      endDate: endDate ? endDate.toISOString() : null,
      priority,
      remarks,
      status,
      notified: false, // New flag for notifications
    };
    // console.log("Start Date:", startDate ? startDate.format("YYYY-MM-DD HH:mm:ss") : null);
    // console.log("End Date:", endDate ? endDate.format("YYYY-MM-DD HH:mm:ss") : null);
    console.log(
      "Start Date:",
      startDate ? startDate.format("YYYY-MM-DD hh:mm A") : null
    );
    console.log(
      "End Date:",
      endDate ? endDate.format("YYYY-MM-DD hh:mm A") : null
    );

    const updatedTasksList = [...tasksList, newTask];
    setTasksList(updatedTasksList);
    updateLocalStorage(updatedTasksList);
    setFilteredTasks(updatedTasksList);
    form.resetFields();
    resetFormStates();
    message.success("Task added successfully!");
  };

  const styl = `:where(.css-dev-only-do-not-override-qnu6hi).ant-picker-dropdown .ant-picker-datetime-panel {
    display: flex;
    flex-direction: column; 
}

@media (max-width: 768px) 
  :where(.css-dev-only-do-not-override-qnu6hi).ant-picker-dropdown .ant-picker-datetime-panel {
      flex-direction: column; 
  }`;

  const onUpdate = () => {
    const updatedTasksList = tasksList.map((t) =>
      t.id === editingTaskId
        ? {
            ...t,
            task,
            startDate: startDate ? startDate.toISOString() : null,
            endDate: endDate ? endDate.toISOString() : null,
            priority,
            remarks,
            status,
          }
        : t
    );

    setTasksList(updatedTasksList);
    setFilteredTasks(updatedTasksList);

    updateLocalStorage(updatedTasksList);
    form.resetFields();
    resetFormStates();
    message.success("Task updated successfully!");
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);

    const filtered = tasksList.filter((task) => {
      const taskText = task.task.toLowerCase();
      const priorityText = task.priority.toLowerCase();
      const statusText = task.status.toLowerCase();
      const startDateText = task.startDate;
      const endDateText = task.endDate;

      return (
        taskText.includes(value) ||
        priorityText.includes(value) ||
        statusText.includes(value) ||
        startDateText.includes(value) ||
        endDateText.includes(value)
      );
    });

    setFilteredTasks(filtered);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const resetFormStates = () => {
    setTask("");
    setStartDate(null);
    setEndDate(null);
    setPriority("Medium");
    setRemarks("");
    setStatus("Pending");
    setEditingTaskId(null);
  };

  const markComplete = (id) => {
    const updatedTasksList = tasksList.map((task) =>
      task.id === id ? { ...task, status: "Completed" } : task
    );
    setTasksList(updatedTasksList);
    setFilteredTasks(updatedTasksList);
    updateLocalStorage(updatedTasksList);
    message.success("Task marked as complete!");
  };

  const deleteTask = (id) => {
    const updatedTasksList = tasksList.filter((task) => task.id !== id);
    setTasksList(updatedTasksList);
    setFilteredTasks(updatedTasksList);
    updateLocalStorage(updatedTasksList);
    message.success("Task deleted successfully!");
  };

  const handleStartDateChange = (date) => {
    const dayjsDate = dayjs(date);
    if (dayjsDate.isValid()) {
      if (endDate && dayjsDate.isAfter(endDate)) {
        message.error("Start date cannot be after end date.");
        setStartDate(null);
        form.setFieldsValue({ startdate: null });
        return;
      }
      setStartDate(dayjsDate);
    } else {
      message.error("Invalid start date.");
      setStartDate(null);
      form.setFieldsValue({ startdate: null });
    }
  };

  const handleEndDateChange = (date) => {
    const dayjsDate = dayjs(date);
    if (dayjsDate.isValid()) {
      if (startDate && dayjsDate.isBefore(startDate)) {
        message.error("End date cannot be before start date.");
        setEndDate(null);
        form.setFieldsValue({ enddate: null }); // This ensures DatePicker reflects null state
        return;
      }
      setEndDate(dayjsDate);
    } else {
      message.error("Invalid end date.");
      setEndDate(null);
      form.setFieldsValue({ enddate: null }); // Reset the DatePicker to empty
    }
  };

  const handleRowClick = (record) => {
    setSelectedTask(record);
    setIsModalVisible(true);
  };

  const checkForExpiredTasks = () => {
    const now = dayjs(); // Get current time
    const updatedTasksList = tasksList.map((task) => {
      if (
        task.status === "Pending" &&
        task.endDate &&
        dayjs(task.endDate).isSameOrBefore(now)
      ) {
        return { ...task, status: "Incomplete" }; // Mark as "Incomplete" if endDate is passed
      }
      return task;
    });
    setTasksList(updatedTasksList);
    updateLocalStorage(updatedTasksList);
  };

  // Run the task expiration check every 1 minute
  useEffect(() => {
    const intervalId = setInterval(checkForExpiredTasks, 60000); // 60 seconds
    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [tasksList]);

  const requestNotificationPermission = async () => {
    if (Notification.permission === "granted") {
      return true;
    } else if (Notification.permission === "default") {
      const permission = await Notification.requestPermission();
      return permission === "granted";
    }
    return false;
  };

  // Send reminder notification
  //  const sendNotification = async (task) => {
  //   const permissionGranted = await requestNotificationPermission();
  //   if (permissionGranted) {
  //     new Notification("Task Reminder", {
  //       body: `Task "${task.task}" is ending soon!`,
  //     });
  //   } else {
  //     message.warning("Notifications are blocked. Please enable them in your browser settings.");
  //   }
  // };

  // const sendNotification = (title, body) => {
  //   if (Notification.permission === "granted") {
  //     new Notification(title, {
  //       body,
  //       icon: "path-to-your-icon.png", // Optional icon
  //     });
  //   }
  // };
  const sendNotification = async (task) => {
    const permissionGranted = await requestNotificationPermission();

    if (permissionGranted) {
      new Notification("Task Reminder", {
        body: `Task "${task.task}" will end in less than 10 minutes!`, // Access the specific property (task name)
      });
    } else {
      message.warning(
        "Notifications are blocked. Please enable them in your browser settings."
      );
    }
  };

  // const checkForUpcomingNotifications = () => {

  //   const now = dayjs();
  //   tasksList.forEach((task) => {
  //     if (
  //       task.endDate &&
  //       task.status === "Pending" &&
  //       !task.notified &&
  //       now.isBefore(dayjs(task.endDate)) &&
  //       dayjs(task.endDate).subtract(10, "minute").isBefore(now)
  //     ) {
  //       sendNotification(task);
  //       task.notified = true; // Set notified flag to avoid repeated notifications
  //     }
  //   });
  // };

  const editTask = (id) => {
    const taskToEdit = tasksList.find((task) => task.id === id);
    if (taskToEdit) {
      setTask(taskToEdit.task);
      setStartDate(taskToEdit.startDate ? dayjs(taskToEdit.startDate) : null);
      setEndDate(taskToEdit.endDate ? dayjs(taskToEdit.endDate) : null);
      setPriority(taskToEdit.priority);
      setStatus(taskToEdit.status);
      setRemarks(taskToEdit.remarks);
      setEditingTaskId(id);
      form.setFieldsValue({
        task: taskToEdit.task,
        startdate: taskToEdit.startDate ? dayjs(taskToEdit.startDate) : null,
        enddate: taskToEdit.endDate ? dayjs(taskToEdit.endDate) : null,
        status: taskToEdit.status,
        priority: taskToEdit.priority,
        remarks: taskToEdit.remarks,
      });
    }
  };

  // const checkForUpcomingNotifications = () => {
  //   const now = dayjs();
  //   tasksList.forEach(task => {
  //     if (task.endDate && !task.notified && now.isBefore(dayjs(task.endDate)) && dayjs(task.endDate).subtract(10, 'minute').isBefore(now)) {
  //       if (task.status !== "Completed") {
  //         message.warning(`Task "${task.task}" will end in less than 10 minutes!`);
  //         task.notified = true;  // Set a flag to avoid repeated notifications
  //       }
  //     }
  //   });
  // };

  const checkForUpcomingNotifications = () => {
    const now = dayjs(); // Get current time

    const updatedTasksList = tasksList.map((task) => {
      const taskEndDate = dayjs(task.endDate);

      if (
        task.endDate &&
        task.status === "Pending" &&
        !task.notified && // Ensure it hasn't notified already
        taskEndDate.subtract(10, "minute").isBefore(now) && // Task ending in less than 10 minutes
        taskEndDate.isAfter(now) // Task has not ended yet
      ) {
        sendNotification(task); // Send reminder notification
        task.notified = true; // Mark as notified to prevent further notifications
      }
      return task; // Return task for updated list
    });

    // Update the task list and save changes to local storage
    setTasksList(updatedTasksList);
    setFilteredTasks(updatedTasksList);
    updateLocalStorage(updatedTasksList);
  };

  // const COLORS = ["#00C49F", "#FFBB28", "#FF8042", "#FF4040"];

  const chartData = [
    {
      name: "Pending",
      value: tasksList.filter((task) => task.status === "Pending").length,
    },
    {
      name: "Completed",
      value: tasksList.filter((task) => task.status === "Completed").length,
    },
    {
      name: "Incomplete",
      value: tasksList.filter((task) => task.status === "Incomplete").length,
    },
    {
      name: "Total",
      value: tasksList.filter((task) => task.status).length,
    },
  ];

  const COLORS = [
    "rgb(255 193 7 / 83%)", // Pending
    "rgb(29 193 116 / 78%)", // Completed
    "rgb(254 17 39 / 64%)", // Incomplete
    "#4096ff"
  ];

  // const renderCustomizedLabel = ({ percent, x, y, index }) => (
  //   <text x={x} y={y} fill="black" textAnchor="middle" dominantBaseline="central">
  //     {`${chartData[index].name} ${(percent * 100).toFixed(0)}%`}
  //   </text>
  // );

  const totalTasks = chartData.reduce((sum, entry) => sum + entry.value, 0);

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    const isMobile = window.innerWidth < 768; // Check if the device width is less than 768px

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={isMobile ? 10 : 16} // Change font size based on screen size
      >
        {`${chartData[index].name} (${(percent * 100).toFixed(0)}%)`}
      </text>
    );
  };

  const columns = [
    {
      title: "Task",
      dataIndex: "task",
      ellipsis: true,
      key: "task",
      width: "30%",
      render: (text, record) => (
        <Button
          type="link"
          onClick={() => handleRowClick(record)}
          style={{ padding: 0, fontSize: "16px" }}
        >
          {text}
        </Button>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      ellipsis: true,
      key: "status",
      width: "30%",
      render: (status) => (
        // <span style={{ color: status === "Completed" ? "green" : "red" }}>
        <span
          style={{
            color:
              status === "Completed"
                ? "green"
                : status === "Incomplete"
                ? "orange"
                : "red",
          }}
        >
          {status}
        </span>
      ),
    },
    {
      title: "Action",
      key: "action",
      width: "30%",
      render: (text, record) => (
        <>
          {record.status === "Completed" ? null : (
            <Button
              onClick={() => markComplete(record.id)}
              className="me-2 mt-1"
              style={{ backgroundColor: "rgb(27 173 105 / 85%)" }}
            >
              <FontAwesomeIcon icon={faCheck} className="text-white" />
            </Button>
          )}
          <Button
            onClick={() => editTask(record.id)}
            className="me-2 mt-1 bg-warning"
          >
            <FontAwesomeIcon icon={faPenToSquare} className="text-white" />
          </Button>
          <Button
            onClick={() => deleteTask(record.id)}
            className="mt-1"
            style={{ backgroundColor: "rgb(244 10 32 / 77%)" }}
          >
            <FontAwesomeIcon icon={faTrash} className="text-white" />
          </Button>
        </>
      ),
    },
  ];

  return (
    <>
      <Container className="container border border-white backImage">
        {/* <style>{styl}</style> */}
        <style>
          {`
          
          .ant-picker-dropdown .ant-picker-datetime-panel {
            display: flex;
            flex-direction: row !important; 
          }

          
          @media (max-width: 768px) {
            .ant-picker-dropdown .ant-picker-datetime-panel {
              flex-direction: column !important; 
            }
          }

          .ant-picker-dropdown .ant-picker-panel-container {
    overflow: hidden;
    vertical-align: top;
    background: #ffffff;
    border-radius: 8px;
    box-shadow: 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05);
    transition: margin 0.3s;
    display: inline-block;
    pointer-events: auto;
    margin-left: 10px;
}
        `}
        </style>
        <Row className="m-0 p-0 mt-5">
          <Col className="col col-10 col-lg-6 m-auto">
            <div className="fs-3 fw-bold">
              <FontAwesomeIcon icon={faTasks} /> Plan it! Do it!
            </div>
            <Form
              form={form}
              className="mt-3"
              onFinish={editingTaskId ? onUpdate : onFinish}
              autoComplete="off"
            >
              <Form.Item
                label="Task to do"
                name="task"
                rules={[
                  {
                    required: true,
                    message: "Please input your task!",
                  },
                ]}
              >
                <Input value={task} onChange={(e) => setTask(e.target.value)} />
              </Form.Item>

              <Form.Item
                label="Start Date"
                name="startdate"
                rules={[
                  {
                    required: true,
                    message: "Please input start date!",
                  },
                ]}
              >
                <DatePicker
                  style={{ width: "100%" }}
                  showTime={{ use12Hours: true, format: "hh:mm A" }}
                  value={startDate}
                  onChange={handleStartDateChange}
                />
              </Form.Item>

              <Form.Item
                label="End Date"
                name="enddate"
                rules={[
                  {
                    required: true,
                    message: "Please input end date!",
                  },
                ]}
              >
                <DatePicker
                  style={{ width: "100%" }}
                  showTime={{ use12Hours: true, format: "hh:mm A" }}
                  value={endDate}
                  onChange={handleEndDateChange}
                />
              </Form.Item>

              <Form.Item
                label="Priority"
                name="priority"
                rules={[
                  {
                    required: true,
                    message: "Please select your priority!",
                  },
                ]}
              >
                <Radio.Group
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  {plainOptions.map((option) => (
                    <Radio key={option} value={option}>
                      {option}
                    </Radio>
                  ))}
                </Radio.Group>
              </Form.Item>

              <Form.Item
                label="Status"
                name="status"
                rules={[
                  {
                    required: true,
                    message: "Please select your status!",
                  },
                ]}
              >
                <Select value={status} onChange={(value) => setStatus(value)}>
                  <Option value="Completed">Completed</Option>
                  <Option value="Pending">Pending</Option>
                </Select>
              </Form.Item>

              <Form.Item label="Remarks" name="remarks">
                <TextArea
                  maxLength={150}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit">
                  {editingTaskId ? "Update Task" : "Submit Task"}
                </Button>
                <Button
                  type="default"
                  onClick={() => {
                    resetFormStates();
                    form.resetFields();
                  }}
                  className="ms-2"
                >
                  Cancel
                </Button>
              </Form.Item>
            </Form>
          </Col>
        </Row>

        <Container className="m-0 p-0">
          <Row className="row m-0 p-0">
            <Col className="col-12">
              <h3>Task Status Overview</h3>
              {/* Button to toggle the pie chart visibility */}
              <Button type="primary" onClick={() => setShowChart(!showChart)}>
                {showChart ? "Hide Score" : "View Score"}
              </Button>

              {/* Conditionally render the chart based on the state */}
              {showChart && (
                <div style={{ width: "100%", height: 400 }}>
                  <ResponsiveContainer width="100%" height={400}>
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomizedLabel}
                        outerRadius={150}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {chartData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </Col>
          </Row>
        </Container>

        <Container className="container border border-white">
          <Row className="mt-3 row">
            <Col className="col-12 col-lg-6 m-auto">
              <Input.Search
                placeholder="Search tasks..."
                value={searchText}
                onChange={handleSearch}
                enterButton
              />
            </Col>
          </Row>
          <Row className="row mt-2">
            <Col className="col-12">
              <Table
                columns={columns}
                dataSource={filteredTasks}
                rowKey="id"
                pagination={{ pageSize: 6 }}
                size="large"
              />
            </Col>
          </Row>
        </Container>
        <Modal
          title="Task Details"
          open={isModalVisible}
          onCancel={closeModal}
          footer={null}
          className="m-auto"
        >
          {selectedTask && (
            <>
              <p>
                <strong>Task:</strong> {selectedTask.task}
              </p>
              <p>
                <strong>Start Date:</strong>{" "}
                {selectedTask.startDate
                  ? dayjs(selectedTask.startDate).format("DD-MM-YYYY hh:mm A")
                  : "N/A"}
              </p>
              <p>
                <strong>End Date:</strong>{" "}
                {selectedTask.endDate
                  ? dayjs(selectedTask.endDate).format("DD-MM-YYYY hh:mm A")
                  : "N/A"}
              </p>
              <p>
                <strong>Priority:</strong> {selectedTask.priority}
              </p>
              <p>
                <strong>Remarks:</strong> {selectedTask.remarks}
              </p>
              <p>
                <strong>Status:</strong> {selectedTask.status}
              </p>
            </>
          )}
        </Modal>
      </Container>
    </>
  );
}

export default Todo;
