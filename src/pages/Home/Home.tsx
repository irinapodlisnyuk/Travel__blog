import { useEffect, useState } from "react";
import { IPost } from "@/components/types/IPost";
import { getPosts } from "@/api/PostsApi";
import { PostCard } from "@/components/PostCard/PostCard";
import styles from "./Home.module.scss";

const Home = () => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState(true);

  // Проверка авторизации для кнопки
  const isAuth = !!localStorage.getItem("token");

  useEffect(() => {
    getPosts()
      .then((data) => {
        // Берем ровно 6 последних постов
        setPosts(data.slice(0, 6));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className={styles.home}>
      <div className="container">
        <div className={styles.home__header}>
          {isAuth && (
            <button className={styles.home__addBtn}>
              + Добавить моё путешествие
            </button>
          )}
        </div>

        {loading ? (
          <p className="text-center py-10">Загрузка историй...</p>
        ) : (
          <div className={styles.home__grid}>
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Home;
