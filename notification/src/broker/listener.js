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


  subscribeToQueue("ORDER_CREATED_NOTIFICATION", async (data) => {
    const htmlTemplate = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your Order Has Been Placed! 🚀</title>
        <style>
            body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
            table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        </style>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: Arial, sans-serif;">
        <center>
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
                <tr>
                    <td align="center" style="padding: 20px 0;">
                        <table border="0" cellpadding="0" cellspacing="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.05);">
                            <tr>
                                <td align="center" style="padding: 30px 20px 20px 20px; background-color: #007bff; border-top-left-radius: 8px; border-top-right-radius: 8px;">
                                    <h1 style="margin: 0; font-size: 28px; color: #ffffff;">
                                        Order Created Successfully!
                                    </h1>
                                </td>
                            </tr>
                            <tr>
                                <td align="center" style="padding: 40px 40px 20px 40px; color: #333333;">
                                    <h2 style="font-size: 24px; margin: 0 0 10px 0; color: #007bff;">Thank You for Your Order! 🎉</h2>
                                    <p style="font-size: 18px; line-height: 24px; margin: 0;">
                                        Hi ${data.username},
                                    </p>
                                    <p style="font-size: 16px; line-height: 24px; margin: 20px 0 0 0;">
                                        We're excited to let you know that your order has been received and is being processed. Our team is working hard to get your products ready for shipment!
                                    </p>
                                    <p style="font-size: 16px; line-height: 24px; margin: 20px 0 0 0;">
                                        You can expect timely updates and a seamless delivery experience. We promise to keep you informed every step of the way.
                                    </p>
                                </td>
                            </tr>
                            <tr>
                                <td align="center" style="padding: 20px 40px;">
                                    <table border="0" cellpadding="0" cellspacing="0">
                                        <tr>
                                            <td align="center" style="border-radius: 5px;" bgcolor="#007bff">
                                                <a href="${data.orderStatusLink || '#'}" target="_blank" style="font-size: 18px; font-weight: bold; font-family: Arial, sans-serif; color: #ffffff; text-decoration: none; background-color: #007bff; border: 1px solid #007bff; padding: 12px 25px; display: inline-block; border-radius: 5px;">
                                                    Track Your Order
                                                </a>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td align="center" style="padding: 20px; font-size: 14px; line-height: 20px; color: #888888; border-top: 1px solid #eeeeee;">
                                    <p style="margin: 0;">
                                        Need help? Reply to this email or visit our <a href="${data.supportLink || '#'}" style="color: #007bff;">Support Center</a>.
                                    </p>
                                    <p style="margin: 10px 0 0 0;">
                                        &copy; ${new Date().getFullYear()} services. All rights reserved.
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
      "Your order successfully completed.",
      htmlTemplate
    );
  });

  subscribeToQueue("PRODUCT_CREATED_NOTIFICATION",async (data) => {
    const htmlTemplate = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Product Added Successfully! 🎉</title>
        <style>
            body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
            table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        </style>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, sans-serif;">
        <center>
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
                <tr>
                    <td align="center" style="padding: 20px 0;">
                        <table border="0" cellpadding="0" cellspacing="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.05);">
                            <tr>
                                <td align="center" style="padding: 30px 20px 20px 20px; background-color: #28a745; border-top-left-radius: 8px; border-top-right-radius: 8px;">
                                    <h1 style="margin: 0; font-size: 28px; color: #ffffff;">
                                        Product Added Successfully!
                                    </h1>
                                </td>
                            </tr>
                            <tr>
                                <td align="center" style="padding: 40px 40px 20px 40px; color: #333333;">
                                    <h2 style="font-size: 24px; margin: 0 0 10px 0; color: #28a745;">Congratulations, ${data.username}!</h2>
                                    <p style="font-size: 18px; line-height: 24px; margin: 0;">
                                        Your product <strong>${data.title}</strong> has been successfully added to our marketplace.
                                    </p>
                                    <p style="font-size: 16px; line-height: 24px; margin: 20px 0 0 0;">
                                        You can now manage your product, update details, and track its performance from your seller dashboard.
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
      data.sellerEmail,
      "Product Added Successfully",
      "Your product was added to the marketplace.",
      htmlTemplate
    );
  })

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
                                          data.orderId || "CONFIRMED"
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
                                        <strong>${data.currency} ${
      data.totalAmount
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

                                        ${data.items
                                          .map(
                                            (item) => `
                                            <tr>
                                                <td style="padding: 10px 0; font-size: 16px; color: #555555; border-bottom: 1px solid #eeeeee;">
                                                    ${item.name} (x${item.quantity})
                                                </td>
                                                <td align="right" style="padding: 10px 0; font-size: 16px; color: #555555; border-bottom: 1px solid #eeeeee;">
                                                    ${data.currency} ${item.price}
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
                                                ${data.currency} ${
      data.totalAmount
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
                                          data.shippingAddress ||
                                          "Address not provided"
                                        }
                                    </p>
                                </td>
                            </tr>
                            <tr>
                                <td align="center" style="padding: 20px; font-size: 14px; line-height: 20px; color: #888888; border-top: 1px solid #eeeeee;">
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

  subscribeToQueue("PAYMENT_FAILED_NOTIFICATION",async (data)=>{
    const htmlTemplate = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Payment Failed Notification</title>
        <style>
            body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
            table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        </style>
    </head>
    <body style="margin: 0; padding: 0; background-color: #fff8f8; font-family: Arial, sans-serif;">
        <center>
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
                <tr>
                    <td align="center" style="padding: 20px 0;">
                        <table border="0" cellpadding="0" cellspacing="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(255,0,0,0.05);">
                            <tr>
                                <td align="center" style="padding: 30px 20px 20px 20px; background-color: #e53935; border-top-left-radius: 8px; border-top-right-radius: 8px;">
                                    <h1 style="margin: 0; font-size: 28px; color: #ffffff;">
                                        Payment Failed
                                    </h1>
                                </td>
                            </tr>
                            <tr>
                                <td align="center" style="padding: 40px 40px 20px 40px; color: #333333;">
                                    <h2 style="font-size: 24px; margin: 0 0 10px 0; color: #e53935;">We're Sorry, ${data.username}</h2>
                                    <p style="font-size: 18px; line-height: 24px; margin: 0;">
                                        Unfortunately, your recent payment attempt was unsuccessful.
                                    </p>
                                    <p style="font-size: 16px; line-height: 24px; margin: 20px 0 0 0;">
                                        Please check your payment details and try again. If you need assistance, feel free to contact our support team.
                                    </p>
                                </td>
                            </tr>
                            <tr>
                                <td align="center" style="padding: 20px 40px;">
                                    <table border="0" cellpadding="0" cellspacing="0">
                                       
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td align="center" style="padding: 20px; font-size: 14px; line-height: 20px; color: #888888; border-top: 1px solid #eeeeee;">
                                    <p style="margin: 0;">
                                        &copy; ${new Date().getFullYear()} services. All rights reserved.
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
      "Payment Failed",
      "Your payment could not be processed.",
      htmlTemplate
    );
  })
};
