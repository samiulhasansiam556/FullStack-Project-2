// ContactPage.js
import { useState } from 'react';
import axios from 'axios';
import NavIn from '../../components/nav/NavIn';

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [feedback, setFeedback] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${VITE_SERVER_URL}/api/contact`, formData);
      setFeedback('Message sent successfully!');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      setFeedback('Failed to send message. Please try again.');
    }
  };

  return (

    <div>

 <div>
  <NavIn></NavIn>
 </div>

   
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4">
      <h2 className="text-2xl text-blue-600 font-bold mb-4 mt-10">Contact Us</h2>
      <input
        type="text"
        placeholder="Your Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        className="w-full mb-2 p-2 border"
      />
      <input
        type="email"
        placeholder="Your Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        className="w-full mb-2 p-2 border"
      />
      <textarea
        placeholder="Your Message"
        value={formData.message}
        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        className="w-full h-80 mb-2 p-2 border"
      />
      <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
        Send Message
      </button>
      {feedback && <p className="mt-4 text-center">{feedback}</p>}
    </form>

    </div>
  );
};

export default ContactPage;
