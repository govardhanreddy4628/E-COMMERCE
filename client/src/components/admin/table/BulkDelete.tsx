
const BulkDelete = ({handleBulkDelete, selected}) => {
    return (
        <>
            <button
                onClick={handleBulkDelete}
                disabled={selected.length === 0}
                className="px-3 py-1 bg-red-600 rounded text-white disabled:opacity-50"
            >
                Delete
            </button>
        </>
    )
}

export default BulkDelete
