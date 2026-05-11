import styles from "./Header.module.scss";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Icon from "../types/Icon";
import { useEffect, useState } from "react";
import { logoutUser } from "@/api/User";

const AppHeader = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const location = useLocation();
  const isHomePage = location.pathname === "/";

  const [isAuth, setIsAuth] = useState(!!localStorage.getItem("token"));
  const userName = localStorage.getItem("userName") || "Путешественник";

  useEffect(() => {
    if (!isMenuOpen) return;

    const closeMenu = () => setIsMenuOpen(false);
    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [isMenuOpen]);

  const handleLogout = async () => {
    try {
      // 1. Уведомляем бэкенд (опционально, но правильно)
      await logoutUser();
    } catch (error) {
      console.error("Ошибка при выходе на сервере:", error);
    } finally {
      // 2. В любом случае чистим локальные данные
      localStorage.removeItem("token");
      localStorage.removeItem("userName");

      // 3. Обновляем состояние (если ты используешь стейт для авторизации)
      setIsAuth(false);
      setIsMenuOpen(false);

      navigate("/");
    }
  };

  const headerClass = isHomePage ? styles.header__wrapper : `${styles.header__wrapper} ${styles['header__wrapper--compact']}`;

  const introText =
    isHomePage && !isAuth
      ? "Там, где мир начинается с путешествий"
      : "Истории ваших путешествий";

  return (
    <header className={styles.header}>
      <div className="container">
        <div className={headerClass}>
          <div className={styles["header__top"]}>
            <Link to="/" className={styles["header__logo"]}>
              <Icon
                name="travel-icon"
                className={styles["header__logo-icon"]}
              />
              <Icon name="travel" className={styles["header__logo-travel"]} />
            </Link>

            <nav className="flex items-center gap-8">
              {isAuth ? (
                /* ВМЕСТО "ВОЙТИ" — ИМЯ С ВЫПАДАЮЩИМ СПИСКОМ */
                <div className="relative">
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="nav-link"
                  >
                    <span>{userName}</span>
                    <span
                      className={`transition-transform ${isMenuOpen ? "rotate-180" : ""}`}
                    >
                      ▼
                    </span>
                  </button>

                  {isMenuOpen && (
                    <div className="absolute ">
                      <Link
                        to="/profile"
                        className="block"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Профиль
                      </Link>
                      <button onClick={handleLogout} className="">
                        Выйти
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* ЕСЛИ НЕ АВТОРИЗОВАН */
                <div className={styles["header__login"]}>
                  <Link to="/login" className={styles["header__login-open"]}>
                    Войти
                  </Link>
                </div>
              )}
            </nav>
          </div>
          <div className={styles["header__intro"]}>
            <p className={styles["header__intro-text"]}>
              {introText.replace(" с ", " с\u00A0")}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;