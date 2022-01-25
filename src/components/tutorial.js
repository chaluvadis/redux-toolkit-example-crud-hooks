import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateTutorial, deleteTutorial } from "../slices/tutorials";
import TutorialDataService from "../services/tutorial";

const Tutorial = (props) => {
  const initialTutorialState = {
    id: null,
    title: "",
    description: "",
    published: false
  };
  const [currentTutorial, setCurrentTutorial] = useState(initialTutorialState);
  const [message, setMessage] = useState("");

  const dispatch = useDispatch();

  const getTutorial = async (id) => {
    try {
      const response = await TutorialDataService.get(id);
      if (response.isSuccess) {
        const { data } = response;
        setCurrentTutorial(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getTutorial(props.match.params.id);
  }, [props.match.params.id]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCurrentTutorial({ ...currentTutorial, [name]: value });
  };

  const updateStatus = async (status) => {
    try {
      const data = {
        id: currentTutorial.id,
        title: currentTutorial.title,
        description: currentTutorial.description,
        published: status
      };
      const tempTutorial = { id: currentTutorial.id, data };
      const response = await dispatch(updateTutorial(tempTutorial)).unwrap();
      console.log(response);
      if (response.isSuccess) {
        setCurrentTutorial({ ...currentTutorial, published: status });
        setMessage("The status was updated successfully!");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const updateContent = async () => {
    try {
      const updateContent = { id: currentTutorial.id, data: currentTutorial };
      const response = await dispatch(updateTutorial(updateContent)).unwrap();
      if (response.isSuccess) {
        setMessage("The tutorial was updated successfully!");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const removeTutorial = async () => {
    try {
      const removeTutorial = { id: currentTutorial.id };
      const response = await dispatch(deleteTutorial(removeTutorial)).unwrap();
      if (response.isSuccess) {
        props.history.push("/tutorials");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      {currentTutorial ? (
        <div className="edit-form">
          <h4>Tutorial</h4>
          <form>
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                className="form-control"
                id="title"
                name="title"
                value={currentTutorial.title}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <input
                type="text"
                className="form-control"
                id="description"
                name="description"
                value={currentTutorial.description}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>
                <strong>Status:</strong>
              </label>
              {currentTutorial.published ? "Published" : "Pending"}
            </div>
          </form>

          {currentTutorial.published ? (
            <button
              className="badge badge-primary mr-2"
              onClick={() => updateStatus(false)}
            >
              UnPublish
            </button>
          ) : (
            <button
              className="badge badge-primary mr-2"
              onClick={() => updateStatus(true)}
            >
              Publish
            </button>
          )}

          <button className="badge badge-danger mr-2" onClick={removeTutorial}>
            Delete
          </button>

          <button
            type="submit"
            className="badge badge-success"
            onClick={updateContent}
          >
            Update
          </button>
          <p>{message}</p>
        </div>
      ) : (
        <div>
          <br />
          <p>Please click on a Tutorial...</p>
        </div>
      )}
    </div>
  );
};
Tutorial.displayName = 'Tutorial';
export default Tutorial;
