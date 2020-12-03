import { nanoid } from 'nanoid';
import slugify from 'slugify';

export default (text, uni=false) => {
  const unique = nanoid();
  const slug = slugify(
    `${text}${uni ? unique:"" }`,
    {
      replacement: '-',
      lower: true,
    }
  )
  return slug;
}

