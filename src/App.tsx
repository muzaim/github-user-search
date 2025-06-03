import { useState, useEffect } from 'react';
import Modal from './components/UserModal';
import type { UserDetail, GitHubUser, Repo } from './types/user';

export default function App() {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState<GitHubUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingRepos, setLoadingRepos] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [userDetails, setUserDetails] = useState<Record<string, UserDetail>>({});

  const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;

  const fetchUserDetails = async (username: string) => {
    try {
      const res = await fetch(`https://api.github.com/users/${username}`, {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
        },
      });
      const data = await res.json();
      return {
        followers: data.followers,
        following: data.following,
      };
    } catch {
      return {
        followers: 0,
        following: 0,
      };
    }
  };

  useEffect(() => {
    if (users.length === 0) return;

    users.forEach(async (user) => {
      if (!userDetails[user.login]) {
        const details = await fetchUserDetails(user.login);
        setUserDetails(prev => ({ ...prev, [user.login]: details }));
      }
    });
  }, [users]);


  // Pagination state
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    if (query.trim() === '') {
      setUsers([]);
      setTotalCount(0);
      setPage(1);
      return;
    }

    setLoadingUsers(true);

    const timeoutId = setTimeout(() => {
      fetch(`https://api.github.com/search/users?q=${query}&per_page=6&page=${page}`, {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setUsers(data.items || []);
          setTotalCount(data.total_count || 0);
          setLoadingUsers(false);
        })
        .catch(() => {
          setUsers([]);
          setTotalCount(0);
          setLoadingUsers(false);
        });
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [query, page]);

  const openModalWithRepos = (username: string) => {
    setSelectedUser(username);
    setModalOpen(true);
    setLoadingRepos(true);

    fetch(`https://api.github.com/users/${username}/repos`, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setRepos(data || []);
        setLoadingRepos(false);
      })
      .catch(() => {
        setRepos([]);
        setLoadingRepos(false);
      });
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedUser('');
    setRepos([]);
  };

  // Reset page ketika query berubah
  const onQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setPage(1);
  };

  const totalPages = Math.ceil(totalCount / 5);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-gray-800 p-8 rounded-2xl shadow-xl">
        <h1 className="text-2xl font-semibold mb-6 text-center">GitHub User Search</h1>

        <div className="relative w-full">
          <input
            type="text"
            value={query}
            onChange={onQueryChange}
            placeholder="Type to search`..."
            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 hover:cursor-pointer"
              aria-label="Clear search input"
              type="button"
            >
              &#x2715;
            </button>
          )}
        </div>


        <div className="mt-6 space-y-4">
          {loadingUsers && <p className="text-center text-gray-400">Loading users...</p>}

          {!loadingUsers && users.length > 0 && (
            <>
              <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {users.map((user) => {
                  const details = userDetails[user.login] || { followers: 0, following: 0 };

                  return (
                    <li
                      key={user.id}
                      onClick={() => openModalWithRepos(user.login)}
                      className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-xl p-6 cursor-pointer shadow-lg border border-gray-600 hover:scale-[1.02] transition transform duration-300"
                    >
                      <div className="flex flex-col items-center text-center">
                        <img
                          src={user.avatar_url}
                          alt={user.login}
                          className="w-24 h-24 rounded-full border-4 border-white shadow-md"
                        />
                        <h3 className="mt-4 text-xl font-semibold text-white">{user.login}</h3>

                        <div className="flex justify-center gap-6 mt-3 text-sm text-gray-300">
                          <div className="flex flex-col items-center">
                            <span className="font-bold text-white">{details.followers}</span>
                            <span className="text-xs">Followers</span>
                          </div>
                          <div className="flex flex-col items-center">
                            <span className="font-bold text-white">{details.following}</span>
                            <span className="text-xs">Following</span>
                          </div>
                        </div>

                        <button className="mt-4 px-4 py-1 rounded-full bg-blue-500 text-white text-sm hover:bg-blue-600 transition">
                          View Repos
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>



              {/* Pagination Controls */}
              <div className="flex justify-center gap-4 mt-6">
                <button
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1}
                  className={`px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed`}
                >
                  Previous
                </button>

                <span className="flex items-center text-gray-300">
                  Page {page} of {totalPages || 1}
                </span>

                <button
                  onClick={() => setPage((p) => (p < totalPages ? p + 1 : p))}
                  disabled={page === totalPages || totalPages === 0}
                  className={`px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed`}
                >
                  Next
                </button>
              </div>
            </>
          )}

          {!loadingUsers && query && users.length === 0 && (
            <p className="text-gray-400 text-center mt-4">
              No results for "<strong>{query}</strong>"
            </p>
          )}
        </div>

        <Modal show={modalOpen} onClose={closeModal} title={`Repositori ${selectedUser}`}>
          {loadingRepos ? (
            <p className="text-center text-gray-400">Loading repos...</p>
          ) : repos.length > 0 ? (
            <ul className="space-y-2">
              {repos.map((repo) => (
                <li
                  key={repo.id}
                  className="bg-gray-700 p-3 rounded-md border border-gray-600"
                >
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline font-medium"
                  >
                    {repo.name}
                  </a>
                  <p className="text-sm text-gray-400">
                    {repo.description || 'No description'}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-400">Tidak ada repositori ditemukan.</p>
          )}
        </Modal>
      </div>
    </div>
  );
}
