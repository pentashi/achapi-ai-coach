import React from "react";

export default function Navigator({
  step,
  stepsLength,
  onNext,
  onBack,
  onSubmit,
  isNextDisabled,
  isSubmitting,
}) {
  return (
    <div className="d-flex justify-content-between align-items-center mt-3">
      <button
        type="button"
        className="btn btn-outline-secondary"
        onClick={onBack}
        disabled={step === 0 || isSubmitting}
      >
        ← Back
      </button>

      {step < stepsLength - 1 && (
        <button
          type="button"
          className="btn btn-primary"
          onClick={onNext}
          disabled={isNextDisabled || isSubmitting}
        >
          Next →
        </button>
      )}

      {step === stepsLength - 1 && (
        <button
          type="button"
          className="btn btn-success"
          onClick={onSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Submit"}
        </button>
      )}
    </div>
  );
}
