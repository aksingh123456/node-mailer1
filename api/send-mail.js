import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Provide name, email, and message" });
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // 16-char Gmail App Password
    },
  });

  try {
    await transporter.sendMail({
      from: email,
      to: process.env.EMAIL_USER,
      subject: `New Contact Message from ${name}`,
      html: `<p><b>Name:</b> ${name}</p>
             <p><b>Email:</b> ${email}</p>
             <p><b>Message:</b> ${message}</p>`,
    });

    return res.status(200).json({ success: true, message: "Mail sent successfully" });
  } catch (err) {
    console.error("MAIL ERROR 👉", err);
    return res.status(500).json({ success: false, message: err.message });
  }
}
