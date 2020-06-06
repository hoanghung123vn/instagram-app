import React, { useState } from "react";
import PostContext from "../contexts/PostContext";

export default function PostProvider(props) {
  const [posts, setPosts] = useState([]);
  return (
    <PostContext.Provider value={{ posts, setPosts }}>
      {props.children}
    </PostContext.Provider>
  );
}
