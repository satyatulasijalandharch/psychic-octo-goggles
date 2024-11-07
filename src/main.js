const { setFailed, getInput } = require("@actions/core");

module.exports.run = async () => {
  try {
    const webhookBody = await require("./utility")();

    if (getInput('DEBUG', { required: false }).toLowerCase() === 'true') {
      console.log('Webhook body:', JSON.stringify(webhookBody, null, 2));
    }
    await require("./submit")();
  } catch (error) {
    console.error('Error during submission:', error);
    setFailed(error.message);
  }
};
