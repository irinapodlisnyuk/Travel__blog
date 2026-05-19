import { FC } from "react";
import Icon from "../types/Icon";
import styles from "./ModalOpen.module.scss";

interface ModalOpenProps {
  isOpen: boolean;      
  onClose: () => void;   
  text?: string;         
}

export const ModalOpen: FC<ModalOpenProps> = ({ 
  isOpen, 
  onClose, 
  text = "Ваша история успешно добавлена" 
}) => {
  
  if (!isOpen) return null; 

  return (
    <div className={styles["modal-overlay"]} onClick={onClose}>
      <div 
        className={styles["modal-content"]} 
        onClick={(e) => e.stopPropagation()} 
      >
        <p className={styles["modal-text"]}>{text}</p>
        <button 
          type="button" 
          className={styles["modal-btn"]} 
          onClick={onClose}
        ><Icon name="close-icon" className={styles["modal-btn__icon"]} />
        </button>
      </div>
    </div>
  );
};