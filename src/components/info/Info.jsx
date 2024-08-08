import React from 'react';
import './Info.css'; 


export function Info() {
  return (
    <div className={styles.aboutUs}>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia ea perspiciatis non eum, deserunt, itaque distinctio qui sunt, accusamus odit iure incidunt voluptates? Consequatur perspiciatis dolor facilis repellat minima tempora.
    </div>
  )
}


// here we can create diferent options to use InformationModal in different cases...
export const adminUserListInfo = {
  title: 'Admin Information',
  subtitle: 'Here is some advice that can help you:',
  description: [
    '- By clicking on the icon with the admin status ("shield" / "No"), you can change it.',
    '- By clicking on the "red cross" icon, you can delete a user.',
    '- By clicking on a users name, you can open their interface and see their files.',
    '- Logically, you cannot delete yourself or change your own admin status.'
  ],
  actions: [
    'View the list of users.',
    'Delete users.',
    'Change the admin status of users.',
    'View total files and size for each user.',
    'See user interfaces with their files.'
  ]
};

// Information Modal
const InformationModal = ({ show, onClose, content }) => {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{content.title}</h2>
        <h3>{content.subtitle}</h3>
        <ul>
          {content.description.map((sentence, index) => (
            <li key={index}>{sentence}</li>
          ))}
        </ul>
        <p style={{ fontWeight: 'bold' }}>Actions</p>
        <ul>
          {content.actions.map((action, index) => (
            <li key={index}>{action}</li>
          ))}
        </ul>
        <button className="close-button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default InformationModal;