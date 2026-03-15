import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { getAuthorApplications, approveAuthor, rejectAuthor } from "../../api/adminApi";

function AuthorApprovalsPage() {

  const [authors, setAuthors] = useState([]);

  const fetchApplications = async () => {
    try {
      const data = await getAuthorApplications();
      console.log(data);
      
      setAuthors(data.authors || []);
    } catch (err) {
      console.error("Failed to fetch applications", err);
    }
  };

  const handleApprove = async (id) => {
    await approveAuthor(id);
    fetchApplications();
  };

  const handleReject = async (id) => {
    await rejectAuthor(id);
    fetchApplications();
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  return (
    <>
      <Navbar />

      <div style={styles.page}>
        <h2>Author Applications</h2>

        {authors.length === 0 ? (
          <p>No pending applications</p>
        ) : (
          authors.map((a) => (
            <div key={a.id} style={styles.card}>
              <h3>{a.full_name}</h3>

              <p><strong>Biography:</strong> {a.biography}</p>
              <p><strong>Qualifications:</strong> {a.qualifications}</p>
              <p><strong>Experience:</strong> {a.experience}</p>

           <button
  style={styles.approve}
  onClick={() => handleApprove(a.id)}
>
  Approve
</button>

<button
  style={styles.reject}
  onClick={() => handleReject(a.id)}
>
  Reject
</button>
            </div>
          ))
        )}
      </div>
    </>
  );
}

const styles = {
  page: {
    padding: "40px",
    background: "#f4f6f8",
    minHeight: "100vh"
  },
  card: {
    background: "#fff",
    padding: "20px",
    marginTop: "20px",
    borderRadius: "8px",
    border: "1px solid #ddd"
  },
  approve: {
    marginRight: "10px",
    padding: "8px 14px",
    background: "green",
    color: "#fff",
    border: "none",
    borderRadius: "6px"
  },
  reject: {
    padding: "8px 14px",
    background: "red",
    color: "#fff",
    border: "none",
    borderRadius: "6px"
  }
};

export default AuthorApprovalsPage;