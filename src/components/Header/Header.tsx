import styles from "./Header.module.scss";
import navStyles from "./Nav.module.scss";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Icon from "../types/Icon";
import { useEffect, useState } from "react";
import { logoutUser } from "@/api/User";
import { BASE_URL } from "@/api/config";

const AppHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem("token"));
  const [userName, setUserName] = useState("Путешественник");
  const [userPhoto, setUserPhoto] = useState("");

  const isHomePage = location.pathname === "/";

  useEffect(() => {
    const updateUserData = () => {
      const token = localStorage.getItem("token");
      const storedName = localStorage.getItem("userName");
      const storedPhoto = localStorage.getItem("userPhoto");

      setIsAuth(!!token);
      setUserName(
        storedName && storedName !== "undefined" && storedName.trim() !== ""
          ? storedName
          : "Путешественник",
      );
      setUserPhoto(
        storedPhoto && storedPhoto !== "undefined" ? storedPhoto : "",
      );
    };

    // 1. Считываем данные при монтировании или смене страницы
    updateUserData();

    // 2. Подписываемся на событие обновления данных для синхронизации на одной странице
    window.addEventListener("storage", updateUserData);

    // Очищаем слушатель при размонтировании
    return () => window.removeEventListener("storage", updateUserData);
  }, [location.pathname]);
  useEffect(() => {
    if (!isMenuOpen) return;

    const closeMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Безопасная проверка существования класса перед вызовом closest
      const linkClass = navStyles?.["nav-link"];
      if (linkClass && target.closest(`.${linkClass}`)) return;

      setIsMenuOpen(false);
    };

    document.addEventListener("click", closeMenu);
    return () => document.removeEventListener("click", closeMenu);
  }, [isMenuOpen]);

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Ошибка при выходе на сервере:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("userName");
      localStorage.removeItem("userPhoto");

      setIsAuth(false);
      setUserName("Путешественник");
      setUserPhoto("");
      setIsMenuOpen(false);
      navigate("/");
    }
  };

  const headerClass = isHomePage
    ? styles.header__wrapper
    : `${styles.header__wrapper} ${styles["header__wrapper--compact"]}`;

  const introText =
    isHomePage && !isAuth
      ? "ТАМ, ГДЕ МИР НАЧИНАЕТСЯ С ПУТЕШЕСТВИЙ"
      : "ИСТОРИИ ВАШИХ ПУТЕШЕСТВИЙ ";

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

            <nav className={navStyles.nav}>
              {isAuth ? (
                /* ИМЯ С ВЫПАДАЮЩИМ СПИСКОМ */
                <div className={navStyles["nav__wrapper"]}>
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className={navStyles["nav-link"]}
                  >
                    <div className={navStyles["nav__avatar"]}>
                      <img
                        src={userPhoto || `${import.meta.env.BASE_URL}images/avatar.jpg`}
                        alt="Аватар"
                        className={navStyles["nav__avatar-img"]}
                      />
                      <span className={navStyles["nav__avatar-name"]} >{userName}</span>
                    </div>
                    <span
                      className={`${navStyles["nav-arrow"]} ${isMenuOpen ? navStyles["nav-arrow--rotated"] : ""}`}
                    >
                      ▼
                    </span>
                  </button>

                  {isMenuOpen && (
                    <div className={navStyles["nav__menu"]}>
                      <Link
                        to="/profile"
                        className={navStyles["nav__menu-btn"]}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Профиль
                      </Link>
                      <button
                        onClick={handleLogout}
                        className={navStyles["nav__menu-btn"]}
                      >
                        Выйти
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /*  НЕ АВТОРИЗОВАН */
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
