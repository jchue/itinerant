import PrimaryButton from './PrimaryButton';
import TertiaryButton from './TertiaryButton';
import 'material-symbols';

export default function ConfirmationModal({ children, title, addClass, onCancel, onConfirm }) {
  return (
    <div
      className="fixed flex justify-center items-center top-0 right-0 bottom-0 left-0 z-20"
    >
      {/* dialogue box */}
      <div className="bg-white max-w-lg px-8 py-6 overflow-hidden relative rounded-xl shadow-lg z-30">
        <header className="mb-4 text-left">
          <span className="align-middle inline-block material-symbols-sharp pr-2 text-red-500 !text-2xl">error</span>
          <span className="align-middle font-bold inline-block text-md text-red-500 text-sm uppercase">{title}</span>
        </header>
        <div className="mb-6 text-left">
          <p className="text-sm">{children}</p>
        </div>
        <footer className="text-right">
          <TertiaryButton
            onClick={onCancel}
          >
            No
          </TertiaryButton>
          <PrimaryButton
            onClick={onConfirm}
          >
            Yes
          </PrimaryButton>
        </footer>
      </div>

      {/* scrim */}
      <div
        onClick={onCancel}
        className="absolute bg-white opacity-80 top-0 right-0 bottom-0 left-0 z-20"
      >
      </div>
    </div>
  );
}
