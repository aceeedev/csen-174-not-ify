import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { getIdToken } from '../../firebase';
import './addGroupView.css';

const API_BASE_URL =
  import.meta.env.VITE_BACKEND_URL ?? 'http://127.0.0.1:5001';

function AddGroupView() {
  const navigate = useNavigate();
  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = groupName.trim();
    const trimmedDescription = description.trim();

    if (!trimmedName || !trimmedDescription) {
      setErrorMessage('Please provide both a group name and a description.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const token = await getIdToken();

      if (!token) {
        setErrorMessage('You must be signed in to create a group.');
        setIsSubmitting(false);
        return;
      }

      const baseUrl = API_BASE_URL.endsWith('/')
        ? API_BASE_URL.slice(0, -1)
        : API_BASE_URL;

      const response = await fetch(
        `${baseUrl}/create/group?groupName=${encodeURIComponent(
          trimmedName,
        )}&description=${encodeURIComponent(trimmedDescription)}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        let backendMessage = 'Failed to create group. Please try again.';
        try {
          const data = await response.json();
          backendMessage = data?.error ?? backendMessage;
        } catch (jsonError) {
          console.error('Error parsing backend response:', jsonError);
        }

        setErrorMessage(backendMessage);
        setIsSubmitting(false);
        return;
      }

      navigate('/userHomePage', { state: { groupCreated: true } });
    } catch (error) {
      console.error('Failed to create group:', error);
      setErrorMessage('Something went wrong. Please try again later.');
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/userHomePage');
  };

  return (
    <div className="add-group-view">
      <Navbar />

      <main className="add-group-content">
        <section className="add-group-card">
          <h1>Create a New Group</h1>
          <p className="add-group-description">
            Set up a new music group so you and your friends can start sharing
            playlists together.
          </p>

          <form className="add-group-form" onSubmit={handleSubmit}>
            <label htmlFor="group-name">Group name</label>
            <input
              id="group-name"
              type="text"
              value={groupName}
              onChange={(event) => setGroupName(event.target.value)}
              placeholder="Enter a descriptive group name"
              disabled={isSubmitting}
              required
            />

            <label htmlFor="group-description">Description</label>
            <textarea
              id="group-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Share what this group is all about"
              disabled={isSubmitting}
              rows={4}
              required
            />

            {errorMessage && (
              <div className="add-group-error" role="alert">
                {errorMessage}
              </div>
            )}

            <div className="add-group-actions">
              <button
                type="button"
                onClick={handleCancel}
                className="add-group-button secondary"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="add-group-button primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating…' : 'Create group'}
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}

export default AddGroupView;


