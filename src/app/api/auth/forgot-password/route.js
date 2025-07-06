import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import User from '@/models/User';
import Token from '@/models/Token';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

export async function POST(req) {
  await dbConnect();
  const { email } = await req.json();
  const user = await User.findOne({ email });
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  // Create/replace token
  const existing = await Token.findOne({ userId: user._id });
  if (existing) await existing.deleteOne();

  const resetToken = crypto.randomBytes(32).toString('hex');
  const hash = crypto.createHash('sha256').update(resetToken).digest('hex');

  await new Token({ userId: user._id, token: hash, createdAt: Date.now() }).save();

  // Send email with link
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: +process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}&id=${user._id}`;

  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: email,
    subject: 'Password Reset Request',
    html: `<p>Click <a href="${resetUrl}">here</a> to reset your password.</p>`,
  });

  return NextResponse.json({ message: 'Reset link sent to your email.' });
}