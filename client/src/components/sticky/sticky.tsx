import React from "react";
import useSticky from "../../hooks/useSticky";

// Main App Component
const Sticky = () => {
  // Using the `useSticky` hook with a sticky height of 100px
  const { isSticky } = useSticky({ STICKY_HEIGHT:70 });

  return (
    <div>
      {/* Header Section */}
      <header
        className={`header ${isSticky ? "sticky" : ""}`}
      >
        <h1>My Sticky Header</h1>
      </header>

      {/* Content Section */}
      <main>
        <div className="content">
          {/* Adding a lot of content to make the page scrollable */}
          <p>Scroll down to see the sticky header effect!</p>
          <div style={{ height: "1500px" }}>
            <p>Keep scrolling...</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer>
        <p>Footer Content</p>
      </footer>
    </div>
  );
};

export default Sticky;
