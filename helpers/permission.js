import User from "../modules/user.js";

const uploadProductPermissions = async (userId) => {
    try {
        const user = await User.findById(userId);

        if (!user) {
            throw new Error("User not found");
        }

        return user.role === "ADMIN";
    } catch (error) {
        console.error(error);
        return false;
    }
}

export default uploadProductPermissions;
