import { IPost } from "@/components/types/IPost";
import { Link } from "react-router-dom";
import styles from "./PostCard.module.scss";
import { BASE_URL } from "@/api/config";

interface PostCardProps {
  post: IPost;
}

export const PostCard = ({ post }: PostCardProps) => {
  const fullPhotoUrl = `${BASE_URL}${post.photo}`;

  return (
    <div className={styles.card}>
      <div className={styles.card__image}>
        <img src={fullPhotoUrl} alt={post.title} />
      </div>
      <div className={styles.card__content}>
        <h3 className={styles.card__title}>{post.title}</h3>
        <p className={styles.card__excerpt}>{post.excerpt}</p>
        <div className={styles.card__location}>
          {/* county с опечаткой, как в API Skillbox */}
          {post.county}, {post.city}
        </div>
        <Link to={`/posts/${post.id}`}>Подробнее</Link>
      </div>
    </div>
  );
};
