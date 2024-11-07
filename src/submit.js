const fetch = require("node-fetch").default;
const getMessage = require("./message");
const { getInput, info, setFailed } = require("@actions/core");

const submitNotification = async () => {
    try {
        const webhookBody = JSON.stringify(await getMessage());
        const webhookUrl = getInput("WEBHOOK_URI", { required: true })

        if (!webhookUrl) {
            throw new Error("WEBHOOK_URI is required but not provided");
        }

        const response = await fetch(webhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: webhookBody,
        }
        );

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        info("Webhook submitted successfully");
        return response;
    } catch (error) {
        const errorMsg = `Error in submitNotification: ${error.message}`;
        console.error(errorMsg);
        setFailed(errorMsg);
        throw error;
    }
};

module.exports = submitNotification;
