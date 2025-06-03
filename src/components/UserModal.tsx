import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { CiLocationOn } from "react-icons/ci";
import { FaRegBuilding } from "react-icons/fa";
import { IoIosLink } from "react-icons/io";
import type { UserDetail } from "../types/user";

type ModalProps = {
	show: boolean;
	onClose: () => void;
	username: string;
	children?: ReactNode;
};

export default function Modal({
	show,
	onClose,
	username,
	children,
}: ModalProps) {
	const [profile, setProfile] = useState<UserDetail | null>(null);

	useEffect(() => {
		if (show) {
			fetch("https://api.github.com/users/" + username)
				.then((res) => res.json())
				.then((data) => setProfile(data))
				.catch((err) => console.error("Error fetching profile:", err));
		}
	}, [show]);

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
					{/* Close Button */}
					<button
						onClick={onClose}
						className="absolute top-4 right-4 text-gray-400 hover:text-white focus:outline-none cursor-pointer"
						aria-label="Close modal"
					>
						✕
					</button>

					{/* Profile Header */}
					{profile ? (
						<div className="">
							<div className="flex gap-1">
								<img
									src={profile.avatar_url}
									alt={profile.login}
									className="w-25 h-25 rounded-full mr-4 border-2 border-white  shadow-md"
								/>
								<div className="flex flex-col gap-1">
									<h3 className="text-lg font-semibold text-white">
										{profile.name || profile.login}
									</h3>
									<div className="flex items-center gap-1 text-sm text-gray-400">
										<FaRegBuilding className="text-base" />
										{profile.company || "No company info"}
									</div>

									<div className="flex items-center justify-start  gap-1 text-sm text-gray-400">
										<CiLocationOn />
										{profile.location ||
											"No location available"}
									</div>
									<div className="flex items-center gap-1 text-sm text-gray-400">
										<IoIosLink className="text-base" />
										{profile.blog ? (
											<a
												href={`${profile.blog}`}
												target="_blank"
												rel="noopener noreferrer"
												className="hover:underline text-blue-400"
											>
												{profile.blog}
											</a>
										) : (
											<span>No blog available</span>
										)}
									</div>
								</div>
							</div>
							<p className="text-sm text-gray-400 my-3">
								{profile.bio || "No bio available"}
							</p>
						</div>
					) : (
						<p className="text-white mb-4">Loading profile...</p>
					)}

					{/* Modal Children */}
					<div className="max-h-96 overflow-y-auto">{children}</div>
				</div>
			</div>
		</>
	);
}
