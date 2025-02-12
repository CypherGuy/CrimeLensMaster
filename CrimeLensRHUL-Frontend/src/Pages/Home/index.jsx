import 'regenerator-runtime/runtime';
import { useEffect, useState, useContext } from 'react';
import { AuthContext } from "../../Providers/AuthProvider";
import AOS from 'aos';
import 'aos/dist/aos.css';
import FloatingButton from '../FloatingButton/FloatingButton';
import SidePanel from '/src/Shared/SidePanel/SidePanel.jsx';
import Peter from '/src/Pages/Home/Components/Peter.jsx';
import SpeechListener from '/src/Pages/Home/Components/SpeechListener.jsx';  // Adjust the path if needed

export default function Home() {
  useEffect(() => {
    AOS.init({
      duration: 2000,
      once: true,
    });
  }, []);

  const { user } = useContext(AuthContext);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [autoCall, setAutoCall] = useState(false);
  const [reports, setReports] = useState([]);
  const [fetchError, setFetchError] = useState(false);
  const [selectedReportType, setSelectedReportType] = useState('unverified');

  // Fetch reports based on the selected type
  useEffect(() => {
    const fetchReports = async () => {
      setReports([]);
      try {
        const endpoint = selectedReportType === 'verified'
          ? 'http://localhost:23232/api/get-verified-reports'
          : 'http://localhost:23232/api/get-unverified-reports';

        const response = await fetch(endpoint, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch reports');
        }

        const data = await response.json();
        console.log(data);
        if (selectedReportType === 'verified') {
          data.reportData = data.reportData.filter(report => report.verified);
        } else {
          data.reportData = data.reportData.filter(report => !report.verified);
        }
        setReports(data.reportData);
        setFetchError(false);
      } catch (error) {
        console.error('Error:', error);
        setFetchError(true);
      }
    };

    fetchReports();
  }, [selectedReportType]);

  const handleFloatingButtonClick = () => {
    setIsSidePanelOpen(true);
  };

  const handleCloseSidePanel = () => {
    setIsSidePanelOpen(false);
    setAutoCall(false);
  };

  const handleTriggerSOS = () => {
    setIsSidePanelOpen(true);
    setAutoCall(true);
  };
  

  return (
    <div className="min-h-screen w-full text-white flex justify-center bg-gradient-to-b from-[#1A1B1D] to-[#343738]">
      <div className="max-w-full w-full flex flex-col md:flex-row gap-4 px-4">
        {/* Left Column: Peter */}
        <div className="w-full md:w-1/4 md:pr-4 md:sticky md:top-0 md:h-screen flex flex-col" data-aos="fade-right">
          <Peter setIsSidePanelOpen={setIsSidePanelOpen} setAutoCall={setAutoCall} />
        </div>

        {/* Middle Column: Reports */}
        <div className={`flex-1 max-w-2xl border-x border-y border-white transition-all ${fetchError ? 'animate-shake' : ''}`}>
          <div className="p-4 border-b border-white sticky top-0 z-10">
            <div className="flex flex-row space-x-4">
              <h1
                className="text-xl font-bold cursor-pointer"
                style={{ borderBottom: selectedReportType === 'verified' ? '2px solid blue' : 'none' }}
                onClick={() => {
                  setReports([]);
                  setSelectedReportType('verified');
                }}
              >
                Verified
              </h1>
              <h1
                className="text-xl font-bold cursor-pointer"
                style={{ borderBottom: selectedReportType === 'unverified' ? '2px solid blue' : 'none' }}
                onClick={() => {
                  setReports([]);
                  setSelectedReportType('unverified');
                }}
              >
                Unverified
              </h1>
            </div>
          </div>

          <div className="divide-y divide-white h-[calc(100vh-6rem)] md:h-[calc(100vh-4rem)] overflow-y-auto">
            {reports.length > 0 ? (
              reports.map((item, index) => (
                <div key={index} className="p-4 hover:bg-gray-800 transition-colors">
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{item.name}</span>
                        <span className="text-gray-500">@{item.createdBy}</span>
                        <span className="text-gray-500">{item.location}</span>
                        <span className="text-gray-500">{item.created_at}</span>
                      </div>
                      <p className="mt-2">{item.description}</p>
                      {item.mediaLinks?.length > 0 && (
                        <div className="mt-2">
                          {item.mediaLinks.map((link, index) => (
                            <img key={index} src={link} alt="Media" className="w-full h-64 object-cover rounded-lg" />
                          ))}
                        </div>
                      )}
                      <div className="flex justify-between mt-4 text-gray-500 max-w-md">
                        <button
                          className="hover:text-blue-500 transition-transform hover:scale-105 active:scale-95"
                          onClick={async () => {
                            try {
                              const response = await fetch('http://localhost:23232/api/like-report', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                  reportId: item.id,
                                  userId: user.uid,
                                }),
                              });
                              if (!response.ok) {
                                throw new Error('Error liking report');
                              }
                              const data = await response.json();
                              setReports((prevReports) =>
                                prevReports.map((report) =>
                                  report.id === item.id
                                    ? { ...report, likes: data.likes, verified: data.verified }
                                    : report
                                )
                              );
                            } catch (err) {
                              console.error(err.message);
                              // Optionally display an error toast here
                            }
                          }}
                        >
                          <img src="/lik.svg" alt="Like" className="stroke-red-600 fill-red-600" />
                          <span>{item.likes}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center" data-aos="fade-up">
                <h1 className="font-bold text-2xl">No Reports</h1>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Search & Trending */}
        <div className="w-full lg:w-1/4 lg:pl-4 lg:sticky lg:top-0 lg:h-screen" data-aos="fade-left">
          <div className="mt-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                className="w-full rounded-full bg-gray-800 py-3 pl-6 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="absolute right-4 top-3">
                <svg
                  className="w-5 h-5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  ></path>
                </svg>
              </div>
            </div>
            <div className="rounded-2xl mt-4 p-4 bg-gray-800">
              <h2 className="text-xl font-bold mb-4">What's happening</h2>
              {reports.slice(0, 5).map((item, index) => (
                <div key={index} className="py-3 hover:bg-gray-700/50 rounded-lg px-2 cursor-pointer transition-colors">
                  <div className="text-sm text-gray-500">Trending #{index + 1}</div>
                  <div className="font-bold">{item.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <FloatingButton onClick={handleFloatingButtonClick} />

      {/* Side Panel */}
      <SidePanel
        isOpen={isSidePanelOpen}
        onClose={handleCloseSidePanel}
        autoCall={autoCall}
        onAutoCallComplete={() => setAutoCall(false)}
      />

      {/* Discreet Speech Listener */}
      <SpeechListener onTriggerSOS={handleTriggerSOS} />
    </div>
  );
}
