
export default function Modal({ show, onClose, title, children }) {
	if (!show) return null;

	return (
		<>
			{/* Backdrop */}
			<div
				className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm z-40"
				onClick={onClose}
			></div>

			{/* Modal Content */}
			<div className="fixed inset-0 flex items-center justify-center z-50 p-4">
				<div className="bg-gray-800 rounded-lg max-w-2xl w-full p-6 relative shadow-xl">
					<h3 className="text-xl font-semibold mb-4 text-white">
						{title}
					</h3>
					<button
						onClick={onClose}
						className="absolute top-4 right-4 text-gray-400 hover:text-white focus:outline-none"
						aria-label="Close modal"
					>
						✕
					</button>
					<div className="max-h-96 overflow-y-auto">{children}</div>
				</div>
			</div>
		</>
	);
}
