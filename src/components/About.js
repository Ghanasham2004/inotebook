import React from "react";
const About = () => {
  return (
    <>
      <center><h3 className="mb-4">About Us</h3></center>
      <div className="card">
        <div className="card-header">Welcome to INotebook!</div>
        <div className="card-body">
          <blockquote className="blockquote mb-2">
            <p>
              At INotebook, we are passionate about providing you with the best
              digital note-taking experience. Our mission is to help you stay
              organized, productive, and inspired through our innovative
              notebook application built using cutting-edge technologies like
              React.
            </p>
            <footer className="blockquote-footer mt-2">
              Created by {" "}
              <cite className="Source Title">Ghansham Irashetti</cite>
            </footer>
          </blockquote>
        </div>
      </div>
    </>
  );
};

export default About;
