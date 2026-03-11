import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "content/blog");

export function getPosts() {
  const files = fs.readdirSync(postsDirectory);

  return files.map((filename) => {
    const slug = filename.replace(".mdx", "");
    const fileContents = fs.readFileSync(
      path.join(postsDirectory, filename),
      "utf8",
    );

    const { data } = matter(fileContents);

    return {
      slug,
      ...data,
    };
  });
}
