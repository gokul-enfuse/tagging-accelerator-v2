import React, { useState } from "react";
import CreateProfile from "./CreateProfile.js";
import CreateTask from "./CreateTask.js";

const Taggerlist = () => {
    const [taggers, setTaggers] = useState([]);

    const handleAddTagger = (newTagger) => {
        setTaggers(prevTaggers => [...prevTaggers, newTagger]);
    };

    return (
        <div>
            <CreateProfile onAddTagger={handleAddTagger} />
            <CreateTask taggers={taggers} />
        </div>
    );
};

export default Taggerlist;

