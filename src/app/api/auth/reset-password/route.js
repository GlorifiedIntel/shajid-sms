import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import User from '@/models/User';
import Token from '@/models/Token';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export async function POST(req) {
  await dbConnect();
  const { userId, token, password } = await req.json();

  const resetToken = crypto.createHash('sha256').update(token).digest('hex');

  const dbToken = await Token.findOne({ userId, token: resetToken });
  if (!dbToken) {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
  }

  const user = await User.findById(userId);
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  user.password = await bcrypt.hash(password, 10);
  await user.save();
  await dbToken.deleteOne();

  return NextResponse.json({ message: 'Password reset successful. Redirecting...' });
}