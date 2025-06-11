import { sequelize } from "../config/db.js";
import { DataTypes } from "sequelize";

const VerificationToken = sequelize.define(
    'VerificationToken', {
        token: {
            type: DataTypes.STRING,
            allowNull: false
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        expiresAt: {
            type: DataTypes.DATE,
            allowNull: false
        }
    }
);

const initVerificationModel = async () => {
    try {
        await VerificationToken.sync({ force: false }); // Set force to true to drop the table if it exists
        console.log("Verification model synced successfully.");
    } catch (error) {
        console.error("Error syncing Verification model:", error);
    }
};

export {VerificationToken, initVerificationModel};