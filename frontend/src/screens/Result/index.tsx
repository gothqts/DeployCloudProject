import {useState, useEffect} from "react";
import {urls} from "../../navigate/urls.ts";
import styles from './result.module.css';
import {Link} from "react-router";
import resultApi from "./resultApi.ts";

interface MixRecord {
    color1: string;
    color2: string;
    result: string;
    timestamp: string;
}

const Result = () => {
    const [previousMixes, setPreviousMixes] = useState<MixRecord[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        resultApi.fetchHistory().then((resp) => {
            setPreviousMixes(resp);
        })
        setIsLoading(false)


    }, []);

    const formatDate = (timestamp: string) => {
        return new Date(timestamp).toLocaleString();
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.header}>Color Mix Result</h1>
            <h2 className={styles.historyHeader}>Previous Mixes</h2>

            {isLoading ? (
                <p>Loading history...</p>
            ) : previousMixes.length > 0 ? (
                <div className={styles.tableContainer}>
                    <table className={styles.mixTable}>
                        <thead>
                        <tr>
                            <th>Color 1</th>
                            <th>Color 2</th>
                            <th>Result</th>
                            <th>Time</th>
                        </tr>
                        </thead>
                        <tbody>
                        {previousMixes.map((mix, index) => (
                            <tr key={index}>
                                <td>
                                    <div
                                        className={styles.colorCell}
                                        style={{backgroundColor: mix.color1}}
                                    />
                                </td>
                                <td>
                                    <div
                                        className={styles.colorCell}
                                        style={{backgroundColor: mix.color2}}
                                    />
                                </td>
                                <td>
                                    <div
                                        className={styles.colorCell}
                                        style={{backgroundColor: mix.result}}
                                    />
                                    <span className={styles.colorHex}>{mix.result}</span>
                                </td>
                                <td>{formatDate(mix.timestamp)}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p>No mix history available</p>
            )}

            <Link to={urls.selectColor} className={styles.backLink}>
                Back to mixer
            </Link>
        </div>
    );
};

export default Result;