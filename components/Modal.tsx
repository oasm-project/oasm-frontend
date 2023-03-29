import React from "react";
import ReactModal from "react-modal";

interface Props {
    className?: string;
    overlayClassName?: string;
    noCancelButton?: boolean;
    children: React.ReactNode;
    onModalClose?: () => void;
}

export type ModalHandle = {
    open: () => void;
    close: () => void;
};

const Modal = React.forwardRef<ModalHandle, Props>((props, ref) => {
    const [isOpen, setIsOpen] = React.useState(false);

    React.useEffect(() => {
        ReactModal.setAppElement("#__next");
    }, []);

    const openModal = () => {
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
        onModalClose && onModalClose();
    };

    React.useImperativeHandle(ref, () => ({
        open: () => openModal(),
        close: () => closeModal
    }));

    const { className, overlayClassName, noCancelButton, children, onModalClose } = props;
    return (
        <ReactModal
            overlayClassName={["bg-black/50 fixed inset-0 z-50 flex items-center justify-center", overlayClassName].join(" ")}
            className={["bg-white p-5 mx-5 md:mx-10 outline-none max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 rounded-md", className].join(" ")}
            isOpen={isOpen}
            onRequestClose={closeModal}
            contentLabel="Modal"
            ariaHideApp={true}
            preventScroll={true}
        >
            <div className="flex flex-col text-chumBlack">
                {!noCancelButton && (
                    <div onClick={closeModal} className="bg-[#D9D9D94D]/30 active:scale-125 transition-transform duration-300 cursor-pointer p-3 rounded-full ml-auto">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                )}
                {children}
            </div>
        </ReactModal>
    );
});

Modal.displayName = "Modal";

export default Modal;
