import React, { useState, useEffect } from "react";
import styles from "./styles.module.scss";
import { Button } from "antd";

const FetchRepositories = () => {
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [newName, setNewName] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);

  useEffect(() => {
    const fetchRepositories = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://671e6b881dfc42991982408a.mockapi.io/items?page=${page}&limit=1`
        );
        if (!response.ok) {
          const errorMessage = `Error: ${response.status} ${response.statusText}`;
          console.error(errorMessage);
          setError(new Error(errorMessage));
          return;
        }

        const data = await response.json();
        setRepositories((prev) => [...prev, ...data]);
        setHasMore(data.length > 0);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchRepositories();
  }, [page]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (hasMore && isAutoScrolling) {
        setPage((prevPage) => prevPage + 1);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [hasMore, isAutoScrolling]);

  const deleteRepository = (id) => {
    setRepositories(repositories.filter((repo) => repo.id !== id));
  };

  const startEditing = (id, currentName) => {
    setEditingId(id);
    setNewName(currentName);
  };

  const confirmEdit = (id) => {
    setRepositories(
      repositories.map((repo) =>
        repo.id === id ? { ...repo, name: newName } : repo
      )
    );
    setEditingId(null);
    setNewName("");
  };

  useEffect(() => {
    if (isAutoScrolling) {
      smoothScrollToBottom();
    }
  }, [repositories, isAutoScrolling]);

  if (error) return <div>Error: {error.message}</div>;

  const toggleAutoScroll = () => {
    setIsAutoScrolling((prev) => !prev);
  };

  return (
    <div className={styles.div}>
      <h1>Repositories</h1>
      <ul id="repository-list">
        {repositories.map((repo, index) => (
          <li key={index} className={styles.fadeIn}>
            {editingId === repo.id ? (
              <div>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
                <button onClick={() => confirmEdit(repo.id)}>
                  Подтвердить
                </button>
              </div>
            ) : (
              <div>
                <span>{repo.name}</span>
                <button onClick={() => deleteRepository(repo.id)}>
                  Delete
                </button>
                <button onClick={() => startEditing(repo.id, repo.name)}>
                  Edit
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
      <Button
        className={styles.scrollButton}
        onClick={toggleAutoScroll}
        type="primary"
      >
        {isAutoScrolling ? "остановить " : "продолжить"}
      </Button>
    </div>
  );
};

const smoothScrollToBottom = () => {
  const scrollHeight = document.documentElement.scrollHeight;
  const clientHeight = window.innerHeight;
  const targetScroll = scrollHeight - clientHeight;

  const scrollStep = Math.max(1, (targetScroll - window.scrollY) / 100);

  const scroll = () => {
    if (window.scrollY < targetScroll) {
      window.scrollBy(0, scrollStep);
      requestAnimationFrame(scroll);
    }
  };

  requestAnimationFrame(scroll);
};

export default FetchRepositories;

//знаю, что можно было намного лучше.
//я сделал именно так, как вы говорили не делать.
// начал писать код в 8 часов вечера 31 октября,
// но да ладно, лучше сделать хоть что-то :)
// и еще,  было написано , что удаление и редактирование должно быть локально
//мне показалось странным, поэтому если имелось в виду обращение к серверу - без проблем.
// не знаю, что произошло с TS, можете глянуть сколько всего я там скачал , чтобы он работал, но безуспешно.
