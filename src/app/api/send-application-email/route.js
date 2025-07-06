import nodemailer from 'nodemailer';

export async function POST(req) {
  try {
    const { email, pdf } = await req.json();

    if (!email || !pdf) {
      return new Response(
        JSON.stringify({ error: 'Missing email or PDF data' }),
        { status: 400 }
      );
    }

    // Convert array of bytes back to Buffer
    const pdfBuffer = Buffer.from(pdf);

    // Configure Nodemailer transport (example using Gmail SMTP)
    // Replace with your SMTP settings or use environment variables
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,      // your email
        pass: process.env.EMAIL_PASS,      // your app password or real password
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your Submitted Application PDF',
      text: 'Attached is a copy of your submitted application.',
      attachments: [
        {
          filename: 'application.pdf',
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    };

    await transporter.sendMail(mailOptions);

    return new Response(JSON.stringify({ message: 'Email sent successfully' }), {
      status: 200,
    });
  } catch (error) {
    console.error('Error sending application email:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to send email' }),
      { status: 500 }
    );
  }
}