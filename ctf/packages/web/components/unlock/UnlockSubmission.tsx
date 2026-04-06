import React, { useState } from 'react';

export default function UnlockSubmission() {
  const [url, setUrl] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    // TODO: Add real validation and API call
    if (!url.match(/^https:\/\/www\.quora\.com\/profile\//)) {
      setError('Please enter a valid Quora profile URL.');
      return;
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="p-6 max-w-md mx-auto bg-white rounded shadow">
        <h2 className="text-xl font-bold mb-2">Submission Received</h2>
        <p className="mb-4">Your Quora profile is under review. You will be notified when your access is upgraded.</p>
        <p className="text-green-600 font-semibold">You will be awarded <span className="font-bold">100 Service Credits</span> upon approval!</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 max-w-md mx-auto bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-2">Unlock Access</h2>
      <p className="mb-4">To unlock full access, please submit your Quora profile URL for trust verification. <br />
        <span className="text-green-600 font-semibold">Get 100 Service Credits upon approval!</span>
      </p>
      <input
        type="url"
        className="border p-2 w-full mb-2 rounded"
        placeholder="https://www.quora.com/profile/Your-Name"
        value={url}
        onChange={e => setUrl(e.target.value)}
        required
      />
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-full">Submit</button>
    </form>
  );
}
