import React from 'react';
import cls from "./Modal.module.scss";

const FullscreenModal = ({ children, isOpened, setIsOpened }) => {
    return (
        isOpened ? (
            <div className={cls.blur}>
                {
                    setIsOpened && (
                        <div className={cls.close_icon} onClick={() => setIsOpened(false)}></div>
                    )
                }
                <div className={cls.content}>
                    {children}
                </div>
            </div>
        ) : null
    );
};

export default FullscreenModal;
