import { useState } from "react";
import useShowToast from "./useShowToast";
import userAtom from "../atoms/userAtom";
import { useRecoilValue } from "recoil";

const useFollowUnfollow = () => {
	const currentUser = useRecoilValue(userAtom);
	const [following, setFollowing] = useState('');
	const [updating, setUpdating] = useState(false);
	const showToast = useShowToast();

	const handleFollowUnfollow = async () => {
		if (!currentUser) {
			showToast("Error", "Please login to follow", "error");
			return;
		}
		if (updating) return;

		setUpdating(true);
		try {
			// const res = await fetch(`/api/users/follow/${user._id}`, {
			// 	method: "POST",
			// 	headers: {
			// 		"Content-Type": "application/json",
			// 	},
			// });
			// const data = await res.json();
			// if (data.error) {
			// 	showToast("Error", data.error, "error");
			// 	return;
			// }

			if (following) {
				showToast("Success", `Unfollowed Elon Musk`, "success");
				// user.followers.pop(); // simulate removing from followers
			} else {
				showToast("Success", `Followed Elon Musk`, "success");
				// user.followers.push(); // simulate adding to followers
			}
			setFollowing(!following);

			// console.log(data);
		} catch (error) {
			showToast("Error", error, "error");
		} finally {
			setUpdating(false);
		}
	};

	return { handleFollowUnfollow, updating, following };
};

export default useFollowUnfollow;
