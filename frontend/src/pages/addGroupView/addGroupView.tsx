import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar, { BackButtonLocation } from '../../components/Navbar';
import './addGroupView.css';
import { createGroupOnBackend } from '../../backendInterface';

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

      let response = await createGroupOnBackend(trimmedName, trimmedDescription);

      if (!response.success) {
        setErrorMessage(response.message);
        setIsSubmitting(false);

        return;
      }

      navigate('/', { state: { groupCreated: true } });
    } catch (error) {
      console.error('Failed to create group:', error);
      setErrorMessage('Something went wrong. Please try again later.');
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className="add-group-view">
      <Navbar backButtonLocation={BackButtonLocation.ToHome}/>

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


