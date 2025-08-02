import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import User from '@/models/User';

// GET checklist
export async function GET(req) {
  await dbConnect();
  const email = req.nextUrl.searchParams.get('email');
  const user = await User.findOne({ email });
  return NextResponse.json(user.checklist || []);
}

// POST update checklist
export async function POST(req) {
  await dbConnect();
  const { email, checklist } = await req.json();
  await User.findOneAndUpdate({ email }, { checklist });
  return NextResponse.json({ success: true });
}