import React, { useState } from "react";
import CreateProfile from "./CreateProfile.js";
import CreateTask from "./CreateTask.js";

const Taggerlist = () => {
    const [taggers, setTaggers] = useState([]);

    const handleAddTagger = (newTagger) => {
        setTaggers(prevTaggers => [...prevTaggers, newTagger]);
        console.log("new tagger is: ", taggers)
    };

    return (
        <div>
            <CreateProfile onAddTagger={handleAddTagger} />
            <CreateTask taggers={taggers} />
        </div>
    );
};

export default Taggerlist;

