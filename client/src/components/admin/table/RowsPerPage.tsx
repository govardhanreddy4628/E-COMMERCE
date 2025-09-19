
// type RowsPerPageProps = {
//     rowsPerPage: number;
//     setRowsPerPage: (value: number) => void;
//     setCurrentPage?: (page: number) => void;
//     setSelected?: (selected: any[]) => void;
// };

// const RowsPerPage = ({rowsPerPage = 5, setRowsPerPage, setCurrentPage = () => {}, setSelected = () => {}}: RowsPerPageProps) => {
    
//     const ROWS_PER_PAGE_OPTIONS = [5, 10, 20, -1]; // -1 means "All"

//     return (
//         <div>
//             <label htmlFor="rowsPerPage" className="text-sm">
//                 Rows per page:
//             </label>
//             <select
//                 id="rowsPerPage"
//                 value={rowsPerPage}
//                 onChange={(e) => {
//                     const val = e.target.value === 'all' ? -1 : parseInt(e.target.value);
//                     setRowsPerPage(val);
//                     setCurrentPage(1);
//                     setSelected([]);
//                     {(() => {console.log(e.target.value)})()}
//                 }}
//                 className="px-2 py-1 rounded border dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
//             >
//                 {ROWS_PER_PAGE_OPTIONS.map((num) =>
//                     num === -1 ? (
//                         <option key="all" value="all">
//                             All
//                         </option>
//                     ) : (
//                         <option key={num} value={num}>
//                             {num}
//                         </option>
//                     )
//                 )}
//             </select>
//         </div>
//     )
// }

// export default RowsPerPage





type RowsPerPageProps = {
    rowsPerPage: number;
    setRowsPerPage: (value: number) => void;
    setCurrentPage?: (page: number) => void;
    setSelected?: (selected: any[]) => void;
};

const RowsPerPage = ({
    rowsPerPage = 5,
    setRowsPerPage,
    setCurrentPage = () => {},
    setSelected = () => {},
}: RowsPerPageProps) => {
    const ROWS_PER_PAGE_OPTIONS = [5, 10, 20, 40, -1]; // -1 means "All"

    return (
        <div>
            <label htmlFor="rowsPerPage" className="text-sm">
                Rows per page:
            </label>
            <select
                id="rowsPerPage"
                value={rowsPerPage === -1 ? "all" : rowsPerPage.toString()}
                onChange={(e) => {
                    const val = e.target.value === "all" ? -1 : parseInt(e.target.value);
                    setRowsPerPage(val);
                    setCurrentPage(1);
                    setSelected([]);
                }}
                className="px-2 py-1 rounded border dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
            >
                {ROWS_PER_PAGE_OPTIONS.map((num) =>
                    num === -1 ? (
                        <option key="all" value="all">
                            All
                        </option>
                    ) : (
                        <option key={num} value={num.toString()}>
                            {num}
                        </option>
                    )
                )}
            </select>
        </div>
    );
};

export default RowsPerPage;
