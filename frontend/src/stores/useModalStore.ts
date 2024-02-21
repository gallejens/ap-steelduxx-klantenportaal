import { create } from 'zustand';

type ModalState = {
  modal: { component: JSX.Element } | null;
};

type ModalStateActions = {
  openModal: (component: JSX.Element) => void;
  closeModal: () => void;
};

export const useModalStore = create<ModalState & ModalStateActions>(set => ({
  modal: null,
  openModal: component => set({ modal: { component } }),
  closeModal: () => set({ modal: null }),
}));
