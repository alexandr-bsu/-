import React from "react";
import { useEffect, useState } from "react";
import Form from "./components/Form";

const App = () => {
  return (
    <div className="bg-dark-green h-screen w-screen overflow-y-hidden">
      <Form maxTabsCount={8}></Form>;
    </div>
  );
};

export default App;
