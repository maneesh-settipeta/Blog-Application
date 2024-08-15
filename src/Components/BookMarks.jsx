import { useContext } from "react";
import BlogContext from "../Store/StoreInput";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import fetchUserDetails from "../fetchUserDetails";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "../firebase";
import BlogReplyInput from "./BlogReplyInput";
import ReplyDiscription from "./ReplyDiscription";
import { IoBookmark } from "react-icons/io5";
import { FaRegBookmark } from "react-icons/fa";

const BookMarks = ({ sendBlogsData }) => {
  const { user, blogs, setUser } = useContext(BlogContext);

  const [currentState, setCurrentState] = useState({
    showInputField: null,
    blogReplies: null,
    showReplies: false,
    uniqueID: 0,
    toggleInput: false,
    sendBlogRepliesButtonStatus: false,
  });
  const [isBookMarkSaved, setBookMark] = useState([]);

  const fetchUserSavedBlogs = async () => {
    try {
      const response = await fetchUserDetails();
      const userSavedBookMarks = response.blogSaved;
      setBookMark(userSavedBookMarks);
      setUser(response);
    } catch (error) {
      console.error("Error fetching user saved blogs", error);
    }
  };

  useEffect(() => {
    fetchUserSavedBlogs();
  }, []);

  const handleShowInput = (id) => {
    setCurrentState((prevState) => ({
      ...prevState,
      showInputField: id,
    }));
  };

  const handleCancelButton = (blogID) => {
    setCurrentState((prevState) => {
      if (prevState.showInputField === blogID) {
        return {
          ...prevState,
          showInputField: null,
        };
      }
      return prevState;
    });
  };
  const handleShowReplies = (blogID) => {
    setCurrentState((prevState) => ({
      ...prevState,
      blogReplies: blogID,
      sendBlogRepliesButtonStatus: !prevState.sendBlogRepliesButtonStatus,
    }));
  };

  const handleReplyClick = () => {
    setCurrentState((prevState) => ({
      ...prevState,
      showReplies: !prevState.showReplies,
    }));
  };
  const handleSendFollow = async (firstName, lastName, id) => {
    const userFollowing = {
      firstName,
      lastName,
      id,
    };
    try {
      const userDocRef = doc(db, "users", user.id);
      await updateDoc(userDocRef, {
        following: arrayUnion(userFollowing),
      });
    } catch (error) {
      console.error("Error Uploading");
    }
  };
  function handleShowRepliesLength(blogID) {
    const findBlogForReplyLength = blogs.find((blog) => blog.id === blogID);
    const lengthOfReplies = findBlogForReplyLength.replies.length;
    return lengthOfReplies;
  }

  function isFollowing(blog) {
    return user.following?.some(
      (followedUser) =>
        followedUser.firstName.toLowerCase() === blog.firstName.toLowerCase() &&
        followedUser.lastName.toLowerCase() === blog.lastName.toLowerCase()
    );
  }
  const handleSaveBookmarkBlog = async (blog) => {
    try {
      const isAlreadySaved = isBookMarkSaved.includes(blog.id);
      const userDocRef = doc(db, "users", user.id);
      if (isAlreadySaved) {
        setBookMark((prevState) => prevState.filter((id) => id !== blog.id));

        await updateDoc(userDocRef, {
          savedBlogs: arrayRemove(blog),
          blogSaved: arrayRemove(blog.id),
        });
      } else {
        setBookMark((prevState) => [...prevState, blog.id]);
        await updateDoc(userDocRef, {
          savedBlogs: arrayUnion(blog),
          blogSaved: arrayUnion(blog.id),
        });
      }
    } catch (error) {
      console.error("Error Uploading");
    }
  };

  return (
    <>
      <h1 className="text-4xl text-customColor underline mb-6 font-bold justify-center text-center mt-2">
        {" "}
        My Book-Marks
      </h1>
      <div className="flex flex-col items-center">
        {user?.savedBlogs &&
          user?.savedBlogs?.map((blog) => {
            return (
              <div
                className="w-1/2 h-auto    mb-2 mt-2 rounded-md bg-gray-100  shadow-customColorbeige shadow-md  p-4"
                key={blog?.blogID + blog?.firstName + blog?.dateCreated}
              >
                <Link to={`/blogs/${blog.id}`} state={{ blogid: blog.id }}>
                  <h1 className="pl-4 font-serif text-3xl p-2 ">
                    {blog?.userTitle}
                  </h1>
                  <p className="pl-4 line-clamp-5 text-ellipsis ">
                    {blog?.userinput}
                  </p>
                </Link>
                <div className="flex justify-between">
                  <div>
                    <p>
                      <button
                        className="font-sans text-lg mb-3 text-white bg-customcolorred p-2 rounded-md ml-4  mt-4 font-semibold "
                        onClick={() => handleShowInput(blog?.id)}
                      >
                        {" "}
                        Reply
                      </button>
                    </p>
                  </div>
                  <div>
                    <div className="flex justify-end">
                      <p className=" p-1 text-lg mt-2  font-medium text-customcolorred">
                        {blog.firstName + " " + blog.lastName}
                      </p>
                      <button
                        onClick={() =>
                          handleSendFollow(
                            blog.firstName,
                            blog.lastName,
                            blog.id
                          )
                        }
                        className=" mt-2 corde text-lg ml-2 font-sans text-green-500"
                      >
                        {" "}
                        {isFollowing(blog) ? "Following" : "Follow"}
                      </button>
                    </div>
                    <p className="flex justify-end p-1 text-base font-medium text-customColor">
                      Created on: {blog?.dateCreated}
                    </p>
                  </div>
                </div>
                {currentState.showInputField === blog.id && (
                  <BlogReplyInput
                    id={blog.id}
                    sendFirebaseId={blog.id}
                    sendOnClick={handleCancelButton}
                    replyOnClick={handleReplyClick}
                  />
                )}
                <div className="flex justify-between">
                  <p>
                    <button
                      className="font-sans text-lg  text-black p-1  underline rounded-md ml-3 mb-2  mt-1 font-semibold "
                      onClick={() => handleShowReplies(blog.id)}
                    >
                      Replies({handleShowRepliesLength(blog.id)})
                    </button>
                  </p>
                  {isBookMarkSaved.includes(blog.id) ? (
                    <button
                      className="mt-5 size-5"
                      onClick={() => handleSaveBookmarkBlog(blog)}
                    >
                      <IoBookmark />
                    </button>
                  ) : (
                    <button
                      className="mt-5 size-5"
                      onClick={() => handleSaveBookmarkBlog(blog)}
                    >
                      {" "}
                      <FaRegBookmark />
                    </button>
                  )}
                </div>
                {currentState.sendBlogRepliesButtonStatus &&
                  currentState.blogReplies === blog.id && (
                    <ReplyDiscription
                      sendId={blog.id}
                      sendBlogRepliesButtonStatus={
                        currentState.sendBlogRepliesButtonStatus
                      }
                    />
                  )}
              </div>
            );
          })}
      </div>
    </>
  );
};
export default BookMarks;
