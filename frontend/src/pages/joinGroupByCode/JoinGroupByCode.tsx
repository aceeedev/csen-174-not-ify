import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar, { BackButtonLocation } from '../../components/Navbar';
import { joinGroupByCodeOnBackend, getGroupsOnBackend } from '../../backendInterface';
import type { Group } from '../../models';
import './JoinGroupByCode.css';

function JoinGroupByCode() {
  const navigate = useNavigate();
  const [inviteCode, setInviteCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedCode = inviteCode.trim().toUpperCase();

    if (!trimmedCode || trimmedCode.length < 4) {
      setErrorMessage('Please enter a valid invite code (at least 4 characters)');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const result = await joinGroupByCodeOnBackend(trimmedCode);

      if (result.success) {
        // Fetch the full group data after joining
        const groups = await getGroupsOnBackend();
        const joinedGroup = groups?.find(g => g.id === result.data.group_id);
        
        if (joinedGroup) {
          // Navigate to the group page with full group data
          navigate(`/group`, { 
            state: { 
              group: joinedGroup
            } 
          });
        } else {
          // Fallback: navigate with minimal data and let GroupView handle it
          navigate(`/group`, { 
            state: { 
              group: {
                id: result.data.group_id,
                group_name: result.data.group_name
              }
            } 
          });
        }
      } else {
        setErrorMessage(result.message || 'Invalid invite code. Please try again.');
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Failed to join group:', error);
      setErrorMessage('Something went wrong. Please try again later.');
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className="join-group-by-code">
      <Navbar backButtonLocation={BackButtonLocation.ToHome} />

      <main className="join-group-content">
        <section className="join-group-card">
          <h1>Join a Group</h1>
          <p className="join-group-description">
            Enter the invite code shared by a group member to join their group.
          </p>

          <form className="join-group-form" onSubmit={handleSubmit}>
            <label htmlFor="invite-code">Invite Code</label>
            <input
              id="invite-code"
              type="text"
              value={inviteCode}
              onChange={(event) => {
                // Only allow alphanumeric characters, convert to uppercase
                const value = event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
                setInviteCode(value);
                setErrorMessage(null);
              }}
              placeholder="Enter 6-digit code"
              disabled={isSubmitting}
              required
              maxLength={10}
              style={{
                fontSize: '1.5rem',
                letterSpacing: '0.5rem',
                textAlign: 'center',
                fontFamily: 'monospace',
                fontWeight: 'bold'
              }}
            />

            {errorMessage && (
              <div className="join-group-error" role="alert">
                {errorMessage}
              </div>
            )}

            <div className="join-group-actions">
              <button
                type="button"
                onClick={handleCancel}
                className="join-group-button secondary"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="join-group-button primary"
                disabled={isSubmitting || !inviteCode.trim()}
              >
                {isSubmitting ? 'Joining…' : 'Join Group'}
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}

export default JoinGroupByCode;

