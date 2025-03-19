import React from "react";

const Symphony = () => {
  return (
    <div className="w-[600px] h-[700px]">
      <iframe
        src="https://preview.symphony.com/"
        title="Symphony Chat"
        className="w-full h-full"
        frameBorder="0"
        allowFullScreen
      />
    </div>
  );
};

export default Symphony;