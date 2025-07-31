import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import axios from "axios";
import { setUser } from "../redux/features/auth/authSlice";
import { Navigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "./shared/Spinner";

const PrivateRoute = ({ children, allowedRoles = [] }) => {
  const { user } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
  const dispatch = useDispatch();
  const location = useLocation();

  // DEBUG: Log user role and allowed roles
  useEffect(() => {
    console.log("🔐 PrivateRoute Debug:", {
      currentPath: location.pathname,
      userRole: user?.role,
      allowedRoles,
      userObject: user,
      hasToken: !!localStorage.getItem("token")
    });
  }, [user, allowedRoles, location.pathname]);

  const getUser = async () => {
    try {
      dispatch(showLoading());
      const { data } = await axios.post(
        "/api/v1/user/getUser",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (data.success) {
        dispatch(setUser(data.data));
        setIsAuthenticated(true);
        console.log("✅ User fetched successfully:", data.data);
      } else {
        localStorage.clear();
        setIsAuthenticated(false);
        console.log("❌ Failed to fetch user:", data.message);
      }
    } catch (error) {
      console.error('❌ Error fetching user:', error);
      localStorage.clear();
      dispatch(hideLoading());
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!user && localStorage.getItem("token")) {
      getUser();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  if (isLoading) return <Spinner />;

  // Check authentication first
  if (!isAuthenticated) {
    console.log("🚫 Not authenticated, redirecting to login");
    return <Navigate to="/login" />;
  }

  // Check role permissions
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    console.log("🚫 Access denied:", {
      userRole: user?.role,
      allowedRoles,
      path: location.pathname
    });
    
    toast.error(`Access denied. Required role: ${allowedRoles.join(" or ")}`);
    return <Navigate to="/dashboard" />;
  }

  console.log("✅ Access granted:", {
    userRole: user?.role,
    allowedRoles,
    path: location.pathname
  });

  return children;
};

export default PrivateRoute;