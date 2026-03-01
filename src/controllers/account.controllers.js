import accountModel from "../models/account.models.js";

export const createAccountController = async (req, res) => {
    try {
        const user = req.user;
        const account = await accountModel.create({
            user: user._id
        })

        res.status(201).json({ message: "Account created successfully", account });
    } catch (error) {
        res.status(500).json({ message: "Error creating account", error: error.message });
    }
}