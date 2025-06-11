import { sequelize } from "../config/db.js";
import { DataTypes } from "sequelize";

const User = sequelize.define(
    'User', {
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [6, 100], // Minimum length of 6 characters
            }
        }

    }
)


const initUserModel = async () => {
    try {
        await User.sync({ force: false }); // Set force to true to drop the table if it exists
        console.log("User model synced successfully.");
    } catch (error) {
        console.error("Error syncing User model:", error);
    }
};

export { User, initUserModel };