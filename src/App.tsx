import './App.css'
import { useEffect, useState } from "react";
import Spinner from "./components/Spinner/Spinner";

export type TAdviceSlip = {
    slip: {
        id: number,
        advice: string
    }
}

function App() {
    const [data, setData] = useState<TAdviceSlip | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const slip = data?.slip?.advice;

    /*
        * 1. The fetchHandler function creates a new AbortController and obtains its signal property.
        *
        * 2. Before making a new fetch request, the loading state is set to true to indicate
        *    that the data is being fetched.
        *
        * 3. The previous fetch request is canceled by calling abortController.abort() in the
        *    cleanup function returned from fetchHandler.
        *
        * 4. The loading state is set to false in both the success and error scenarios.
        *
        * 5. A loading message is displayed while the data is being fetched.
        *
        * 6. If an error occurs, the error message is displayed.
        *
        * 7. By canceling the previous request, you avoid unnecessary processing and improve the
        *   responsiveness of your application.
    */

    const fetchHandler = () => {
        /*
            To improve the performance and make the fetching process faster when clicking the refresh button,
            you can make use of the AbortController and signal property to cancel the previous fetch request
            before initiating a new one.
        */
        const abortController = new AbortController();
        const signal = abortController.signal;

        setLoading(true);
        setError(null);

        fetch('https://api.adviceslip.com/advice', { signal })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`This is an HTTP error: The status is ${response.status}`);
                }
                return response.json();
            })
            .then((actualData) => {
                setData(actualData);
                setError(null);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setData(null);
                setLoading(false);
            });

        return () => abortController.abort(); // Clean up function to cancel the previous request
    };

    useEffect(() => {
        fetchHandler();
    }, []);

    return (
        <>
            <h1 style={{ fontStyle: 'italic' }}>
                <span className={'title'} style={{ color: '#9551ff', fontStyle: 'normal' }}>
                  Advice Slip App
                </span>
            </h1>
            {loading ? (
                <Spinner />
            ) : error ? (
                <p>Error: {error}</p>
            ) : (
                <div style={{maxWidth: '40rem'}}>
                    <p style={{fontSize: '30px', fontStyle: 'italic'}}>"{slip}"</p>
                    <button
                        onClick={fetchHandler}
                        title={'Refresh the advice'}
                        type={'button'}>
                        Refresh
                    </button>
                </div>
            )}
        </>
    );
}

export default App;