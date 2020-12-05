import { nanoid } from 'nanoid';
import slugify from 'slugify';

export default (text, uni=false) => {
  const unique = nanoid();
  const slug = slugify(
    `${text}_${uni ? unique:"" }`,
    {
      replacement: '-',
      lower: true,
    }
  )
  return slug;
}

