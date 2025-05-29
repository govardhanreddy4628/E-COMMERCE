import React from "react";
import { Button, Box } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";


export interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    onPreviousPage: () => void;
    onNextPage: () => void;
  }
  

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  onPreviousPage,
  onNextPage,
}) => {
 

  // Function to render the page numbers with logic for ellipsis
  const renderPagination = () => {
    const pageNumbers = [];
    const maxVisiblePages = 3;  // Maximum visible page numbers before ellipsis

    if (totalPages <= maxVisiblePages * 2 + 2) {
      // Show all page numbers if total pages are small
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(
          <Button
            key={i}
            onClick={() => onPageChange(i)}
            disabled={i === currentPage}
          >
            {i}
          </Button>
        );
      }
    } else {
      // Display first few pages, current page with ellipsis, and last few pages
      for (let i = 1; i <= maxVisiblePages; i++) {
        pageNumbers.push(
          <Button
            key={i}
            onClick={() => onPageChange(i)}
            disabled={i === currentPage}
          >
            {i}
          </Button>
        );
      }

      if (currentPage > maxVisiblePages + 1) {
        pageNumbers.push(<span key="ellipsis1">...</span>);
      }

      if (currentPage > maxVisiblePages && currentPage <= totalPages - maxVisiblePages) {
        pageNumbers.push(
          <Button
            key={currentPage}
            onClick={() => onPageChange(currentPage)}
            disabled={true}
          >
            {currentPage}
          </Button>
        );
      }

      if (currentPage < totalPages - maxVisiblePages) {
        pageNumbers.push(<span key="ellipsis2">...</span>);
      }

      for (let i = totalPages - maxVisiblePages + 1; i <= totalPages; i++) {
        pageNumbers.push(
          <Button
            key={i}
            onClick={() => onPageChange(i)}
            disabled={i === currentPage}
          >
            {i}
          </Button>
        );
      }
    }

    return pageNumbers;
  };
  

  return (
    <Box sx={{display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 4}}>
      {/* Previous Page Button */}
      <Button
        color="info"
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        disabled={currentPage === 1}
        onClick={onPreviousPage}
      >
        Previous
      </Button>

      {/* Pagination Buttons */}
      <Box sx={{ display: "flex",
    spacing: 16,
    justifyContent: "center",
    flex: 1,}}>
        {renderPagination()}
      </Box>

      {/* Next Page Button */}
      <Button
        color="info"
        variant="outlined"
        endIcon={<ArrowForwardIcon />}
        disabled={currentPage === totalPages}
        onClick={onNextPage}
      >
        Next
      </Button>
    </Box>
  );
};

export default Pagination;
