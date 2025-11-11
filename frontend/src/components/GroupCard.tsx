import React from 'react';
import type { Group } from '../models';

interface GroupCardProps {
    group: Group;
}

const GroupCard: React.FC<GroupCardProps> = ({ group }) => {
    return (
        <div className="group-card" style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '16px',
            margin: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            backgroundColor: 'white',
            transition: 'box-shadow 0.3s ease',
            cursor: 'pointer'
        }}
        onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)'}
        onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)'}
        >
            <h3 style={{ margin: '0 0 8px 0', color: '#333' }}>{group.group_name}</h3>
            <p style={{ margin: '0', color: '#666' }}>{group.description}</p>
        </div>
    );
};

export default GroupCard;