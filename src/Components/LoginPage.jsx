import { signInWithEmailAndPassword } from "firebase/auth";
import { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
// import { doc, getDoc } from "firebase/firestore";
// import { db } from "../firebase";
// import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BlogContext from "../Store/StoreInput";
import { useContext } from "react";
import useFetchUserData from "../useFetchUserData";

function LoginPage() {
  const { setUser } = useContext(BlogContext);
  const { userData } = useFetchUserData();
  const userId = useRef("maneeshsettipeta@gmail.com");
  const userPassword = useRef("Maneesh@123");
  const navigate = useNavigate();

  async function handleUserLogin() {
    const email = userId.current.value;
    const password = userPassword.current.value;

    try {
      await signInWithEmailAndPassword(auth, email, password);

      if (userData) {
        setUser(userData);

        navigate("/blogs");
      }
    } catch (error) {
      console.error("Invalid Credentials");
    }
  }

  return (
    <div className="bg-customColor h-screen flex items-center justify-center p-4 ">
      <div className="bg-[#f7f7f7] p-7 rounded-md border  xs:w-fit xs:h-fit w-1/4 sm:w-fit h-1/2 lg:w-96">
        <h1 className="text-xl font-bold flex justify-center">Login</h1>
        <div>
          <p className="flex flex-col py-2">
            <label className="text-2xl font-medium text-customColor">
              {" "}
              Email
            </label>
            <input
              className="max-h-full p-3 border outline-none rounded-md"
              ref={userId}
              placeholder="Please Enter your ID"
            ></input>
          </p>
        </div>
        <div>
          <p className="flex flex-col py-2">
            <label className="text-2xl font-medium text-customColor">
              Password
            </label>
            <input
              type="password"
              className="max-h-full p-3 border outline-none rounded-md"
              ref={userPassword}
              placeholder="Please Enter Password"
            ></input>
          </p>
        </div>
        <div className="flex justify-end">
          <button
            className="bg-customcolorred p-2 text-white/80 text-lg mt-5 hover:font-medium outline-none rounded-md hover:text-black hover:shadow-[0_4px_10px_rgba(0,0,0,0.25)] transition-all duration-300 ease-in-out"
            onClick={handleUserLogin}
          >
            Sign-In
          </button>
        </div>
        <div className="flex justify-center mt-5">
          <Link to="/SignUp">
            <button className="text-base mt-2 font-medium text-customColor  underline">
              Dont have an Account? Sign-Up Here
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
