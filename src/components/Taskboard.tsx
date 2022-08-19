import axios from "axios";
import { useEffect, useState } from "react";
import { useGlobalContext } from "../context/appContext";
import { TaskcardInterface } from "../interfaces/interfaces";
import Taskcard from "./Taskcard";

const Taskboard = () => {
  const { globalState } = useGlobalContext();
  const { activeTasksboardId } = globalState;

  const [taskcards, setTaskcards] = useState<TaskcardInterface[]>();

  const fetchAllTaskscards = async () => {
    const url = `${process.env.REACT_APP_BASE_URL}/taskCards/${activeTasksboardId}`;
    const getResponse = await axios.get(url);
    const responseData: TaskcardInterface[] = getResponse.data;

    if (getResponse.status === 200) {
      // If there are no taskcards in the database, create a taskcard and set the state.
      if (responseData.length === 0) {
        const postResponse = await axios.post(url);
        const defaultList: TaskcardInterface = postResponse.data;
        setTaskcards([defaultList]);
      } else {
        setTaskcards(responseData);
      }
    }
  };

  useEffect(() => {
    fetchAllTaskscards();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTasksboardId]);

  return (
    <div id="taskboard">
      {taskcards?.map((taskcard) => {
        return <Taskcard key={taskcard.id} taskcard={taskcard}></Taskcard>;
      })}
    </div>
  );
};

export default Taskboard;
