import styles from "./Home.module.scss";
import { useEffect, useState } from "react";
import { IPost } from "@/components/types/IPost";
import { getPosts } from "@/api/PostsApi";
import { PostCard } from "@/components/PostCard/PostCard";

import Loading from "@/loading";
import { Link } from "react-router-dom";

const Home = () => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState(true);

  // Проверка авторизации для кнопки
  const isAuth = !!localStorage.getItem("token");

  useEffect(() => {
    getPosts()
      .then((data) => {
        // 1. Перемешиваем весь массив случайным образом
        const shuffled = [...data].sort(() => 0.5 - Math.random());

        setPosts(shuffled.slice(0, 6));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className={styles.home}>
      <div className="container">
        <div className={styles.home__wrapper}>
          {loading ? (
            <div className={styles["home__loading"]}>
              <Loading />
            </div>
          ) : (
            <div className={styles.home__cards}>
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
          {isAuth && (
            <Link to="/posts" >
            <button className={`${styles["home__add-btn"]} ${styles.btn}`}>
              Добавить моё путешествие
            </button>
            </Link>
           )} 
        </div>
      </div>
    </section>
  );
};

export default Home;
