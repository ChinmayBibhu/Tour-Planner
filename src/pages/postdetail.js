import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const PostDetail = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const token = localStorage.getItem('token')

  useEffect(() => {
    // Fetch the post data based on the postId
    fetch(`http://${window.location.hostname}/posts/${postId}`, {
      headers: {
        'x-access-token': token,
      },
    })
      .then((response) => response.json())
      .then((data) => setPost(data))
      .catch((error) => console.error('Error fetching post:', error));
  }, [postId, token]);

  if (!post) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>{post.title}</h1>
      {/* Display the full content of the post */}
      <p>{post.content}</p>
      <p>Date: {post.date}</p>
    </div>
  );
};

export default PostDetail;
