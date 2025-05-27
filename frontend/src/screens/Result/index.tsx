import {useState, useEffect} from "react";
import {urls} from "../../navigate/urls.ts";
import styles from './result.module.css';
import {Link} from "react-router"
import resultApi from "./resultApi.ts";

interface MixRecord {
    id: number;
    color1: string;
    color2: string;
    result: string;
    timestamp: string;
}

const Result = () => {
    const [previousMixes, setPreviousMixes] = useState<MixRecord[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editColors, setEditColors] = useState({color1: '', color2: ''});

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = () => {
        setIsLoading(true);
        resultApi.fetchHistory().then((resp) => {
            setPreviousMixes(resp);
            setIsLoading(false);
        }).catch(() => {
            setIsLoading(false);
        });
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this mix?')) {
            try {
                await resultApi.deleteMix(id);
                loadHistory();
            } catch (error) {
                console.error('Error deleting mix:', error);
            }
        }
    };

    const handleEdit = (mix: MixRecord) => {
        setEditingId(mix.id);
        setEditColors({color1: mix.color1, color2: mix.color2});
    };

    const handleEditChange = (field: keyof typeof editColors, value: string) => {
        setEditColors(prev => ({...prev, [field]: value}));
    };

    const handleUpdate = async (id: number) => {
        try {
            await resultApi.updateMix(id, editColors.color1, editColors.color2);
            setEditingId(null);
            loadHistory();
        } catch (error) {
            console.error('Error updating mix:', error);
        }
    };

    const handleCancelEdit = () => {
        setEditingId(null);
    };

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
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {previousMixes.map((mix) => (
                            <tr key={mix.id}>
                                <td>
                                    {editingId === mix.id ? (
                                        <select
                                            value={editColors.color1}
                                            onChange={(e) => handleEditChange('color1', e.target.value)}
                                            className={styles.editSelect}
                                        >
                                            <option value="red">Red</option>
                                            <option value="blue">Blue</option>
                                            <option value="yellow">Yellow</option>
                                        </select>
                                    ) : (
                                        <div
                                            className={styles.colorCell}
                                            style={{backgroundColor: mix.color1}}
                                        />
                                    )}
                                </td>
                                <td>
                                    {editingId === mix.id ? (
                                        <select
                                            value={editColors.color2}
                                            onChange={(e) => handleEditChange('color2', e.target.value)}
                                            className={styles.editSelect}
                                        >
                                            <option value="red">Red</option>
                                            <option value="blue">Blue</option>
                                            <option value="yellow">Yellow</option>
                                        </select>
                                    ) : (
                                        <div
                                            className={styles.colorCell}
                                            style={{backgroundColor: mix.color2}}
                                        />
                                    )}
                                </td>
                                <td>
                                    <div
                                        className={styles.colorCell}
                                        style={{backgroundColor: mix.result}}
                                    />
                                    <span className={styles.colorHex}>{mix.result}</span>
                                </td>
                                <td>{formatDate(mix.timestamp)}</td>
                                <td>
                                    {editingId === mix.id ? (
                                        <>
                                            <button
                                                onClick={() => handleUpdate(mix.id)}
                                                className={styles.actionButton}
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={handleCancelEdit}
                                                className={styles.actionButton}
                                            >
                                                Cancel
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => handleEdit(mix)}
                                                className={styles.actionButton}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(mix.id)}
                                                className={styles.actionButton}
                                            >
                                                Delete
                                            </button>
                                        </>
                                    )}
                                </td>
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