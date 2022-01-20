import React from "react";

export default function Footer() {
  let footerStlye = {
    position: "relative",
    bottom: "0px",
    left: "0px",
    right: "0px",
  };
  return (
    <footer
      className="bg-success text-light text-center p-4 rounded fs-4"
      style={footerStlye}
    >
      Copyright&copy;vishalSAP.com
    </footer>
  );
}

/*
border border-5 border-danger
*/
