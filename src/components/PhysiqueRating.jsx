import React, { useState } from 'react';

export default function PhysiqueRating({ metrics = {} }) {
  const [frontImage, setFrontImage] = useState(null);
  const [backImage, setBackImage] = useState(null);
  const [isRating, setIsRating] = useState(false);
  const [finalScore, setFinalScore] = useState(metrics.score || null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleImageUpload = (setter) => (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setter(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const dataURLtoFile = (dataurl, filename) => {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) u8arr[n] = bstr.charCodeAt(n);

    return new File([u8arr], filename, { type: mime });
  };

  const startRating = async () => {
    setIsRating(true);
    setFinalScore(null);
    setErrorMsg('');

    const formData = new FormData();
    formData.append('frontImage', dataURLtoFile(frontImage, 'front.jpg'));
    formData.append('backImage', dataURLtoFile(backImage, 'back.jpg'));
    formData.append('userId', 'user123'); // Replace as needed

    try {
      const response = await fetch('/api/v1/physique/rate', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        setFinalScore(result.score);
      } else {
        setErrorMsg(result.message || 'Failed to rate physique.');
      }
    } catch (err) {
      setErrorMsg('Error contacting server.');
    } finally {
      setIsRating(false);
    }
  };

  const metricList = [
    { label: 'Shoulders', value: metrics.shoulders || 'N/A' },
    { label: 'Chest', value: metrics.chest || 'N/A' },
    { label: 'Arms', value: metrics.arms || 'N/A' },
    { label: 'Back', value: metrics.back || 'N/A' },
    { label: 'Legs', value: metrics.legs || 'N/A' },
    { label: 'Abs & Core', value: metrics.abs || 'N/A' },
    { label: 'Waist Proportion', value: metrics.waistProportion || 'N/A' },
    { label: 'Body Fat %', value: metrics.bodyFat || 'N/A' },
    { label: 'Symmetry & Balance', value: metrics.symmetry || 'N/A' },
    { label: 'Muscle Definition', value: metrics.definition || 'N/A' },
  ];

  return (
    <div className="container my-5 p-4 border rounded shadow-lg bg-dark text-light">
      <h2 className="text-center text-info mb-4 fw-bold">💪 Physique Rating</h2>

      {/* Upload Section */}
      <div className="row justify-content-center mb-4">
        {/* Front Upload */}
        <div className="col-md-5 text-center mb-4">
          <label className="btn btn-info text-dark fw-bold mb-2" htmlFor="front-upload">
            Upload Front Photo
          </label>
          <input
            id="front-upload"
            type="file"
            accept="image/*"
            onChange={handleImageUpload(setFrontImage)}
            className="d-none"
          />
          <div
            className="border border-info rounded position-relative mx-auto"
            style={{ height: 300, maxWidth: 280, backgroundColor: '#222' }}
          >
            {frontImage ? (
              <img
                src={frontImage}
                alt="Front physique"
                className="w-100 h-100 rounded object-fit-cover"
              />
            ) : (
              <p className="text-muted pt-5 small">Front view with legs shown</p>
            )}
          </div>
        </div>

        {/* Back Upload */}
        <div className="col-md-5 text-center mb-4">
          <label className="btn btn-info text-dark fw-bold mb-2" htmlFor="back-upload">
            Upload Back Photo
          </label>
          <input
            id="back-upload"
            type="file"
            accept="image/*"
            onChange={handleImageUpload(setBackImage)}
            className="d-none"
          />
          <div
            className="border border-info rounded position-relative mx-auto"
            style={{ height: 300, maxWidth: 280, backgroundColor: '#222' }}
          >
            {backImage ? (
              <img
                src={backImage}
                alt="Back physique"
                className="w-100 h-100 rounded object-fit-cover"
              />
            ) : (
              <p className="text-muted pt-5 small">Back view with legs shown</p>
            )}
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="text-center mb-4">
        <button
          className={`btn btn-lg fw-bold ${
            !frontImage || !backImage || isRating ? 'btn-secondary' : 'btn-info text-dark'
          }`}
          onClick={startRating}
          disabled={!frontImage || !backImage || isRating}
        >
          {isRating ? 'Analyzing...' : 'Rate My Physique'}
        </button>
      </div>

      {/* Spinner */}
      {isRating && (
        <div className="text-center my-3">
          <div className="spinner-border text-info" role="status"></div>
        </div>
      )}

      {/* Error */}
      {errorMsg && <div className="alert alert-danger text-center">{errorMsg}</div>}

      {/* Metrics */}
      {!isRating && (
        <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-3">
          {metricList.map(({ label, value }) => (
            <div key={label} className="col">
              <div className="bg-secondary p-3 rounded text-center h-100 shadow-sm">
                <div className="text-light small fw-semibold mb-1">{label}</div>
                <div className="h4 fw-bold text-white">{value}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Score */}
      {!isRating && finalScore !== null && (
        <div
          className="alert alert-info text-center mt-5 fw-bold fs-4"
          role="status"
          aria-live="polite"
        >
          Final Physique Score: {finalScore} / 100
        </div>
      )}
    </div>
  );
}
