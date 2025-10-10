const { subscribeToQueue } = require("./broker");
const sendEmail = require("../email");

module.exports = function () {
  subscribeToQueue("AUTH_USER_REGISTER_NOTIFICATION", async (data) => {
    const htmlTemplate = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to services! 🎉</title>
        <style>
            /* Email compatibility resets */
            body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
            table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        </style>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, sans-serif;">
        <center>
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
                <tr>
                    <td align="center" style="padding: 20px 0;">
                        <table border="0" cellpadding="0" cellspacing="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);">
                            
                            <tr>
                                <td align="center" style="padding: 30px 20px 20px 20px; background-color: #2D3E50; border-top-left-radius: 8px; border-top-right-radius: 8px;">
                                    <h1 style="margin: 0; font-size: 28px; color: #ffffff;">
                                        Welcome to services!
                                    </h1>
                                </td>
                            </tr>

                            <tr>
                                <td align="center" style="padding: 40px 40px 20px 40px; color: #333333;">
                                    <h2 style="font-size: 24px; margin: 0 0 10px 0; color: #4CAF50;">Registration Successful! 🎉</h2>
                                    <p style="font-size: 18px; line-height: 24px; margin: 0;">
                                        Hello ${data.username},
                                    </p>
                                    <p style="font-size: 16px; line-height: 24px; margin: 20px 0 0 0;">
                                        We are thrilled to have you join our community. Your account is ready. Click below to explore our products!
                                    </p>
                                </td>
                            </tr>

                            <tr>
                                <td align="center" style="padding: 20px 40px;">
                                    <table border="0" cellpadding="0" cellspacing="0">
                                    </table>
                                </td>
                            </tr>
                            

                        </table>
                    </td>
                </tr>
            </table>
        </center>
    </body>
    </html>
        `;
    await sendEmail(data.email, "Welcome to Our Service", "Thank you for registering with us!", htmlTemplate);
  });
};
