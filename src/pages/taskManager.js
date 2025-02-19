import React from "react";
import { HTML5Backend } from "react-dnd-html5-backend";
import GlobalStyle from '../styles/global'
import { DndProvider } from "react-dnd";
import Dashboard from '../dashboard';

function TaskManager() {
  return (
    <DndProvider backend={HTML5Backend}>
      <GlobalStyle/>
      <Dashboard />
    </DndProvider>
  );
}
export default TaskManager;