'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import * as XLSX from 'xlsx';

interface FormSubmission {
  _id: string;
  websiteSlug: string;
  websiteId: string;
  websiteName: string;
  websiteOwnerEmail: string;
  formData: Record<string, string>;
  submittedAt: string;
  read: boolean;
}

export default function SubmissionsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWebsite, setSelectedWebsite] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    } else if (user) {
      fetchSubmissions();
    }
  }, [user, authLoading, router]);

  const fetchSubmissions = async () => {
    try {
      const res = await fetch('/api/submissions', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setSubmissions(data.submissions || []);
      }
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleReadStatus = async (submissionId: string, currentStatus: boolean) => {
    try {
      const res = await fetch('/api/submissions', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ submissionId, read: !currentStatus })
      });
      
      if (res.ok) {
        setSubmissions(prev => prev.map(sub => 
          sub._id === submissionId ? { ...sub, read: !currentStatus } : sub
        ));
      }
    } catch (error) {
      console.error('Error updating read status:', error);
    }
  };

  const exportToExcel = () => {
    const filteredData = selectedWebsite === 'all' 
      ? submissions 
      : submissions.filter(s => s.websiteSlug === selectedWebsite);

    const excelData = filteredData.map(sub => ({
      'Website Name': sub.websiteName,
      'Submitted Date': new Date(sub.submittedAt).toLocaleString(),
      'Status': sub.read ? 'Read' : 'Unread',
      ...sub.formData
    }));

    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Submissions');
    XLSX.writeFile(wb, `submissions-${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const uniqueWebsites = Array.from(new Set(submissions.map(s => s.websiteSlug)));
  
  const filteredSubmissions = selectedWebsite === 'all'
    ? submissions
    : submissions.filter(s => s.websiteSlug === selectedWebsite);

  const paginatedSubmissions = filteredSubmissions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredSubmissions.length / itemsPerPage);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading submissions...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
                Form Submissions
              </h1>
              <p className="text-gray-600">
                Total: {filteredSubmissions.length} submissions
                {filteredSubmissions.filter(s => !s.read).length > 0 && (
                  <span className="ml-2 px-3 py-1 bg-red-500 text-white text-sm rounded-full">
                    {filteredSubmissions.filter(s => !s.read).length} Unread
                  </span>
                )}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <select
                value={selectedWebsite}
                onChange={(e) => {
                  setSelectedWebsite(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-4 py-2 border-2 border-purple-300 rounded-lg focus:outline-none focus:border-purple-600 transition"
              >
                <option value="all">All Websites</option>
                {uniqueWebsites.map(slug => (
                  <option key={slug} value={slug}>{slug}</option>
                ))}
              </select>
              
              <button
                onClick={exportToExcel}
                disabled={filteredSubmissions.length === 0}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
              >
                📊 Export Excel
              </button>
            </div>
          </div>

          {paginatedSubmissions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-500">No submissions yet</p>
            </div>
          ) : (
            <>
              {/* Mobile View */}
              <div className="sm:hidden space-y-4">
                {paginatedSubmissions.map((submission) => (
                  <div
                    key={submission._id}
                    className={`border-2 rounded-xl p-4 ${
                      submission.read ? 'bg-gray-50 border-gray-200' : 'bg-blue-50 border-blue-300'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-bold text-lg text-gray-800">
                        {submission.websiteName}
                      </h3>
                      <button
                        onClick={() => toggleReadStatus(submission._id, submission.read)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          submission.read
                            ? 'bg-gray-200 text-gray-700'
                            : 'bg-red-500 text-white'
                        }`}
                      >
                        {submission.read ? 'Read' : 'Unread'}
                      </button>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      {Object.entries(submission.formData).map(([key, value]) => (
                        <div key={key}>
                          <span className="font-semibold text-gray-600">{key}:</span>{' '}
                          <span className="text-gray-800">{value}</span>
                        </div>
                      ))}
                      <div className="text-gray-500 text-xs mt-3">
                        {new Date(submission.submittedAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop View */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                      <th className="px-4 py-3 text-left rounded-tl-lg">Website</th>
                      <th className="px-4 py-3 text-left">Submission Details</th>
                      <th className="px-4 py-3 text-left">Date</th>
                      <th className="px-4 py-3 text-center rounded-tr-lg">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedSubmissions.map((submission, index) => (
                      <tr
                        key={submission._id}
                        className={`border-b ${
                          submission.read ? 'bg-white' : 'bg-blue-50'
                        } hover:bg-gray-100 transition`}
                      >
                        <td className="px-4 py-4 font-semibold text-gray-800">
                          {submission.websiteName}
                          <div className="text-xs text-gray-500">
                            /{submission.websiteSlug}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="space-y-1">
                            {Object.entries(submission.formData).map(([key, value]) => (
                              <div key={key} className="text-sm">
                                <span className="font-semibold text-gray-600">{key}:</span>{' '}
                                <span className="text-gray-800">{value}</span>
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-600">
                          {new Date(submission.submittedAt).toLocaleString()}
                        </td>
                        <td className="px-4 py-4 text-center">
                          <button
                            onClick={() => toggleReadStatus(submission._id, submission.read)}
                            className={`px-4 py-2 rounded-lg font-semibold text-sm transition ${
                              submission.read
                                ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                : 'bg-red-500 text-white hover:bg-red-600'
                            }`}
                          >
                            {submission.read ? '✓ Read' : '✉️ Unread'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-6">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ← Previous
                  </button>
                  
                  <span className="px-4 py-2 text-gray-700">
                    Page {currentPage} of {totalPages}
                  </span>
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
