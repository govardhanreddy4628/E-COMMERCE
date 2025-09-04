const BulkExport = ({ handleExportCSV, selected }) => {
    return (
        <>
            <button
                onClick={handleExportCSV}
                disabled={selected.length === 0}
                className="px-3 py-1 bg-green-600 rounded text-white disabled:opacity-50"
            >
                Export CSV
            </button>
        </>
    )
}

export default BulkExport
