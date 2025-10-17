'use client';
function Faculty() {
  return (
    <>
      <title>ProxyProof | Faculty</title>
      <section className="container-fluid mt-3">
        <div className="container">
          <h1 className="center text fw-bold">Faculty</h1>
          <div className="card text font-bold text-xl my-3 p-4"
            onClick={() => { window.location.href = '/faculty/attendance'; }}>
            Create Attendance
          </div>
          <div className="card text font-bold text-xl my-3 p-4 mt-3"
            onClick={() => { window.location.href = '/faculty/verify'; }}>
            Verify Faces
          </div>
        </div>
      </section>
    </>
  );
}

export default Faculty;
