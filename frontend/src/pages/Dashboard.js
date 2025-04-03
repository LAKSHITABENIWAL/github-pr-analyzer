import React, { useEffect, useState } from "react";
import { format, subDays, subMonths, subYears, parseISO } from "date-fns";
import { Navigate } from "react-router-dom";
import PRFilters from "../components/PRFilters";
import PRAnalysis from "../components/PRAnalysis";

const Dashboard = ({ user }) => {
  const [pullRequests, setPullRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    sort: 'updated',
    status: 'all',
    assignee: 'all',
    dateRange: 'all'
  });

  useEffect(() => {
    const fetchPullRequests = async () => {
      try {
        const queryParams = new URLSearchParams({
          sort: filters.sort,
          status: filters.status,
          assignee: filters.assignee,
          dateRange: filters.dateRange
        });

        const response = await fetch(`http://localhost:3000/auth/pulls?${queryParams}`, {
          credentials: "include",
          headers: {
            'Accept': 'application/json',
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch pull requests');
        }
        
        const data = await response.json();
        setPullRequests(data);
      } catch (err) {
        console.error("Error fetching PRs:", err);
        setError("Failed to load pull requests. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPullRequests();
  }, [filters]);

  const filterPullRequests = (prs) => {
    let filteredPRs = [...prs];

    // Filter by status
    if (filters.status !== 'all') {
      filteredPRs = filteredPRs.filter(pr => pr.state === filters.status);
    }

    // Filter by assignee
    if (filters.assignee === 'self') {
      filteredPRs = filteredPRs.filter(pr => 
        pr.assignees.some(assignee => assignee.login === user.login)
      );
    }

    // Filter by date range
    if (filters.dateRange !== 'all') {
      const now = new Date();
      let cutoffDate;

      switch (filters.dateRange) {
        case 'today':
          cutoffDate = subDays(now, 1);
          break;
        case 'week':
          cutoffDate = subDays(now, 7);
          break;
        case 'month':
          cutoffDate = subMonths(now, 1);
          break;
        case 'year':
          cutoffDate = subYears(now, 1);
          break;
        default:
          cutoffDate = null;
      }

      if (cutoffDate) {
        filteredPRs = filteredPRs.filter(pr => 
          parseISO(pr.created_at) >= cutoffDate
        );
      }
    }

    // Sort PRs
    filteredPRs.sort((a, b) => {
      switch (filters.sort) {
        case 'created':
          return new Date(b.created_at) - new Date(a.created_at);
        case 'comments':
          return b.comments - a.comments;
        case 'updated':
        default:
          return new Date(b.updated_at) - new Date(a.updated_at);
      }
    });

    return filteredPRs;
  };

  const getPRStatusColor = (state) => {
    return state === 'open' ? '#2ea44f' : '#6f42c1';
  };

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'MMM d, yyyy HH:mm');
  };

  // If user is not authenticated, redirect to login page
  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (error) {
    return <div style={styles.error}>{error}</div>;
  }

  const filteredPRs = filterPullRequests(pullRequests);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.profile}>
          <img src={user.avatar_url} alt="Profile" style={styles.avatar} />
          <div style={styles.userInfo}>
            <h2 style={styles.userName}>{user.name || user.login}</h2>
            <a
              href={`https://github.com/${user.login}`}
              target="_blank"
              rel="noopener noreferrer"
              style={styles.githubLink}
            >
              @{user.login}
            </a>
          </div>
        </div>
      </div>

      <PRFilters filters={filters} onFilterChange={setFilters} />

      <div style={styles.content}>
        <div style={styles.statsHeader}>
          <h3 style={styles.sectionTitle}>Pull Requests</h3>
          <span style={styles.prCount}>
            Showing {filteredPRs.length} of {pullRequests.length} PRs
          </span>
        </div>

        {loading ? (
          <div style={styles.loading}>Loading pull requests...</div>
        ) : filteredPRs.length > 0 ? (
          <div style={styles.prList}>
            {filteredPRs.map((pr) => (
              <div key={pr.id} style={styles.prCard}>
                <div style={styles.prHeader}>
                  <a
                    href={pr.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={styles.prTitle}
                  >
                    {pr.title}
                  </a>
                  <span
                    style={{
                      ...styles.prStatus,
                      backgroundColor: getPRStatusColor(pr.state),
                    }}
                  >
                    {pr.state}
                  </span>
                </div>
                <div style={styles.prDetails}>
                  <span>Repository: {pr.base.repo.full_name}</span>
                  <span>Created: {formatDate(pr.created_at)}</span>
                  <span>Updated: {formatDate(pr.updated_at)}</span>
                  <span>Comments: {pr.comments}</span>
                </div>
                <PRAnalysis pr={pr} />
              </div>
            ))}
          </div>
        ) : (
          <div style={styles.noPRs}>No pull requests found matching your filters</div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  header: {
    marginBottom: "30px",
    padding: "20px",
    backgroundColor: "#f6f8fa",
    borderRadius: "8px",
    border: "1px solid #e1e4e8",
  },
  profile: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },
  avatar: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    border: "2px solid #e1e4e8",
  },
  userInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },
  userName: {
    margin: 0,
    fontSize: "24px",
    color: "#24292e",
  },
  githubLink: {
    color: "#586069",
    textDecoration: "none",
    "&:hover": {
      color: "#0366d6",
    },
  },
  content: {
    backgroundColor: "white",
    borderRadius: "8px",
    border: "1px solid #e1e4e8",
    padding: "20px",
  },
  sectionTitle: {
    margin: "0 0 20px 0",
    color: "#24292e",
    fontSize: "20px",
  },
  prList: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  prCard: {
    padding: "15px",
    backgroundColor: "#f6f8fa",
    borderRadius: "6px",
    border: "1px solid #e1e4e8",
  },
  prHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
  },
  prTitle: {
    color: "#0366d6",
    textDecoration: "none",
    fontSize: "16px",
    fontWeight: "600",
    "&:hover": {
      textDecoration: "underline",
    },
  },
  prStatus: {
    padding: "4px 8px",
    borderRadius: "12px",
    color: "white",
    fontSize: "12px",
    fontWeight: "600",
    textTransform: "capitalize",
  },
  prDetails: {
    display: "flex",
    gap: "15px",
    color: "#586069",
    fontSize: "14px",
  },
  loading: {
    textAlign: "center",
    padding: "20px",
    color: "#586069",
  },
  error: {
    textAlign: "center",
    padding: "20px",
    color: "#cb2431",
    backgroundColor: "#ffeef0",
    borderRadius: "6px",
    margin: "20px",
  },
  noPRs: {
    textAlign: "center",
    padding: "40px",
    color: "#586069",
    backgroundColor: "#f6f8fa",
    borderRadius: "6px",
  },
  statsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  prCount: {
    fontSize: '14px',
    color: '#586069',
  },
};

export default Dashboard;
