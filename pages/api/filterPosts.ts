import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';

// GET /api/filterPosts?searchString=:searchString
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { searchString } = req.query;
  let singleSearchString = '';
  if (typeof searchString === 'string') {
    singleSearchString = searchString;
  } else {
    singleSearchString = searchString[0];
  }

  const resultPosts = await prisma.post.findMany({
    where: {
      OR: [
        {
          title: { contains: singleSearchString },
        },
        {
          content: { contains: singleSearchString },
        },
      ],
    },
  });
  res.json(resultPosts);
}
