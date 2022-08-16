import { Button } from "@mui/material";
import axios from "axios";
import React, { useState, useEffect } from "react";

interface Tasksboard {
  id: number;
  boardTitle: string;
}

const MainFooter = () => {
  const [tasksboards, setTasksboards] = useState<Tasksboard[] | never[]>([]);

  useEffect(() => {
    const fetchAllTasksboards = async () => {
      const response = await axios.get("http://localhost:5000/api/tasksboards");
      if (response.status === 200) {
        console.log(response.data);
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
