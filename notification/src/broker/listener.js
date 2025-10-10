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
    await sendEmail(
      data.email,
      "Welcome to Our Service",
      "Thank you for registering with us!",
      htmlTemplate
    );
  });

  subscribeToQueue("PAYMENT_COMPLETED_NOTIFICATION", async (data) => {
    const htmlTemplate = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmed! Your Payment was Successful 🎉</title>
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
                                <td align="center" style="padding: 30px 20px 20px 20px; background-color: #4CAF50; border-top-left-radius: 8px; border-top-right-radius: 8px;">
                                    <h1 style="margin: 0; font-size: 28px; color: #ffffff;">
                                        Order #${
                                          orderDetails.orderId || "CONFIRMED"
                                        }
                                    </h1>
                                </td>
                            </tr>

                            <tr>
                                <td align="center" style="padding: 40px 40px 20px 40px; color: #333333;">
                                    <h2 style="font-size: 24px; margin: 0 0 10px 0; color: #4CAF50;">Payment Successful! 🎉</h2>
                                    <p style="font-size: 18px; line-height: 24px; margin: 0;">
                                        Hello ${userName},
                                    </p>
                                    <p style="font-size: 16px; line-height: 24px; margin: 20px 0 0 0;">
                                        Thank you for your purchase! We've received your payment of 
                                        <strong>${orderDetails.currency} ${
      orderDetails.totalAmount
    }</strong> 
                                        and are preparing your order for shipment.
                                    </p>
                                </td>
                            </tr>

                            <tr>
                                <td style="padding: 0 40px;">
                                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; margin-bottom: 20px;">
                                        <tr>
                                            <td colspan="2" style="font-size: 18px; font-weight: bold; padding-bottom: 10px; border-bottom: 2px solid #2D3E50;">Order Summary</td>
                                        </tr>

                                        ${orderDetails.items
                                          .map(
                                            (item) => `
                                            <tr>
                                                <td style="padding: 10px 0; font-size: 16px; color: #555555; border-bottom: 1px solid #eeeeee;">
                                                    ${item.name} (x${item.quantity})
                                                </td>
                                                <td align="right" style="padding: 10px 0; font-size: 16px; color: #555555; border-bottom: 1px solid #eeeeee;">
                                                    ${orderDetails.currency} ${item.price}
                                                </td>
                                            </tr>
                                        `
                                          )
                                          .join("")}
                                        
                                        <tr>
                                            <td style="padding: 15px 0 0; font-size: 18px; font-weight: bold; color: #333333;">
                                                Total Paid
                                            </td>
                                            <td align="right" style="padding: 15px 0 0; font-size: 18px; font-weight: bold; color: #333333;">
                                                ${orderDetails.currency} ${
      orderDetails.totalAmount
    }
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>

                            <tr>
                                <td style="padding: 20px 40px; color: #333333; border-top: 1px solid #eeeeee;">
                                    <p style="font-weight: bold; margin: 0 0 5px 0; font-size: 16px;">Shipping To:</p>
                                    <p style="margin: 0; font-size: 15px; color: #555555;">
                                        ${
                                          orderDetails.shippingAddress ||
                                          "Address not provided"
                                        }
                                    </p>
                                </td>
                            </tr>

                            <tr>
                                <td align="center" style="padding: 10px 40px 40px 40px;">
                                    <table border="0" cellpadding="0" cellspacing="0">
                                        <tr>
                                            <td align="center" style="border-radius: 5px;" bgcolor="#2D3E50">
                                                <a href="${loginLink}" target="_blank" style="font-size: 18px; font-weight: bold; font-family: Arial, sans-serif; color: #ffffff; text-decoration: none; background-color: #2D3E50; border: 1px solid #2D3E50; padding: 12px 25px; display: inline-block; border-radius: 5px;">
                                                    View Order Status
                                                </a>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>

                            <tr>
                                <td align="center" style="padding: 20px; font-size: 14px; line-height: 20px; color: #888888; border-top: 1px solid #eeeeee;">
                                    <p style="margin: 0;">
                                        Questions? Reply to this email or visit our <a href="${supportLink}" style="color: #4CAF50;">Support Center</a>.
                                    </p>
                                    <p style="margin: 10px 0 0 0;">
                                        &copy; ${currentYear} services. All rights reserved.
                                    </p>
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

    await sendEmail(
      data.email,
      "Welcome to Our Service",
      "Thank you for registering with us!",
      htmlTemplate
    );
  });
};
