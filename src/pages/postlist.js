import React, { useState, useEffect } from 'react';
import theme from 'theme';
import { Theme, Link as QLink, Text, List, Box, Section, Icon } from '@quarkly/widgets';
import { Helmet } from 'react-helmet';
import { Link, useHistory } from 'react-router-dom';
import './home.css';
import './postlist.css';
import { FaTrash } from 'react-icons/fa';

const PostList = () => {
  const [posts, setPosts] = useState([]);
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
      .then((data) => setPosts(data))
      .catch((error) => console.error('Error fetching posts:', error));
  }, [token]);

  const renderMedia = (post) => {
    console.log(post)
    if (post.file) {
      const fileExtension = post.file.split('.').pop().toLowerCase();
      const supportedImageFormats = ['jpg', 'jpeg', 'png', 'gif'];
      const supportedVideoFormats = ['mp4', 'mov', 'avi', 'webm', 'mpeg2'];

      if (supportedImageFormats.includes(fileExtension)) {
        return <img src={`http://${window.location.hostname}/uploads/${post.file}`} alt="Post" />;
      } else if (supportedVideoFormats.includes(fileExtension)) {
        return (
          <video controls>
            <source src={`http://${window.location.hostname}/uploads/${post.file}`} type="video/mp4" />
          </video>
        );
      } else {
        return <p>Unsupported file format</p>;
      }
    }
    return null;
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('token');
    history.replace('/index');
  };

  const handleDeletePost = async (postid) => {
    console.log('Delete button clicked');
    const response = await fetch(`http://${window.location.hostname}/posts/${postid}`, {
      method: 'DELETE',
      headers: {
        'x-access-token': token,
      },
    });
    console.log('Token:', token);

    if (response.ok) {
      // Remove the deleted post from the posts array
      const updatedPosts = posts.filter((post) => post.id !== postid);
      setPosts(updatedPosts);
      window.location.reload();
    } else {
      console.error('Error deleting post');
    }
  };

  const renderDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  

  return (
    <Theme theme={theme}>
      <Helmet>
        <title>Prev. Notes</title>
        <meta name="description" content="Web site created using quarkly.io" />
        <link rel="shortcut icon" href="http://uploads.quarkly.io/readme/cra/favicon-32x32.ico" type="image/x-icon" />
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
      <Section className="middlesec" padding="80px 0 80px 0" background="url(http://cdn.pixabay.com/photo/2018/11/17/07/10/notebook-3820634_1280.jpg) 0% 0%/cover no-repeat,#EDF2F6" sm-padding="60px 0 60px 0">
        <Box
          width="100%"
          display="flex"
          flex-direction="column"
          md-width="100%"
          md-align-items="center"
          md-justify-content="center"
          md-text-align="center"
          lg-width="100%"
          margin="0px 0px 56px 0px"
          align-items="center"
        >
          <Text margin="0px 0px 16px 0px" font="--headline2" color="--dark" md-text-align="center" sm-font="normal 700 32px/1.2 &quot;Source Sans Pro&quot;, sans-serif" text-align="center">
            Your Memories
          </Text>
          {posts.length === 0 && (
            <React.Fragment>
            <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512" className='imgnone'><path d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zM182.4 382.5c-12.4 5.2-26.5-4.1-21.1-16.4c16-36.6 52.4-62.1 94.8-62.1s78.8 25.6 94.8 62.1c5.4 12.3-8.7 21.6-21.1 16.4c-22.4-9.5-47.4-14.8-73.7-14.8s-51.3 5.3-73.7 14.8zM144.4 208a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm192-32a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/></svg>
            <Text className="labelnone" margin="0px 0px 16px 0px" font="--headline2" md-text-align="center" sm-font="normal 700 32px/1.2 &quot;Source Sans Pro&quot;, sans-serif" text-align="center">
              Nothin Here
            </Text>
            </React.Fragment>
          )}
        </Box>
        <Box display="grid" grid-template-columns="repeat(3, 1fr)" grid-gap="32px 4%" md-grid-template-columns="1fr" filter="brightness(70%)">
          {posts.map((post) => (
            <Box
              padding="30px 45px"
              lg-padding="45px 30px"
              md-padding="45px 45px"
              background="#FFFFFF"
              border-radius="24px"
              justify-content="flex-start"
              flex-direction="column"
              display="flex"
              opacity="0.8"
              hover-opacity="1"
              hover-transform="skew(0deg, 0deg)"
              hover-mix-blend-mode="normal"
              mix-blend-mode="screen"
              md-opacity="1"
              md-mix-blend-mode="normal"
              key={post.id}
              className="post-card"
            >
              <p
                style={{
                  position: 'absolute',
                  top: '12px',
                  color: '#fff',
                  backgroundColor: '#808080',
                  padding: '4px 8px',
                  borderRadius: '4px',
                }}
              >
                {renderDate(post.date)}
              </p>
              <h3 style={{ textAlign: 'left' }}>{post.title}</h3>
              {renderMedia(post)}
              <p>{post.content}</p>
              <button onClick={() => handleDeletePost(post._id)} className="dbtn">
                <Icon category="fa" icon={FaTrash} size="16px" />
              </button>
            </Box>
          ))}
        </Box>
      </Section>
      <Section background-color="--dark" text-align="center" padding="32px 0" quarkly-title="Footer-1">
        <List margin="0px 0px 0px 0px" padding="12px 0px 12px 0px" list-style-type="none" as="ul" display="flex" align-items="center" justify-content="center">
          <Link to="/" className="nl1">
            About
          </Link>
          <Link to="/" className="nl1">
            Services
          </Link>
          <Link to="/" className="nl1">
            Contacts
          </Link>
        </List>
        <QLink href="mailto:hello@company.com" text-decoration-line="none" variant="--base" color="--grey" hover-color="--primary">
          hello@company.com
        </QLink>
      </Section>
    </Theme>
  );
};

export default PostList;
