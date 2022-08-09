import React, { useState, useEffect, useRef, useMemo, useContext } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import queryString from 'query-string';
import NotificationContext from '../NotificationContext';

const defaultQueryParams = { page: 1, search: '' };

const Home = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [queryParams, setQueryParams] = useState(defaultQueryParams);
    const [search, setSearch] = useState('');
    const [isLastPage, setIsLastPage] = useState(true);
    const firstPageRender = useRef(true);
    const firstQueryParamsEffect = useRef(true);
    const { setNotification } = useContext(NotificationContext);
    const history = useHistory();
    const location = useLocation();

    // on location query string change or first render, fetch quizzes from the server
    useEffect(() => {
        const fetchQuizzes = async (query) => {
            try {
                const res = await fetch('/api/quiz/search' + query, {
                    method: 'GET'
                });

                const resJSON = await res.json();
                // check if an error was returned
                if (resJSON.err) {
                    return setNotification({ body: resJSON.err });
                }

                setIsLastPage(resJSON.isLastPage);
                setQuizzes(resJSON.quizzes);
            } catch (err) {
                return setNotification({ body: 'Failed to load quizzes' });
            }
        };

        fetchQuizzes(location.search);

        // scroll to top of page
        window.scrollTo(0, 0);

        // if user navigates to home page from the url bar with query params, set the local query state
        // i.e. when the first page render already has a query string, instead of user setting it though page buttons
        if (firstPageRender.current) {
            const query = queryString.parse(location.search);
            if (query.page || query.search) {
                setQueryParams({
                    page: parseInt(query.page, 10) || defaultQueryParams.page,
                    search: query.search || defaultQueryParams.search
                });
            }

            firstPageRender.current = false;
        }

    }, [location.search]);

    useEffect(() => {
        // don't run on queryParams initialisation, no actions needed there
        if (firstQueryParamsEffect.current) {
            firstQueryParamsEffect.current = false;
            return;
        }

        // if url already matches the new query state, exit the function and don't history.push
        // this skips setting the query sting in the url, as it is already set
        // this happens when a user visits the home page from the url bar with already set query params,
        // instead of changing them through the buttons on the page
        // note: if search was specified without a page number, continue the function to set the proper url
        const currentURLQuery = queryString.parse(location.search);
        if (parseInt(currentURLQuery.page, 10) === queryParams.page &&
            (currentURLQuery.search === queryParams.search ||
                (!currentURLQuery.search && queryParams.search === defaultQueryParams.search))) {
            return;
        }

        // construct query string to append to the url
        let newQueryObj = {};

        // home page always has a page number but doesn't necessarily have a search string,
        // indicated by an empty string
        newQueryObj.page = queryParams.page;
        if (queryParams.search) {
            newQueryObj.search = queryParams.search;
        }

        const newQueryString = '?' + queryString.stringify(newQueryObj);

        // update the url to match the query params stored in the state
        // done to allow backward and forward navigation from the browser
        history.push('/' + newQueryString);
    }, [queryParams]);

    const handlePageChange = (e) => {
        let diff = 0;
        if (e.target.dataset.direction === 'previous') {
            diff = -1;
        }
        if (e.target.dataset.direction === 'next') {
            diff = 1;
        }

        setQueryParams((obj) => {
            return {
                page: obj.page + diff,
                search: obj.search
            };
        });
    };

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();

        // reset to first page when changing search query
        setQueryParams({ page: 1, search });
    };

    const quizListItems = useMemo(() => {
        return quizzes.map((quiz) => {
            const imageURL = `https://res.cloudinary.com/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload/` + quiz.image;

            return (
                <div key={quiz.id} className="col">
                    <div className="card h-100">
                        <img
                            src={(quiz.image) ? imageURL : '/imgplaceholder.png'}
                            alt="quiz"
                            className="card-img-top"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/imgplaceholder.png';
                            }}
                        />
                        <div className="card-body">
                            <h4 className="card-title">{quiz.title}</h4>
                            {(quiz.description) && (
                                <p className="card-text text-preline mb-1">{quiz.description}</p>
                            )}
                            <small className="d-block text-muted mb-2">
                                Taken {quiz['times_finished']} {(quiz['times_finished'] === 1) ? 'time' : 'times'}
                            </small>
                        </div>
                        <div className="p-3">
                            <Link to={'/quiz/' + quiz.id} className="btn btn-primary rounded-pill px-5">
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
                <Link to="/create-quiz" className="btn btn-primary rounded-pill px-5 mb-3 mb-md-0">
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
                    <button className="btn btn-outline-secondary" type="submit">Search</button>
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
                    disabled={(queryParams.page > 1) ? false : true}
                >Prev</button>
                <button
                    onClick={handlePageChange}
                    data-direction="next"
                    className="btn btn-primary rounded-pill px-4"
                    disabled={isLastPage}
                >Next</button>
            </div>
        </div>
    );
};

export default Home;