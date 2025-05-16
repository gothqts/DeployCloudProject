import { useState, useEffect } from "react";
import { urls } from "../../navigate/urls.ts";
import styles from './result.module.css';
import {Link} from "react-router";

interface MixRecord {
    color1: string;
    color2: string;
    result: string;
    timestamp: string;
}

const Result = () => {
    const [currentColor, setCurrentColor] = useState<string>('');
    const [previousMixes, setPreviousMixes] = useState<MixRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCurrentColor = async () => {
            try {
                const response = await fetch('/api/color/current');
                const data = await response.json();
                setCurrentColor(data.color);
            } catch (error) {
                console.error('Error fetching current color:', error);
            }
        };

        const fetchMixHistory = async () => {
            try {
                const response = await fetch('/api/color/history');
                const data = await response.json();
                setPreviousMixes(data.history);
            } catch (error) {
                console.error('Error fetching mix history:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCurrentColor();
        fetchMixHistory();
    }, []);

    const formatDate = (timestamp: string) => {
        return new Date(timestamp).toLocaleString();
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.header}>Color Mix Result</h1>

            {currentColor && (
                <div className={styles.currentColorSection}>
                    <h2>Current Mix Result</h2>
                    <div
                        className={styles.colorDisplay}
                        style={{ backgroundColor: currentColor }}
                    />
                    <p className={styles.colorHex}>{currentColor}</p>
                </div>
            )}

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
                                        style={{ backgroundColor: mix.color1 }}
                                    />
                                </td>
                                <td>
                                    <div
                                        className={styles.colorCell}
                                        style={{ backgroundColor: mix.color2 }}
                                    />
                                </td>
                                <td>
                                    <div
                                        className={styles.colorCell}
                                        style={{ backgroundColor: mix.result }}
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