import { Button } from "@mui/material";
import axios from "axios";
import { useState, useEffect } from "react";
import { useGlobalContext } from "../context/appContext";
import { globalContextInterface, Tasksboard } from "../interfaces/interfaces";

const MainFooter = () => {
  const [tasksboards, setTasksboards] = useState<Tasksboard[] | never[]>([]);
  const context: globalContextInterface = useGlobalContext();
  console.log(context.activeTasksboardId);

  useEffect(() => {
    const fetchAllTasksboards = async () => {
      const response = await axios.get("http://localhost:5000/api/tasksboards");
      if (response.status === 200) {
        // console.log(response.data);
        setTasksboards(response.data);
      }
    };
    fetchAllTasksboards();
  }, []);

  return (
    <div id="main-footer">
      {tasksboards.map((tasksboard, index) => {
        return (
          <Button key={tasksboard.id} variant="contained" color="secondary">
            {tasksboard.boardTitle}
          </Button>
        );
      })}
    </div>
  );
};

export default MainFooter;
