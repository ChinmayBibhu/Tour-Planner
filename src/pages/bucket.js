import React, { useState,useEffect } from "react";
import theme from "theme";
import { Theme, Link as QLink, Text, List, Box, Section, Icon } from "@quarkly/widgets";
import { Helmet } from "react-helmet";
import { GlobalQuarklyPageStyles } from "global-page-styles";
import { RawHtml } from "@quarkly/components";
import { FaPen, FaClipboardList, FaTrash } from "react-icons/fa";
import {Link,useHistory } from "react-router-dom";
import "./home.css";
import "./stt.css";

export default (() => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const history = useHistory();

  useEffect(() => {
    // Fetch tasks from the server
    fetchTasks();
  }, []);
  const token = localStorage.getItem('token') || '';

  const fetchTasks = async () => {
    try {
      const response = await fetch(`http://${window.location.hostname}/tasks`,{
        headers: {
            'x-access-token': token,
          },
      });
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.log('Error fetching tasks:', error);
    }
  };

  const addTask = async () => {
    if (newTask.trim() === '') return;

    try {
      const response = await fetch(`http://${window.location.hostname}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token':token,
        },
        body: JSON.stringify({ task: newTask }),
      });

      if (response.ok) {
        const data = await response.json();
        setTasks([...tasks, data]);
        setNewTask('');
      }
    } catch (error) {
      console.log('Error adding task:', error);
    }
  };

  const removeTask = async (taskId) => {
    try {
      const response = await fetch(`http://${window.location.hostname}/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
            'x-access-token': token, // Include the token in the request headers
          },
      });

      if (response.ok) {
        setTasks(tasks.filter((task) => task._id !== taskId));
      }
    } catch (error) {
      console.log('Error removing task:', error);
    }
  };

  const updateTask = async (taskId, newTaskName) => {
    try {
      const response = await fetch(`http://${window.location.hostname}/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token,
        },
        body: JSON.stringify({ task: newTaskName }),
      });

      if (response.ok) {
        const updatedTask = { _id: taskId, task: newTaskName };
        setTasks(tasks.map((task) => (task._id === taskId ? updatedTask : task)));
      }
    } catch (error) {
      console.log('Error updating task:', error);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('token');
    history.replace('/index');
  };

	return <Theme theme={theme}>
		<GlobalQuarklyPageStyles pageUrl={"index"} />
		<Helmet>
			<title>
				HomePage - JJ
			</title>
			<link rel={"shortcut icon"} href={"http://uploads.quarkly.io/readme/cra/favicon-32x32.ico"} type={"image/x-icon"} />
		</Helmet>
		<Section padding="0px 0 0px 0">
			<Box
				display="flex"
				padding="12px 0"
				justify-content="space-between"
				align-items="center"
				flex-direction="row"
				md-flex-direction="column"
			>
				<Text margin="0" md-margin="0px 0 20px 0" text-align="left" font="normal 900 50px/1.5 --fontFamily-googleTeko">
					Journey Diaries
				</Text>
				<Link to="#" color="#000000" />
				<List
            margin="0px 0px 0px 0px"
            padding="0px 0px 0px 20px"
            as="ul"
            list-style-type="none"
            flex="0 1 auto"
            order="1"
            display="flex"
          >
            <Link to="/home" className="nl">
              Home
            </Link>
            <Link to="/bucket" className="nl">
              Bucket
            </Link>
            <Link to="/make" className="nl">
              Create
            </Link>
            <Link to="/cards" className="nl">
              Prev. Notes
            </Link>
            <Link to="/" className="navbtn" onClick={handleLogout}>
              Logout
            </Link>
          </List>
			</Box>
		</Section>
		<Section padding="100px 0 100px 0" background="url(http://cdn.pixabay.com/photo/2018/11/17/07/10/notebook-3820634_1280.jpg) 0% 0%/cover no-repeat,#EDF2F6" sm-padding="60px 0 60px 0" className="sec2">
			<Box grid-template-columns="repeat(3, 1fr)" grid-gap="32px 4%" md-grid-template-columns="1fr" filter="brightness(80%)" display="flex"
          justify-content="center"
          align-items="center"
          height="100%">
                <Box
					padding="45px 45px"
					lg-padding="45px 30px"
					md-padding="45px 45px"
					background="#FFFFFF"
					border-radius="24px"
					flex-direction="column"
					display="flex"
					opacity="1"
					mix-blend-mode="screen"
					hover-opacity="1"
					hover-mix-blend-mode="normal"
					md-opacity="1"
					md-mix-blend-mode="normal"
          className="box1"
          align-items="center"
				>
					<Icon
						category="fa"
						icon={FaClipboardList}
						margin="0px 0px 30px 0px"
						color="--dark"
						size="48px"
					/>
					<Text margin="0px 0px 18px 0px" color="--darkL2" font="--headline3" lg-text-align="left">
						Bucket List
					</Text>
          <div>
          <label className="l1">Task: </label>
          <input type="text" value={newTask} onChange={(e) => setNewTask(e.target.value)} />
          </div>
          <button onClick={addTask} className="btn">Add Task</button>
          <div className="d1">
    <ul className="ulist">
      {tasks.map((task,index) => (
        <li key={task._id} className="task-item">
          <div className="task-content" data-index={index + 1}>
        {task.task}
      </div>
          <div className="task-buttons">
            <FaPen onClick={() => updateTask(task._id, prompt('Enter new task name'))} className="upd"/>
            <FaTrash onClick={() => removeTask(task._id)} className="del"/>
          </div>
        </li>
      ))}
    </ul>
  </div>
				</Box>
			</Box>
		</Section>
		<Section background-color="--dark" text-align="center" padding="32px 0" quarkly-title="Footer-1">
			<List
				margin="0px 0px 0px 0px"
				padding="12px 0px 12px 0px"
				list-style-type="none"
				as="ul"
				display="flex"
				align-items="center"
				justify-content="center"
			>
				<Link
					to="/"
					className="nl1"
				>
					About
				</Link>
				<Link
					to="/"
					className="nl1"
				>
					Services
				</Link>
				<Link
					to="/"
					className="nl1"
				>
					Contacts
				</Link>
			</List>
			<QLink
				href="mailto:hello@company.com"
				text-decoration-line="none"
				variant="--base"
				color="--grey"
				hover-color="--primary"
			>
				hello@company.com
			</QLink>
		</Section>
		<RawHtml>
			<style place={"endOfHead"} rawKey={"64948d1991dc65001840fab9"}>
				{":root {\n  box-sizing: border-box;\n}\n\n* {\n  box-sizing: inherit;\n}"}
			</style>
		</RawHtml>
	</Theme>;
});
