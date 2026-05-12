import React, { useState } from "react";
import { addWebsite } from "../services/api";

function AddWebsite() {
  const [url, setUrl] = useState("");

  const handleSubmit = async () => {
    if (!url) return;

    await addWebsite(url);
    alert("Website added successfully ✅");
    setUrl("");
  };

  return (
    <div>
      <h2>Add Website</h2>

      <input
        placeholder="Enter website URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />

      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}

export default AddWebsite;