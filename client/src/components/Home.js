import React, { useState, useEffect, useMemo, useContext } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import queryString from 'query-string';
import NotificationContext from '../NotificationContext';
import { useLayoutEffect } from 'react';

const defaultQueryParams = { page: 1, search: '' };

const getQueryParams = (url) => {
  const query = queryString.parse(url);
  return {
    pageParam: parseInt(query.page, 10),
    searchParam: query.search,
  };
};

const generateQueryString = (page, search) => {
  return '?' + queryString.stringify({ page, search });
};

const Home = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [search, setSearch] = useState('');
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);
  const { setNotification } = useContext(NotificationContext);
  const history = useHistory();
  const location = useLocation();

  useLayoutEffect(() => {
    const query = queryString.parse(location.search);
    setHasPreviousPage(
      (parseInt(query.page, 10) || defaultQueryParams.page) > 1
    );
    setSearch(query.search || defaultQueryParams.search);
  }, [location.search]);

  useEffect(() => {
    const fetchQuizzes = async (query) => {
      try {
        const res = await fetch('/api/quiz/search' + query, {
          method: 'GET',
        });

        const resJSON = await res.json();
        if (resJSON.err) {
          return setNotification({ body: resJSON.err });
        }

        setHasNextPage(!resJSON.isLastPage);
        setQuizzes(resJSON.quizzes);
      } catch (err) {
        return setNotification({ body: 'Failed to load quizzes' });
      }
    };

    fetchQuizzes(location.search);

    // scroll to top of page
    window.scrollTo(0, 0);
  }, [location.search, setNotification]);

  const handlePageChange = (e) => {
    let diff = 0;
    if (e.target.dataset.direction === 'previous') {
      diff = -1;
    }
    if (e.target.dataset.direction === 'next') {
      diff = 1;
    }
    const { pageParam, searchParam } = getQueryParams(location.search);
    const newQueryString = generateQueryString(
      (pageParam || defaultQueryParams.page) + diff,
      searchParam
    );
    history.push('/' + newQueryString);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    // don't append search parameter to url if it's empty
    const searchParam = search.length !== 0 ? search : undefined;
    // reset to first page when changing search query
    const newQueryString = generateQueryString(1, searchParam);
    history.push('/' + newQueryString);
  };

  const quizListItems = useMemo(() => {
    return quizzes.map((quiz) => {
      const imageURL =
        `https://res.cloudinary.com/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload/` +
        quiz.image;

      return (
        <div key={quiz.id} className="col">
          <div className="card h-100">
            <img
              src={quiz.image ? imageURL : '/imgplaceholder.png'}
              alt="quiz"
              className="card-img-top"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/imgplaceholder.png';
              }}
            />
            <div className="card-body">
              <h4 className="card-title">{quiz.title}</h4>
              {quiz.description && (
                <p className="card-text text-preline mb-1">
                  {quiz.description}
                </p>
              )}
              <small className="d-block text-muted mb-2">
                Taken {quiz['times_finished']}{' '}
                {quiz['times_finished'] === 1 ? 'time' : 'times'}
              </small>
            </div>
            <div className="p-3">
              <Link
                to={'/quiz/' + quiz.id}
                className="btn btn-primary rounded-pill px-5"
              >
                Open
              </Link>
            </div>
          </div>
        </div>
      );
    });
  }, [quizzes]);

  return (
    <div className="container-fluid">
      <nav className="d-flex flex-column flex-md-row mx-2 my-3 justify-content-between">
        <Link
          to="/create-quiz"
          className="btn btn-primary rounded-pill px-5 mb-3 mb-md-0"
        >
          Create Quiz
        </Link>
        <form onSubmit={handleSearchSubmit} className="input-group w-auto">
          <input
            type="search"
            value={search}
            onChange={handleSearchChange}
            className="form-control"
            placeholder="Search..."
            style={{ minWidth: 0 }}
          />
          <button className="btn btn-outline-secondary" type="submit">
            Search
          </button>
        </form>
      </nav>
      <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 row-cols-xxl-4 mb-3 mx-2 g-4">
        {quizListItems}
      </div>
      <div className="d-flex justify-content-between mx-2 mb-3">
        <button
          onClick={handlePageChange}
          data-direction="previous"
          className="btn btn-primary rounded-pill px-4"
          disabled={!hasPreviousPage}
        >
          Prev
        </button>
        <button
          onClick={handlePageChange}
          data-direction="next"
          className="btn btn-primary rounded-pill px-4"
          disabled={!hasNextPage}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Home;
