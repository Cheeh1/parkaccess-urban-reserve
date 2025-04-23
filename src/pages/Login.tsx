
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import LoginForm from "@/components/auth/LoginForm";

const Login = () => (
  <MainLayout>
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <LoginForm />
    </div>
  </MainLayout>
);

export default Login;
