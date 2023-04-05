import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import { postSchema } from '../../../schema/post';

// POST /api/post
// Required fields in body: title, authorEmail
// Optional fields in body: content
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  if (method !== 'POST') {
    return res.status(405).json({
      error: { message: `Method ${method} Not Allowed` },
    });
  }

  const response = postSchema.safeParse(req.body);

  if (!response.success) {
    const { error } = response;
    return res.status(400).json({
      error: { message: 'Invalid request', error },
    });
  }

  const { authorEmail, content, title } = response.data;
  const user = await prisma.user.findFirst({
    where: {
      email: authorEmail,
    },
  });
  if (!user) {
    throw Error('Unable to find user');
  }
  await prisma.post.create({
    data: {
      title: title,
      content: content,
      author: { connect: user },
    },
  });
  return res.status(200).json({ message: 'Success' });
}
