export function ProductImageModal({
  image,
  onClose,
}: {
  image: string;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
      <div className="bg-white p-4 rounded-lg">
        <img src={image} className="max-h-[80vh]" />
        <button onClick={onClose} className="mt-2 text-center w-full">
          Close
        </button>
      </div>
    </div>
  );
}
