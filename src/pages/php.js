import React, { useState, useEffect } from "react";
import theme from "theme";
import { Theme, Link as QLink, Text, List, Box, Section } from "@quarkly/widgets";
import { Helmet } from "react-helmet";
import { GlobalQuarklyPageStyles } from "global-page-styles";
import { RawHtml } from "@quarkly/components";
import { Link, useHistory } from "react-router-dom";
import "./php.css";

export default (() => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const history = useHistory();
  const token = localStorage.getItem('token') || '';

  useEffect(() => {
    fetch(`http://${window.location.hostname}/posts`, {
      headers: {
        'x-access-token': token,
      },
    })
      .then((response) => response.json())
  }, [token]);

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('token');
    history.replace('/index');
  };

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const [date, setDate] = useState('');
  console.log(date)

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'title') {
      setTitle(value);
    } else if (name === 'content') {
      setContent(value);
    } else if (name === 'file') {
      setFile(files[0]);
    } else if (name === 'date') {
      setDate(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('file', file);
    formData.append('date', date);

    const token = localStorage.getItem('token')

    const response = await fetch(`http://${window.location.hostname}/posts`, {
      method: 'POST',
      body: formData,
      headers: {
        'x-access-token': token,
      },
    });

    if (response.ok) {
      setTitle('');
      setContent('');
      setFile(null);
      setDate('');
      history.replace('/cards')
    } else {
      console.error('Error saving post');
    }
  };



  return (
    <Theme theme={theme}>
      <GlobalQuarklyPageStyles pageUrl={"index"} />
      <Helmet>
        <title>Create</title>
        <meta name={"description"} content={"Web site created using quarkly.io"} />
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
      <Section padding="100px 0 100px 0" background="url(http://cdn.pixabay.com/photo/2018/11/17/07/10/notebook-3820634_1280.jpg) 0% 0%/cover no-repeat,#EDF2F6" sm-padding="60px 0 60px 0">
        <Box display="flex" justify-content="center">
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <Box
              display="flex"
              flex-direction="column"
              padding="40px"
              border-radius="8px"
              width="500px"
              className="frmbox"
            >
              <label className="head1">Note</label>
              <div className="bod">
                <div>
                  <label className="date">Date:</label>
                  <input
                    type="date"
                    name="date"
                    value={date}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className="title">Title:</label>
                  <input
                    className="title1"
                    type="text"
                    name="title"
                    value={title}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <textarea
                    name="content"
                    value={content}
                    onChange={handleChange}
                  />
                </div>
                <div className="divfile">
                  <label className="file">File:</label>
                  <input
                    type="file"
                    name="file"
                    onChange={handleChange}
                  />
                  <p>(1 Image per Note)</p>
                </div>
              </div>
              <button
                type="submit"
                className="btn"
                value="Login"
              >
                Create
              </button>
            </Box>
          </form>
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
    </Theme>
  );
});
