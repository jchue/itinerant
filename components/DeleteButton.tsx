import { useState } from 'react';
import { useRouter } from 'next/router';
import supabase from '@/lib/supabase';
import PrimaryButton from './PrimaryButton';
import SecondaryButton from './SecondaryButton';
import 'material-symbols';

export default function DeleteButton({ children, title, addClass, itemUuid, itemType, tripUuid, type, inverted }) {
  const router = useRouter();

  const [showConfirm, setShowConfirm] = useState(false);

  const confirmMessage = function() {
    if (itemType === 'trip' || itemType === 'flight' || itemType === 'stay') {
      return `Are you sure you want to delete this ${itemType}?`;
    }

    if (itemType === 'user') {
      return 'Are you sure you want to delete your account? All your trips will be deleted, and this cannot be undone.';
    }

    return null;
  }();

  async function deleteItem() {
    // Get current session
    const session = supabase.auth.session();
    const user = supabase.auth.user();

    setShowConfirm(false);

    const headers = { Authorization: `Bearer ${session.access_token}` };

    let nextPath = null;

    try {
      switch (itemType) {
        case 'trip':
          await fetch(`/api/trips/${itemUuid}`, { method: 'delete', headers });
          nextPath = '/trips';
          break;
        case 'flight':
          await fetch(`/api/flights/${itemUuid}`, { method: 'delete', headers });
          nextPath = `/trips/${tripUuid}`;
          break;
        case 'stay':
          await fetch(`/api/stays/${itemUuid}`, { method: 'delete', headers });
          nextPath = `/trips/${tripUuid}`;
          break;
        case 'user':
          await supabase.auth.signOut();
          await fetch(`/api/users/${user.id}`, { method: 'delete', headers });
          nextPath = '/login';
          break;
        default:
          break;
      }

      router.push(nextPath);
    } catch (error) {
      // TODO
    }
  }

  return (
    <div className="inline">
      {type === 'button' ? (
        /* button */
        <SecondaryButton
          title={title}
          addClass={`inline-flex justify-center mb-6 ${addClass}`}
          onClick={() => setShowConfirm(true)}
          inverted={inverted}
        >
          {children}
        </SecondaryButton>
      ) : (
       /* icon */
        <button
          title={title}
          className={`material-symbols-sharp pr-2 !text-xl ${inverted ? `text-gray-400 hover:text-white` : `text-gray-500 hover:text-gray-600`} ${addClass}`}
          onClick={() => setShowConfirm(true)}
        >
          delete
        </button>
      )}

      {showConfirm &&
        <div
          className="fixed flex justify-center items-center top-0 right-0 bottom-0 left-0 z-20"
        >
          {/* dialogue box */}
          <div className="bg-white max-w-lg px-8 py-6 overflow-hidden relative rounded-xl shadow-lg z-30">
            <header className="mb-4">
              <span className="align-middle inline-block material-symbols-sharp pr-2 text-red-500 !text-2xl">error</span>
              <span className="align-middle font-bold inline-block text-md text-red-500 text-sm uppercase">Delete</span>
            </header>
            <div className="mb-6">
              <p className="text-sm">{confirmMessage}</p>
            </div>
            <footer className="text-right">
              <PrimaryButton
                onClick={deleteItem}
                addClass="!bg-transparent !border-red-500
                mr-3 !shadow-none !text-red-500 hover:!bg-red-500 hover:!text-white
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Yes
              </PrimaryButton>
              <PrimaryButton
                onClick={() => setShowConfirm(false)}
              >
                No
              </PrimaryButton>
            </footer>
          </div>

          {/* scrim */}
          <div
            onClick={() => setShowConfirm(false)}
            className="absolute bg-white opacity-80 top-0 right-0 bottom-0 left-0 z-20"
          >
          </div>
        </div>
      }
    </div>
  );
}
