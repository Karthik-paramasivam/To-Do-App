import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore"; // Import dayjs plugin
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import { Button, Form, Input, Radio, message, Table, Modal, Select } from "antd";
import { DatePicker } from "antd";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTasks, faCheck, faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import "./App.css";

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

  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      const tasks = JSON.parse(storedTasks);
 
      setTasksList(JSON.parse(storedTasks));
      setFilteredTasks(tasks);


    }
  }, []);

  const updateLocalStorage = (tasks) => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  };

  const styl = `
  .ant-modal .ant-modal-title {
    margin: 0;
    color: rgba(0, 0, 0, 0.88);
    font-weight: 600;
    line-height: 1.5;
    word-wrap: break-word;
    text-align: center;
    font-size: 18px;
}`

  const onFinish = () => {
    const newTask = {
      id: tasksList.length + 1,
      task,
      startDate: startDate ? startDate.toISOString() : null,
      endDate: endDate ? endDate.toISOString() : null,
      priority,
      remarks,
      status,
    };

    const updatedTasksList = [...tasksList, newTask];
    setTasksList(updatedTasksList);
    setFilteredTasks(updatedTasksList);
    updateLocalStorage(updatedTasksList);
    form.resetFields();
    resetFormStates();
    message.success("Task added successfully!");
  };

  const onUpdate = () => {
    const updatedTasksList = tasksList.map((t) =>
      t.id === editingTaskId
        ? { ...t, task, startDate: startDate ? startDate.toISOString() : null, endDate: endDate ? endDate.toISOString() : null, priority, remarks, status }
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
        return;
      }
      setStartDate(dayjsDate);
    } else {
      message.error("Invalid start date.");
    }
  };
  
  const handleEndDateChange = (date) => {
    const dayjsDate = dayjs(date);
    if (dayjsDate.isValid()) {
      if (startDate && dayjsDate.isBefore(startDate)) {
        message.error("End date cannot be before start date.");
        return;
      }
      setEndDate(dayjsDate);
    } else {
      message.error("Invalid end date.");
    }
  };
  
  const handleRowClick = (record) => {
    setSelectedTask(record);
    setIsModalVisible(true);
  };

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
        <span style={{ color: status === "Completed" ? "green" : "red" }}>
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
            <Button onClick={() => markComplete(record.id)} className="me-2 mt-1">
              <FontAwesomeIcon icon={faCheck} className="text-success"/>
            </Button>
          )}
          <Button onClick={() => editTask(record.id)} className="me-2 mt-1">
            <FontAwesomeIcon icon={faPenToSquare} className="text-warning"/>
          </Button>
          <Button onClick={() => deleteTask(record.id)} className="mt-1">
            <FontAwesomeIcon icon={faTrash} className="text-danger"/>
          </Button>
        </>
      ),
    },
  ];

  return (
    <>
      <Container className="container border border-white backImage">
        <style>{styl}</style>
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
                <Radio.Group value={priority} onChange={e => setPriority(e.target.value)}>
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
                <Select
                  value={status}
                  onChange={(value) => setStatus(value)}
                >
                  <Option value="Pending">Pending</Option>
                  <Option value="Completed">Completed</Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="Remarks"
                name="remarks"
              >
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
          <Row className="row mt-5">
            <Col className="col-12">
              <Table
                columns={columns}
                dataSource={filteredTasks}
                rowKey="id"
                pagination={{ pageSize: 10 }}
                size="large"
              />
            </Col>
          </Row>
        </Container>
        <Modal title="Task Details" visible={isModalVisible} onCancel={closeModal} footer={null} className="m-auto">
          {selectedTask && (
            <>
              <p><strong>Task:</strong> {selectedTask.task}</p>
              <p><strong>Start Date:</strong> {selectedTask.startDate ? dayjs(selectedTask.startDate).format("YYYY-MM-DD") : "N/A"}</p>
              <p><strong>End Date:</strong> {selectedTask.endDate ? dayjs(selectedTask.endDate).format("YYYY-MM-DD") : "N/A"}</p>
              <p><strong>Priority:</strong> {selectedTask.priority}</p>
              <p><strong>Remarks:</strong> {selectedTask.remarks}</p>
              <p><strong>Status:</strong> {selectedTask.status}</p>
            </>
          )}
        </Modal>
      </Container>
    </>
  );
}

export default Todo;

