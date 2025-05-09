import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft } from 'lucide-react';

const QuizModal = ({ assessment, onBackClick }) => {
  const [cameraPermission, setCameraPermission] = useState('pending'); // 'pending', 'granted', 'denied', 'unavailable'
  const [errorMessage, setErrorMessage] = useState('');
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Request camera access
  const requestCameraAccess = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraPermission('granted');
    } catch (error) {
      console.error('Camera access error:', error);
      if (error.name === 'NotAllowedError') {
        setCameraPermission('denied');
        setErrorMessage('Camera access was denied. Please allow camera access to start the quiz.');
      } else if (error.name === 'NotFoundError') {
        setCameraPermission('unavailable');
        setErrorMessage('No camera found. Please connect a camera to start the quiz.');
      } else {
        setCameraPermission('unavailable');
        setErrorMessage('Unable to access camera. Please check your browser settings or hardware.');
      }
    }
  };

  // Clean up camera stream on component unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  if (!assessment) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <p className="text-slate-600">No assessment data available.</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col bg-white" style={{ height: '100vh' }}>
      {/* Header */}
      <div className="flex-none p-4 border-b border-slate-200 flex items-center bg-white">
        <button
          onClick={onBackClick}
          className="mr-4 p-2 rounded-full hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-xl font-semibold text-slate-800">{assessment.title}</h1>
          <p className="text-sm text-slate-500">Complete the quiz to test your knowledge</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto bg-white p-6">
        {cameraPermission === 'pending' && (
          <div className="bg-white rounded-xl p-6 border border-slate-100 mb-6">
            <h2 className="text-lg font-medium mb-4 text-slate-800">Camera Access Required</h2>
            <p className="text-slate-600 mb-4">
              This quiz requires camera access for proctoring. Please grant permission to start the quiz.
            </p>
            <button
              onClick={requestCameraAccess}
              className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
            >
              Request Camera Access
            </button>
          </div>
        )}

        {(cameraPermission === 'denied' || cameraPermission === 'unavailable') && (
          <div className="bg-white rounded-xl p-6 border border-red-100 mb-6">
            <h2 className="text-lg font-medium mb-4 text-red-800">Camera Access Error</h2>
            <p className="text-red-600 mb-4">{errorMessage}</p>
            {cameraPermission === 'denied' && (
              <button
                onClick={requestCameraAccess}
                className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
              >
                Try Again
              </button>
            )}
          </div>
        )}

        {cameraPermission === 'granted' && (
          <>
            {/* Video Feed */}
            <div className="bg-white rounded-xl p-6 border border-slate-100 mb-6">
              <h2 className="text-lg font-medium mb-4 text-slate-800">Camera Feed</h2>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full max-w-md rounded-lg border border-slate-200"
              />
            </div>

            {/* Quiz Details */}
            <div className="bg-white rounded-xl p-6 border border-slate-100 mb-6">
              <h2 className="text-lg font-medium mb-4 text-slate-800">Quiz Details</h2>
              <p className="text-slate-600">Type: {assessment.type}</p>
              <p className="text-slate-600">Questions: {assessment.questions}</p>
              <p className="text-slate-600">Duration: {assessment.duration}</p>
              <p className="text-slate-600 mt-2">
                {assessment.completed ? `Completed with score: ${assessment.score}%` : 'Not yet completed'}
              </p>
            </div>

            {/* Quiz Questions */}
            <div className="space-y-6">
              <div className="border border-slate-200 rounded-lg p-4">
                <p className="font-medium text-slate-700">Question 1: What is the primary purpose of Object-Oriented Programming (OOP)?</p>
                <div className="mt-2 space-y-2">
                  <label className="flex items-center">
                    <input type="radio" name="q1" className="mr-2" />
                    <span>Encapsulation</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="q1" className="mr-2" />
                    <span>Reusability</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="q1" className="mr-2" />
                    <span>Performance</span>
                  </label>
                </div>
              </div>

              <div className="border border-slate-200 rounded-lg p-4">
                <p className="font-medium text-slate-700">Question 2: In C++, which keyword is used to define a class that cannot be instantiated?</p>
                <div className="mt-2 space-y-2">
                  <label className="flex items-center">
                    <input type="radio" name="q2" className="mr-2" />
                    <span>virtual</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="q2" className="mr-2" />
                    <span>abstract</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="q2" className="mr-2" />
                    <span>static</span>
                  </label>
                </div>
              </div>

              <div className="border border-slate-200 rounded-lg p-4">
                <p className="font-medium text-slate-700">Question 3: What is the term for a function in C++ that has the same name but different parameters?</p>
                <div className="mt-2 space-y-2">
                  <label className="flex items-center">
                    <input type="radio" name="q3" className="mr-2" />
                    <span>Overloading</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="q3" className="mr-2" />
                    <span>Overriding</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="q3" className="mr-2" />
                    <span>Inheritance</span>
                  </label>
                </div>
              </div>

              <div className="border border-slate-200 rounded-lg p-4">
                <p className="font-medium text-slate-700">Question 4: Which OOP principle allows a derived class to provide a specific implementation of a base class method?</p>
                <div className="mt-2 space-y-2">
                  <label className="flex items-center">
                    <input type="radio" name="q4" className="mr-2" />
                    <span>Encapsulation</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="q4" className="mr-2" />
                    <span>Polymorphism</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="q4" className="mr-2" />
                    <span>Abstraction</span>
                  </label>
                </div>
              </div>

              <div className="border border-slate-200 rounded-lg p-4">
                <p className="font-medium text-slate-700">Question 5: In C++, what is used to control access to class members?</p>
                <div className="mt-2 space-y-2">
                  <label className="flex items-center">
                    <input type="radio" name="q5" className="mr-2" />
                    <span>Access specifiers</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="q5" className="mr-2" />
                    <span>Virtual functions</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="q5" className="mr-2" />
                    <span>Templates</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end mt-6">
              <button
                onClick={onBackClick}
                className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg mr-2 hover:bg-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={() => alert('Quiz submitted!')}
                className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
              >
                Submit Quiz
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default QuizModal;