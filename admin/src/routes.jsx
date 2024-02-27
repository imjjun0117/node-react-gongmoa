import { Home, Profile, Tables, Notifications, AdminMenu } from "@/pages/dashboard";
import { SignIn } from "@/pages/auth";
import React from 'react';

export const component = (element, fetchRoutes) => {

  element = element.replaceAll('<','').replaceAll('/>','');

  const SpecificStory = eval(element);


  return <SpecificStory fetchRoutes={() => fetchRoutes()}/>

}

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    title: "auth pages",
    layout: "auth",
    pages: [
      {
        name: "로그인",
        path: "/login",
        element: <SignIn />,
      }
    ],
  },
];

// export default routes;
