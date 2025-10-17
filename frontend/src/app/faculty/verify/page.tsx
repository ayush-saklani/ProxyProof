'use client';
import React, { useState, useEffect } from 'react';
import type { User } from '@/models/user.type';
import toast from 'react-hot-toast';
import { navit_server } from '@/utils/constant';

export default function Faculty() {
  const [students, setStudents] = useState<User[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [unverifiedCount, setUnverifiedCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchStudentData = async (pageNumber = 1) => {
    setLoading(true);
    const toastId = toast.loading('Fetching student data...');
    try {
      const response = await fetch(`${navit_server}/get_unverified_users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ page: pageNumber, page_limit: 10 }),
      });

      const data = await response.json();
      if (data.success) {
        setStudents(data.data.users || []);
        setUnverifiedCount(data.data.unverified_users || 0);
        setTotalPages(data.data.total_pages || 1);
        setPage(pageNumber);
      } else {
        toast.error(data.errors || 'Failed to fetch student data', { id: toastId });
      }
    } catch (err) {
      console.error('Error fetching students:', err);
      toast.error('Server error while fetching students', { id: toastId });
    } finally {
      toast.dismiss(toastId);
      setLoading(false);
    }
  };

  const verifyFace = async (toVerifyEmail: string, verify: boolean) => {
    const toastId = toast.loading(verify ? 'Verifying face...' : 'Rejecting face...');
    try {
      const facultyRaw = localStorage.getItem('user');
      const facultyEmail = facultyRaw ? (JSON.parse(facultyRaw) as { email?: string }).email : null;
      const response = await fetch(`${navit_server}/verify_face`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          email: facultyEmail, // faculty email
          to_verify_email: toVerifyEmail,
          verify: verify,
        }),
      });

      const data = await response.json();
      if (response.ok && data.statusCode === 200) {
        toast.success(data.message || 'Verification updated', { id: toastId });
        setStudents((prev) => prev.filter((user) => user.email !== toVerifyEmail));
        // fetchStudentData(page);
      } else {
        toast.error(data.errors || 'Failed to update verification', { id: toastId });
      }
    } catch (err) {
      console.error('Error verifying face:', err);
      toast.error('Internal server error', { id: toastId });
    } finally {
      toast.dismiss(toastId);
    }
  };

  useEffect(() => {
    // fetchStudentData(1);
  }, []);

  return (
    <>
      <title>ProxyProof | Faculty</title>

      <section className="container mx-auto mt-6 px-4">
        <div className="container">
          <h1 className="center text fw-bold">Verify Student Face</h1>
          <p className="center text fw-bold">Verify and approve students face.</p>
        </div>

        <div className="bg-white shadow-lg rounded-xl p-6 border border-slate-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-800">Unverified Students</h2>
              <p className="text-sm text-slate-500">Total Unverified: {unverifiedCount}</p>
            </div>
            <button
              disabled={loading}
              onClick={() => fetchStudentData(1)}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-sm font-medium py-2 px-4 rounded-lg shadow-sm"
            >
              {loading ? 'Loading...' : 'Fetch Students'}
            </button>
          </div>

          <div className="mt-6">
            {students.length === 0 ? (
              <div className="p-4 rounded-md bg-slate-50 border border-dashed border-slate-300 text-sm text-slate-500 text-center">
                No unverified students. Click “Fetch Students” to refresh.
              </div>
            ) : (
              <div className="grid gap-3">
                {students.map((user) => (
                  <div
                    key={user.id ?? user.email}
                    className="p-4 border border-slate-200 rounded-lg bg-white flex flex-col sm:flex-row items-center justify-between hover:bg-slate-50 transition"
                  >
                    <div className="flex items-center gap-3">
                      {user.profile_picture ? (
                        <img
                          src={user.profile_picture}
                          alt={user.first_name || 'avatar'}
                          className="w-12 h-12 rounded-full object-cover border border-slate-200"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-semibold">
                          {user.first_name?.[0]?.toUpperCase() || 'U'}
                        </div>
                      )}
                      <div className="text-sm">
                        <div className="font-medium text-slate-800">
                          {`${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email}
                        </div>
                        <div className="text-xs text-slate-500">{user.email}</div>
                        {user.roll_no && (
                          <div className="text-xs text-slate-500">Roll No: {user.roll_no}</div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2 mt-3 sm:mt-0">
                      <button
                        onClick={() => verifyFace(user.email, true)}
                        className="bg-green-600 hover:bg-green-700 text-white text-xs font-semibold py-1 px-3 rounded-md"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => verifyFace(user.email, false)}
                        className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold py-1 px-3 rounded-md"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-6">
              <button
                onClick={() => page > 1 && fetchStudentData(page - 1)}
                disabled={page === 1}
                className={`px-3 py-1 text-sm font-medium rounded-lg border ${page === 1
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
                  }`}
              >
                Prev
              </button>
              <span className="text-sm text-slate-600">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => page < totalPages && fetchStudentData(page + 1)}
                disabled={page === totalPages}
                className={`px-3 py-1 text-sm font-medium rounded-lg border ${page === totalPages
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
                  }`}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
