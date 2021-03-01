import Head from "next/head";

import React from "react";
import PageWithLayoutType from "@/types/pageWithLayout";

import Default from "@/layouts/default";

const Login: React.FC = () => {
  return <p>Login Page</p>;
};

(Login as PageWithLayoutType).layout = Default;

export default Login;
