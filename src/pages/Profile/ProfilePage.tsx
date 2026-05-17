import styles from "./ProfilePage.module.scss";
import { ProfileEdit } from "@/components/Profile/ProfileEdit";

export const ProfilePage = () => {
  return (
    <section className={styles.profile}>
      <div className="container">
        <ProfileEdit/>
      </div>
    </section>
  );
};
